import { motion } from "framer-motion";

export default function ProgressDots({ total, current }) {
    return (
        <div className="flex justify-center gap-2 my-4">
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    animate={{
                        backgroundColor: i < current ? "#38bdf8" : "#4b5563",
                    }}
                />
            ))}
        </div>
    );
}
