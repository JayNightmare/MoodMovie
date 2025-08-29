import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFlowStore } from "../state/flowStore";
import { aiClient } from "../lib/aiClient";
import QuestionCard from "../components/QuestionCard";
import ProgressDots from "../components/ProgressDots";
import Spinner from "../components/Spinner";
import initialQuestions from "../data/questions.json";

export default function Landing() {
    const navigate = useNavigate();
    const {
        status,
        answers,
        questions,
        currentQuestionIndex,
        addAnswer,
        setQuestions,
        setSpec,
        setStatus,
        start,
        reset,
    } = useFlowStore();

    useEffect(() => {
        if (status === "idle") {
            start();
            setQuestions(initialQuestions);
        }
    }, [status, start, setQuestions]);

    useEffect(() => {
        if (
            status === "asking" &&
            currentQuestionIndex > 0 &&
            currentQuestionIndex > answers.length
        ) {
            setStatus("deciding");
            aiClient
                .next(answers)
                .then((res) => {
                    if (res.stop) {
                        setSpec(res.spec);
                        navigate("/results");
                    } else {
                        // This logic would be for AI-driven questions.
                        // For now, we just use the static list.
                        setStatus("asking");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setStatus("error");
                });
        }
    }, [currentQuestionIndex, answers, status, navigate, setSpec, setStatus]);

    const handleAnswer = (answer) => {
        const currentQ = questions[currentQuestionIndex];
        addAnswer({ question: currentQ.question, answer });
        if (currentQuestionIndex >= 4) {
            // Simplified logic to stop
            setStatus("deciding");
            aiClient
                .next([...answers, { question: currentQ.question, answer }])
                .then((res) => {
                    if (res.stop) {
                        setSpec(res.spec);
                        navigate("/results");
                    } else {
                        // Fallback to simple flow if AI wants more questions
                        if (currentQuestionIndex + 1 >= questions.length) {
                            setSpec({}); // Empty spec to trigger search
                            navigate("/results");
                        } else {
                            setStatus("asking");
                        }
                    }
                });
        }
    };

    const handleBack = () => {
        // Simplified back logic
        reset();
    };

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {status === "asking" && currentQ ? (
                <>
                    <QuestionCard
                        question={currentQ}
                        onAnswer={handleAnswer}
                        onBack={handleBack}
                        canGoBack={currentQuestionIndex > 0}
                    />
                    <ProgressDots total={5} current={currentQuestionIndex} />
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );
}
