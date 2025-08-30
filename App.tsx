import React, { useState } from 'react';
import { QuestionFlow } from './components/QuestionFlow';
import { Results } from './components/Results';
import { PerfectMatch } from './components/PerfectMatch';
import { ThemeToggle } from './components/ThemeToggle';
import { Funding } from './components/Funding';
import { ErrorBoundary } from './components/ErrorBoundary';

export type UserResponse = {
  questionId: string;
  answer: string;
  value?: number;
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string[];
  description: string;
  poster: string;
  rating: number;
  matchScore: number;
  streamingServices: string[];
  trailerUrl?: string;
};

export type AppState = 'questioning' | 'results' | 'perfect-match';

export default function App() {
  const [appState, setAppState] = useState<AppState>('questioning');
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [partial, setPartial] = useState(false); // whether initial questioning stopped early
  const [partialResponses, setPartialResponses] = useState<UserResponse[]>([]);

  const handleQuestioningComplete = (responses: UserResponse[], movies: Movie[]) => {
    setResponses(responses);
    setPartialResponses(responses);
    setRecommendedMovies(movies);
    // If fewer than 5 responses we consider it partial
    setPartial(responses.length < 5);
    setAppState('results');
  };

  const handleTryAgain = () => {
    setResponses([]);
    setRecommendedMovies([]);
    setSelectedMovie(null);
  setPartial(false);
    setAppState('questioning');
  };

  const handlePerfectMatch = (movie: Movie) => {
    setSelectedMovie(movie);
    setAppState('perfect-match');
  };

  const handleBackToResults = () => {
    setAppState('results');
  };

  const handleContinueQuestions = () => {
    // Resume questioning; keep previous responses.
    // We pass existing responses to QuestionFlow via key technique; adapt component to accept initialResponses.
    setAppState('questioning');
  };

  return (
    <ErrorBoundary onReset={handleTryAgain}>
  <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="w-full flex items-center justify-end p-4 gap-2">
          <Funding />
          <ThemeToggle />
        </header>
        {appState === 'questioning' && (
              <QuestionFlow
                initialResponses={partial ? responses : []}
                onComplete={handleQuestioningComplete}
              />
        )}
        
        {appState === 'results' && (
          <Results
            movies={recommendedMovies}
            onTryAgain={handleTryAgain}
            onPerfectMatch={handlePerfectMatch}
            onContinueQuestions={partial ? handleContinueQuestions : undefined}
            partial={partial}
          />
        )}
        
        {appState === 'perfect-match' && selectedMovie && (
          <PerfectMatch 
            movie={selectedMovie}
            onBack={handleBackToResults}
            onTryAgain={handleTryAgain}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}