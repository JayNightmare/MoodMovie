import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { classNames } from "../lib/utils";

export default function AnswerChips({
    options,
    onSelect,
    type = "singleselect",
}) {
    const [selected, setSelected] = useState([]);

    const handleSelect = (option) => {
        if (type === "multiselect") {
            setSelected((current) =>
                current.includes(option)
                    ? current.filter((item) => item !== option)
                    : [...current, option]
            );
        } else {
            onSelect(option);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            const num = parseInt(e.key);
            if (!isNaN(num) && num > 0 && num <= options.length) {
                handleSelect(options[num - 1]);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [options, onSelect]);

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {options.map((option, index) => (
                <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(option)}
                    className={classNames(
                        "btn",
                        selected.includes(option)
                            ? "btn-primary"
                            : "btn-secondary"
                    )}
                >
                    <span className="mr-2 bg-gray-600 text-xs rounded-full px-2 py-1">
                        {index + 1}
                    </span>
                    {option}
                </motion.button>
            ))}
            {type === "multiselect" && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(selected)}
                    className="btn btn-primary w-full mt-4"
                >
                    Continue
                </motion.button>
            )}
        </div>
    );
}
