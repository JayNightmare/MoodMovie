import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { UserResponse, Movie } from "../App";
import {
  getQuestionSet,
  shouldStopQuestioning,
  getMovieRecommendations,
  testServerConnection,
} from "../utils/ai-logic";
import { Question } from "../types/questions";

interface QuestionFlowProps {
  onComplete: (responses: UserResponse[], movies: Movie[]) => void;
  initialResponses?: UserResponse[]; // resume mode
}

export function QuestionFlow({ onComplete, initialResponses = [] }: QuestionFlowProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>(initialResponses);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalQuestions = questions.length || 5; // default to 5 for progress baseline

  useEffect(() => {
    // Test server connection and get the first question
    const loadFirstQuestion = async () => {
      setIsLoading(true);

      // Test server connectivity first
      const serverTest = await testServerConnection();
      if (!serverTest.success) {
        console.warn(
          "Server connectivity issues:",
          serverTest.message,
        );
      }

    const questionSet = await getQuestionSet(responses);
    setQuestions(questionSet);
    // If resuming, set current index to number of responses (bounded)
    setCurrentIndex(Math.min(responses.length, questionSet.length - 1));
      setIsLoading(false);
    };
    loadFirstQuestion();
  }, []);

  const handleAnswer = async (
    answer: string,
    value?: number,
  ) => {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return;

    const newResponse: UserResponse = {
      questionId: currentQuestion.id,
      answer,
      value,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setIsLoading(true);

    // Update progress
    setProgress(
      Math.min((updatedResponses.length / totalQuestions) * 100, 100),
    );

    // Check if we should stop questioning
    // Determine if we should stop early (still allow AI to shorten flow)
  const shouldStop = await shouldStopQuestioning(updatedResponses);

  if (shouldStop || currentIndex >= questions.length - 1) {
      const movies = await getMovieRecommendations(updatedResponses);
      onComplete(updatedResponses, movies);
    } else {
      setCurrentIndex((idx) => idx + 1);
    }

    setIsLoading(false);
  };

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Loading your first question...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium">
            Find Your Perfect Movie
          </h1>
          <p className="text-muted-foreground">
            Tell us about your mood and we'll recommend
            something great
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="space-y-6">
              <h2 className="text-xl text-center">
                {currentQuestion.text}
              </h2>

              {currentQuestion.type === "multiple-choice" && (
                <div className="grid gap-3">
                  {currentQuestion.options?.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      onClick={() =>
                        handleAnswer(
                          option.value,
                          option.weight,
                        )
                      }
                      disabled={isLoading}
                    >
                      <div>
                        <div className="font-medium">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "scale" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        className="aspect-square"
                        onClick={() =>
                          handleAnswer(value.toString(), value)
                        }
                        disabled={isLoading}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {currentQuestion.scaleLabels?.[0] ||
                        "Not at all"}
                    </span>
                    <span>
                      {currentQuestion.scaleLabels?.[1] ||
                        "Absolutely"}
                    </span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">
                    {responses.length === 0
                      ? "Getting started..."
                      : responses.length >= 3
                        ? "Finding your perfect movies..."
                        : "Thinking of the next question..."}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Question {responses.length + 1} of {totalQuestions}
        </div>
      </div>
    </div>
  );
}