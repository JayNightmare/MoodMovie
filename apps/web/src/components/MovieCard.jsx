import { motion } from "framer-motion";

export default function MovieCard({ movie }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
        >
            <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-auto object-cover aspect-[2/3]"
            />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold">
                    {movie.title} ({movie.year})
                </h3>
                {movie.imdbRating && (
                    <p className="text-yellow-400">IMDb: {movie.imdbRating}</p>
                )}
                <p className="text-gray-400 text-sm mt-2 flex-grow">
                    {movie.plot}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {movie.genres?.map((genre) => (
                        <span
                            key={genre}
                            className="bg-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                            {genre}
                        </span>
                    ))}
                    {movie.tagsMatched?.map((tag) => (
                        <span
                            key={tag}
                            className="bg-accent text-xs px-2 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
