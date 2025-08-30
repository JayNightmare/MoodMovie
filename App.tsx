import React, { useState } from 'react';
import { QuestionFlow } from './components/QuestionFlow';
import { Results } from './components/Results';
import { PerfectMatch } from './components/PerfectMatch';
import { ThemeToggle } from './components/ThemeToggle';
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

  const handleQuestioningComplete = (responses: UserResponse[], movies: Movie[]) => {
    setResponses(responses);
    setRecommendedMovies(movies);
    setAppState('results');
  };

  const handleTryAgain = () => {
    setResponses([]);
    setRecommendedMovies([]);
    setSelectedMovie(null);
    setAppState('questioning');
  };

  const handlePerfectMatch = (movie: Movie) => {
    setSelectedMovie(movie);
    setAppState('perfect-match');
  };

  const handleBackToResults = () => {
    setAppState('results');
  };

  return (
    <ErrorBoundary onReset={handleTryAgain}>
  <div className="min-h-screen bg-background transition-colors duration-300">
        <header className="w-full flex items-center justify-end p-4 gap-2">
          <ThemeToggle />
        </header>
        {appState === 'questioning' && (
          <QuestionFlow onComplete={handleQuestioningComplete} />
        )}
        
        {appState === 'results' && (
          <Results 
            movies={recommendedMovies}
            onTryAgain={handleTryAgain}
            onPerfectMatch={handlePerfectMatch}
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