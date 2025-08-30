import { UserResponse, Movie } from "../App";
import { Question } from "../types/questions";
// import { projectId, publicAnonKey } from "./supabase/info";

// const supabaseProjectId = projectId
//     ? projectId
//     : import.meta.env.VITE_SUPABASE_PROJECT_ID;
const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

// const supabaseAnonKey = publicAnonKey
//     ? publicAnonKey
//     : import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback question set for when API fails entirely or returns malformed data
const fallbackQuestions: Question[] = [
    {
        id: "mood-primary",
        text: "How are you feeling right now?",
        type: "multiple-choice",
        category: "mood",
        options: [
            {
                label: "Adventurous & Energetic",
                value: "adventurous",
                description: "Ready for action and excitement",
                weight: 5,
            },
            {
                label: "Relaxed & Contemplative",
                value: "contemplative",
                description: "In the mood for something thoughtful",
                weight: 3,
            },
            {
                label: "Happy & Upbeat",
                value: "happy",
                description: "Want something fun and light",
                weight: 4,
            },
            {
                label: "Stressed & Need Escape",
                value: "escape",
                description: "Looking to unwind and forget",
                weight: 2,
            },
            {
                label: "Curious & Intellectual",
                value: "curious",
                description: "Want to learn or be challenged",
                weight: 4,
            },
        ],
    },
    {
        id: "energy-level",
        text: "What's your current energy level?",
        type: "scale",
        category: "mood",
        scaleLabels: ["Low", "High"],
    },
    {
        id: "social-preference",
        text: "Do you want something to watch alone or with others?",
        type: "multiple-choice",
        category: "setting",
        options: [
            { label: "Solo viewing", value: "solo", weight: 3 },
            { label: "With friends", value: "friends", weight: 4 },
            { label: "Family friendly", value: "family", weight: 5 },
        ],
    },
    {
        id: "familiar-vs-new",
        text: "Are you craving something familiar or something new?",
        type: "multiple-choice",
        category: "genre",
        options: [
            { label: "Comfort rewatch", value: "familiar", weight: 5 },
            { label: "Something fresh", value: "new", weight: 5 },
            { label: "Either works", value: "either", weight: 3 },
        ],
    },
    {
        id: "intensity-level",
        text: "How intense do you want the experience to be?",
        type: "scale",
        category: "intensity",
        scaleLabels: ["Chill", "Very intense"],
    },
];

// Single-question fallback retained for backward compatibility with existing getNextQuestion flow
const fallbackQuestion = fallbackQuestions[0];

// New bulk question fetcher - returns up to 5 questions (will fallback if API fails)
export async function getQuestionSet(
    responses: UserResponse[]
): Promise<Question[]> {
    try {
        const response = await fetch(
            `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-4bf7affd/next-question`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ responses }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Bulk question request failed",
                response.status,
                errorText
            );
            throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        // Accept either data.questions (preferred) or single question field
        if (Array.isArray(data.questions) && data.questions.length) {
            return data.questions as Question[];
        }
        if (data.question) {
            return [data.question as Question];
        }
        throw new Error("Malformed question set response");
    } catch (e) {
        console.error(
            "Error fetching question set, using fallback questions:",
            e
        );
        return fallbackQuestions;
    }
}

export async function shouldStopQuestioning(
    responses: UserResponse[]
): Promise<boolean> {
    try {
        // Always stop after 5 questions
        if (responses.length >= 5) return true;

        // For first 2 questions, never stop
        if (responses.length < 3) return false;

        console.log("Checking if should stop for responses:", responses);

        const response = await fetch(
            `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-4bf7affd/should-stop`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ responses }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Should-stop server error:",
                response.status,
                response.statusText,
                errorText
            );
            throw new Error(
                `Server error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Should stop response:", data);

        return data.shouldStop || responses.length >= 4;
    } catch (error) {
        console.error("Error checking if should stop:", error);
        // Fallback logic
        const fallbackDecision = responses.length >= 4;
        console.log("Using fallback decision:", fallbackDecision);
        return fallbackDecision;
    }
}

export async function getMovieRecommendations(
    responses: UserResponse[]
): Promise<Movie[]> {
    try {
        console.log("Getting movie recommendations for responses:", responses);

        const response = await fetch(
            `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-4bf7affd/recommendations`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ responses }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Recommendations server error:",
                response.status,
                response.statusText,
                errorText
            );
            throw new Error(
                `Server error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Received recommendations:", data);

        if (!data.movies || !Array.isArray(data.movies)) {
            throw new Error("Invalid movie recommendations response");
        }

        return data.movies;
    } catch (error) {
        console.error("Error getting movie recommendations:", error);
        console.log("Using fallback movie database");

        // Fallback to mock data
        const { popularMovies } = await import("./movie-database");
        const fallbackList = await popularMovies(20, undefined, false); // fast (no enrich) pull
        return fallbackList
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((movie) => ({
                ...movie,
                matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
            }));
    }
}

export async function submitMovieReview(
    movie: Movie,
    rating: number,
    review: string
): Promise<boolean> {
    try {
        const response = await fetch(
            `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-4bf7affd/submit-review`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({ movie, rating, review }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Review submission server error:",
                response.status,
                response.statusText,
                errorText
            );
            throw new Error(
                `Server error: ${response.status} ${response.statusText}`
            );
        }

        return true;
    } catch (error) {
        console.error("Error submitting review:", error);
        return false;
    }
}

// Test function to verify server connectivity
export async function testServerConnection(): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        console.log("Testing server connection...");

        const response = await fetch(
            `https://${supabaseProjectId}.supabase.co/functions/v1/make-server-4bf7affd/test`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${supabaseAnonKey}`,
                },
                body: JSON.stringify({
                    test: true,
                    timestamp: new Date().toISOString(),
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Server test failed: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        console.log("Server test result:", data);

        return {
            success: true,
            message: "Server connection successful",
        };
    } catch (error) {
        console.error("Server connection test failed:", error);
        return {
            success: false,
            message: `Server connection failed: ${
                error instanceof Error ? error.message : String(error)
            }`,
        };
    }
}
