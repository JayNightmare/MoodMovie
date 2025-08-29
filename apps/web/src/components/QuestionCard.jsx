import { motion } from "framer-motion";
import AnswerChips from "./AnswerChips";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export default function QuestionCard({
    question,
    onAnswer,
    onBack,
    canGoBack,
}) {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center">
                {question.question}
            </h2>
            <AnswerChips
                options={question.answers}
                onSelect={onAnswer}
                type={question.type || "singleselect"}
            />
            {canGoBack && (
                <div className="mt-6 text-center">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        Back
                    </button>
                </div>
            )}
        </motion.div>
    );
}
