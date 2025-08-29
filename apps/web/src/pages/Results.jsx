import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../state/flowStore";
import { moviesClient } from "../lib/moviesClient";
import { scoreMovie } from "../lib/score";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { motion } from "framer-motion";

export default function Results() {
    const navigate = useNavigate();
    const { spec, movies, setMovies, reset, status, setStatus, setError } =
        useFlowStore();

    useEffect(() => {
        if (status === "deciding" && spec) {
            moviesClient
                .search(spec)
                .then((results) => {
                    const sorted = results.sort(
                        (a, b) => scoreMovie(b, spec) - scoreMovie(a, spec)
                    );
                    setMovies(sorted.slice(0, 3));
                })
                .catch((err) => {
                    setError(err.message);
                    setStatus("error");
                });
        }
    }, [spec, status, setMovies, setError, setStatus]);

    if (status === "deciding") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">
                    Error fetching movies
                </h1>
                <button onClick={reset} className="btn btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto p-4 max-w-6xl"
        >
            <h1 className="text-3xl font-bold text-center my-8">
                Your Top 3 Movie Matches
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
                <button onClick={reset} className="btn btn-secondary">
                    Try Again
                </button>
                <button
                    onClick={() => navigate("/match")}
                    className="btn btn-primary"
                >
                    Perfect Match!
                </button>
            </div>
        </motion.div>
    );
}
