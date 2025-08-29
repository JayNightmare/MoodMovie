const API_BASE = import.meta.env.VITE_API_BASE;

export const aiClient = {
    async next(answersSoFar) {
        const response = await fetch(`${API_BASE}/ai/next`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answersSoFar }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message || "AI service failed");
        }
        return response.json();
    },
};
