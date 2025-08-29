import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../state/flowStore";
import { moviesClient } from "../lib/moviesClient";
import MovieCard from "../components/MovieCard";
import ProvidersModal from "../components/ProvidersModal";
import RatingStars from "../components/RatingStars";
import { motion } from "framer-motion";

export default function Match() {
    const navigate = useNavigate();
    const { movies, reset } = useFlowStore();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleShowProviders = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        moviesClient.postToDiscord({ movies, rating, region: "GB" });
        setSubmitted(true);
        setTimeout(() => reset(), 3000);
        setTimeout(() => navigate("/"), 3000);
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">
                    Thanks for your feedback!
                </h1>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-4 max-w-6xl"
        >
            <h1 className="text-3xl font-bold text-center my-8">
                Where to Watch
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {movies.map((movie) => (
                    <div key={movie.id} className="text-center">
                        <MovieCard movie={movie} />
                        <button
                            onClick={() => handleShowProviders(movie)}
                            className="btn btn-secondary mt-4"
                        >
                            Show Providers
                        </button>
                    </div>
                ))}
            </div>
            <div className="text-center mt-12">
                <h2 className="text-2xl font-bold mb-4">How did we do?</h2>
                <RatingStars onRate={setRating} />
                {rating > 0 && (
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary mt-6"
                    >
                        Submit Rating
                    </button>
                )}
            </div>
            {selectedMovie && (
                <ProvidersModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    movie={selectedMovie}
                />
            )}
        </motion.div>
    );
}
