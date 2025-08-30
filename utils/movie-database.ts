/**
 * movie-database.ts
 *
 * Purpose:
 * - Replace the static movie array with live data from TMDb.
 * - Provide search() and discover() that return your existing Movie[] shape.
 * - Enrich results with genres, posters, TMDb rating, YouTube trailer URL, and watch providers.
 * - Keep UI minimal; you decide how to rank/score matches.
 *
 * Requirements:
 * - Add VITE_TMDB_API_KEY to your .env (client build-time var).
 * - Optional: set VITE_TMDB_REGION (e.g., "GB") for provider lookup.
 *
 * Caveat:
 * - Client-side API keys are exposed. For production, front this with a Worker/Function proxy.
 */

/// <reference types="vite/client" />

import type { Movie } from "../App";

// Support both browser (Vite) and Supabase Edge (Deno) environments.
// Deno global may not exist in browser builds, so guarded access.
// Priority: explicit TMDB_API_KEY (server) -> VITE_TMDB_API_KEY -> empty string.
// (Server should set TMDB_API_KEY to avoid exposing client key.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any; // in browser this is undefined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _maybeDeno: any = typeof Deno !== "undefined" ? Deno : undefined;
// import.meta is available in ESM; fallback object for safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _maybeImportMeta: any = { env: {} };
try {
    // @ts-ignore
    _maybeImportMeta = import.meta || { env: {} };
} catch (_) {
    /* ignore */
}
const TMDB_API_KEY = (_maybeDeno?.env?.get?.("TMDB_API_KEY") ||
    _maybeDeno?.env?.get?.("VITE_TMDB_API_KEY") ||
    _maybeImportMeta?.env?.VITE_TMDB_API_KEY ||
    "") as string;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const REGION = (import.meta.env.VITE_TMDB_REGION as string) || "GB";

type TmdbMovieLite = {
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview: string;
    poster_path: string | null;
    genre_ids?: number[];
    vote_average: number;
};

type TmdbMovieDetail = {
    id: number;
    title: string;
    release_date?: string;
    overview: string;
    poster_path: string | null;
    genres: { id: number; name: string }[];
    vote_average: number;
};

type DiscoverSpec = {
    withGenres?: number[];
    withoutGenres?: number[];
    yearFrom?: number;
    yearTo?: number;
    runtimeMin?: number;
    runtimeMax?: number;
    language?: string; // ISO-639-1
    sortBy?:
        | "popularity.desc"
        | "vote_average.desc"
        | "primary_release_date.desc";
};

const withKey = (
    url: string,
    params: Record<string, string | number | undefined> = {}
) => {
    const u = new URL(url);
    u.searchParams.set("api_key", TMDB_API_KEY);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
    });
    return u.toString();
};

async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDb error ${res.status}`);
    return res.json() as Promise<T>;
}

async function fetchGenreMap(): Promise<Map<number, string>> {
    const data = await getJSON<{ genres: { id: number; name: string }[] }>(
        withKey(`${TMDB_BASE}/genre/movie/list`, { language: "en-US" })
    );
    return new Map(data.genres.map((g) => [g.id, g.name]));
}

function yearFromDate(d?: string): number | undefined {
    if (!d) return undefined;
    const y = Number(d.slice(0, 4));
    return Number.isFinite(y) ? y : undefined;
}

function posterUrl(path: string | null): string {
    return path
        ? `${IMG_BASE}${path}`
        : "https://placehold.co/400x600?text=No+Image";
}

async function fetchTrailerUrl(tmdbId: number): Promise<string | undefined> {
    const data = await getJSON<{
        results: { site: string; type: string; key: string }[];
    }>(withKey(`${TMDB_BASE}/movie/${tmdbId}/videos`, { language: "en-US" }));
    const trailer = data.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
    );
    return trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : undefined;
}

async function fetchProviders(
    tmdbId: number,
    region = REGION
): Promise<string[]> {
    const data = await getJSON<{
        results: Record<
            string,
            {
                flatrate?: { provider_name: string }[];
                rent?: { provider_name: string }[];
                buy?: { provider_name: string }[];
            }
        >;
    }>(withKey(`${TMDB_BASE}/movie/${tmdbId}/watch/providers`));
    const r = data.results?.[region];
    if (!r) return [];
    const names = new Set<string>();
    (r.flatrate || []).forEach((p) => names.add(p.provider_name));
    (r.rent || []).forEach((p) => names.add(p.provider_name));
    (r.buy || []).forEach((p) => names.add(p.provider_name));
    return [...names];
}

function mapToMovie(
    m: TmdbMovieLite | TmdbMovieDetail,
    genreMap: Map<number, string>,
    trailerUrl?: string,
    providers: string[] = []
): Movie {
    const title = (m as any).title || (m as any).name || "Untitled";
    const y =
        "release_date" in m
            ? yearFromDate(m.release_date)
            : "first_air_date" in m
            ? yearFromDate((m as any).first_air_date)
            : undefined;
    const g: string[] =
        "genres" in m && Array.isArray((m as any).genres)
            ? ((m as any).genres as { id: number; name: string }[]).map(
                  (x) => x.name
              )
            : Array.isArray((m as any).genre_ids)
            ? ((m as any).genre_ids as number[]).map(
                  (id) => genreMap.get(id) || "Unknown"
              )
            : [];
    return {
        id: String((m as any).id),
        title,
        year: y || 0,
        genre: g,
        description: m.overview || "",
        poster: posterUrl(m.poster_path ?? null),
        rating: Number((m as any).vote_average?.toFixed?.(1) ?? 0),
        matchScore: 0,
        streamingServices: providers,
        trailerUrl,
    };
}

/** Public: search by free text (e.g., user typed “blade runner”) */
export async function searchMovies(
    query: string,
    take = 10,
    region = REGION
): Promise<Movie[]> {
    if (!TMDB_API_KEY) throw new Error("VITE_TMDB_API_KEY is missing");
    const [genreMap, searchData] = await Promise.all([
        fetchGenreMap(),
        getJSON<{ results: TmdbMovieLite[] }>(
            withKey(`${TMDB_BASE}/search/movie`, {
                query,
                include_adult: "false",
                language: "en-US",
                page: 1,
            })
        ),
    ]);

    const slice = searchData.results.slice(0, take);
    const enriched = await Promise.all(
        slice.map(async (m) => {
            const [trailer, providers] = await Promise.all([
                fetchTrailerUrl(m.id),
                fetchProviders(m.id, region),
            ]);
            return mapToMovie(m, genreMap, trailer, providers);
        })
    );
    return enriched;
}

/** Public: discover with filters (genres, years, runtime, sort) */
export async function discoverMovies(
    spec: DiscoverSpec = {},
    take = 10,
    region = REGION
): Promise<Movie[]> {
    if (!TMDB_API_KEY) throw new Error("VITE_TMDB_API_KEY is missing");
    const params: Record<string, string | number | undefined> = {
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: 1,
        sort_by: spec.sortBy || "popularity.desc",
        with_genres: spec.withGenres?.join(","),
        without_genres: spec.withoutGenres?.join(","),
        "primary_release_date.gte": spec.yearFrom
            ? `${spec.yearFrom}-01-01`
            : undefined,
        "primary_release_date.lte": spec.yearTo
            ? `${spec.yearTo}-12-31`
            : undefined,
        "with_runtime.gte": spec.runtimeMin,
        "with_runtime.lte": spec.runtimeMax,
        with_original_language: spec.language,
    };

    const [genreMap, data] = await Promise.all([
        fetchGenreMap(),
        getJSON<{ results: TmdbMovieLite[] }>(
            withKey(`${TMDB_BASE}/discover/movie`, params)
        ),
    ]);

    const slice = data.results.slice(0, take);
    const enriched = await Promise.all(
        slice.map(async (m) => {
            const [trailer, providers] = await Promise.all([
                fetchTrailerUrl(m.id),
                fetchProviders(m.id, region),
            ]);
            return mapToMovie(m, genreMap, trailer, providers);
        })
    );
    return enriched;
}

/** Convenience: get top 3 picks, then you can set matchScore separately */
export async function top3ByQuery(
    query: string,
    region = REGION
): Promise<Movie[]> {
    const list = await searchMovies(query, 10, region);
    return list.slice(0, 3);
}

/** Public: simple popular movies list (used for fallback) */
export async function popularMovies(
    take = 10,
    region = REGION,
    enrich = false
): Promise<Movie[]> {
    if (!TMDB_API_KEY) throw new Error("VITE_TMDB_API_KEY is missing");
    // Popular endpoint
    const [genreMap, data] = await Promise.all([
        fetchGenreMap(),
        getJSON<{ results: TmdbMovieLite[] }>(
            withKey(`${TMDB_BASE}/movie/popular`, {
                language: "en-US",
                page: 1,
            })
        ),
    ]);
    const slice = data.results.slice(0, take);
    if (!enrich) {
        // Fast path: no trailer/providers (avoid extra calls in fallback scenarios)
        return slice.map((m) => mapToMovie(m, genreMap));
    }
    const enriched = await Promise.all(
        slice.map(async (m) => {
            const [trailer, providers] = await Promise.all([
                fetchTrailerUrl(m.id).catch(() => undefined),
                fetchProviders(m.id, region).catch(() => []),
            ]);
            return mapToMovie(m, genreMap, trailer, providers);
        })
    );
    return enriched;
}
