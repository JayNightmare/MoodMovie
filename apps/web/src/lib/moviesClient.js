const API_BASE = import.meta.env.VITE_API_BASE;

export const moviesClient = {
    async search(spec) {
        const response = await fetch(`${API_BASE}/movies/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spec }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message || "Movie search failed");
        }
        return response.json();
    },

    async getProviders(tmdbId, region = "GB") {
        const response = await fetch(
            `${API_BASE}/movies/providers?tmdbId=${tmdbId}&region=${region}`
        );
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message || "Failed to get providers");
        }
        return response.json();
    },

    async postToDiscord({ movies, rating, region }) {
        await fetch(`${API_BASE}/events/discord`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movies, rating, region }),
        });
    },
};
