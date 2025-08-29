export interface Env {
    OPENROUTER_API_KEY: string;
    OMDB_API_KEY: string;
    TMDB_API_KEY: string;
    DISCORD_WEBHOOK_URL: string;
    ALLOWED_ORIGINS: string;
}

const SYSTEM_PROMPT = `You are a movie‑matching flow engine. Your job: pick the next best question to ask,
and decide when there is enough information to confidently create a candidate
movie selection spec.

Output JSON only. No prose. Keep questions short (max ~12 words).
Avoid leading questions. Offer 3–6 answer options + an "Other/Skip".

When ready, emit a CandidateSpec with fields:
- includeGenres: string[]
- excludeGenres: string[]
- includeTags: string[] (e.g., slow‑burn, upbeat, gritty, surreal, feel‑good)
- avoidTags: string[] (e.g., jump‑scares, explicit gore, nihilistic)
- languages: string[] (ISO639‑1)
- yearRange: [number, number]
- runtimeRange: [number, number]
- maturityMax: string (e.g., PG‑13/12A)
- energy: "low" | "medium" | "high"
- popularVsCritic: "popular" | "balanced" | "critic"
- moodSummary: string (one‑line rationale)`;

async function handleAiNext(request: Request, env: Env) {
    const { answersSoFar } = await request.json();

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openrouter/anthropic/claude-3.5-sonnet",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    {
                        role: "user",
                        content: `Answers so far: ${JSON.stringify(
                            answersSoFar
                        )}`,
                    },
                ],
                response_format: { type: "json_object" },
            }),
        }
    );

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return new Response(data.choices[0].message.content, {
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify({ error: "AI query failed" }), {
        status: 500,
    });
}

async function handleMoviesSearch(request: Request, env: Env) {
    // In a real implementation, this would call TMDb/OMDb
    // For this scaffold, we return mock data.
    const mockMovies = [
        {
            id: "tmdb1",
            imdbId: "tt0111161",
            title: "The Shawshank Redemption",
            year: 1994,
            posterUrl:
                "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            imdbRating: 9.3,
            genres: ["Drama"],
            tagsMatched: ["redemption"],
        },
        {
            id: "tmdb2",
            imdbId: "tt0068646",
            title: "The Godfather",
            year: 1972,
            posterUrl:
                "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            imdbRating: 9.2,
            genres: ["Drama", "Crime"],
            tagsMatched: ["gritty"],
        },
        {
            id: "tmdb3",
            imdbId: "tt0468569",
            title: "The Dark Knight",
            year: 2008,
            posterUrl:
                "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            imdbRating: 9.0,
            genres: ["Action", "Crime", "Drama"],
            tagsMatched: ["dark"],
        },
    ];
    return new Response(JSON.stringify(mockMovies), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleMoviesProviders(request: Request, env: Env) {
    const url = new URL(request.url);
    const tmdbId = url.searchParams.get("tmdbId");
    // Mock data
    const providers = {
        results: {
            GB: {
                flatrate: [
                    {
                        provider_name: "Netflix",
                        logo_path: "/t2yyOv40HZeVlLjNgLPE8_7AL4o.jpg",
                    },
                ],
            },
        },
    };
    return new Response(JSON.stringify(providers), {
        headers: { "Content-Type": "application/json" },
    });
}

async function handleDiscordEvent(request: Request, env: Env) {
    const { movies, rating } = await request.json();
    const embed = {
        username: "Mood→Movie",
        embeds: [
            {
                title: "Perfect Match found",
                description: `⭐ ${rating}/5 — Top picks`,
                fields: movies.map((m, i) => ({
                    name: `${i + 1}`,
                    value: `${m.title} (${m.year}) — IMDb ${m.imdbRating}`,
                })),
                color: 5814783,
                footer: { text: "mood2movie | GB" },
            },
        ],
    };

    await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
    });

    return new Response(null, { status: 204 });
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        const corsHeaders = {
            "Access-Control-Allow-Origin": env.ALLOWED_ORIGINS.split(",")[0],
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        let response: Response;

        try {
            if (path === "/ai/next") {
                response = await handleAiNext(request, env);
            } else if (path === "/movies/search") {
                response = await handleMoviesSearch(request, env);
            } else if (path === "/movies/providers") {
                response = await handleMoviesProviders(request, env);
            } else if (path === "/events/discord") {
                response = await handleDiscordEvent(request, env);
            } else {
                response = new Response("Not Found", { status: 404 });
            }
        } catch (e) {
            console.error(e);
            response = new Response(
                JSON.stringify({ error: { message: e.message } }),
                { status: 500 }
            );
        }

        // Add CORS headers to the response
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
            newHeaders.set(key, value);
        });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    },
};
