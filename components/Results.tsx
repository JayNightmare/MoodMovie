import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, RefreshCw, Heart, Plus } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getMoreMovies } from '../utils/ai-logic';
import { UserResponse } from '../App';

interface ResultsProps {
  movies: Movie[];
  onTryAgain: () => void;
  onPerfectMatch: (movie: Movie) => void;
  partial?: boolean; // indicates recommendations came from early stop
  showAds?: boolean;
  setMovies?: (m: Movie[]) => void;
  responses?: UserResponse[];
}

export function Results({ movies, onTryAgain, onPerfectMatch, partial, showAds, setMovies, responses = [] }: ResultsProps) {
  const [expansions, setExpansions] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);
  const maxExpansions = 3;

  const handleExpand = async () => {
    if (isExpanding || expansions >= maxExpansions) return;
    if (!setMovies) return;
    setIsExpanding(true);
    try {
      const more = await getMoreMovies(responses, movies.map(m=>m.id));
      if (more.length) {
        // Deduplicate by id
        const existing = new Set(movies.map(m=>m.id));
        const merged = [...movies];
        for (const mv of more) if (!existing.has(mv.id)) merged.push(mv);
        setMovies(merged.slice(0, 12));
        setExpansions(e => e + 1);
      }
    } finally {
      setIsExpanding(false);
    }
  };
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-3xl font-medium">Your Perfect Movie Matches</h1>
          <p className="text-muted-foreground">Based on your preferences, here are your recommendations{movies.length>3?` (${movies.length} shown)`:''}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            <Card key={movie.id} className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-shadow">
              <div className="relative">
                <ImageWithFallback
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    #{index + 1} Match
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground border-0">
                    {Math.round(movie.matchScore)}% Match
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-medium">{movie.title}</h3>
                  <p className="text-muted-foreground">{movie.year}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{movie.rating}</span>
                  <span className="text-muted-foreground">/ 10</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {movie.genre.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {movie.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Available on:</p>
                  <div className="flex flex-wrap gap-1">
                    {movie.streamingServices.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => onPerfectMatch(movie)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Perfect Match
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
          {expansions < maxExpansions && (
            <Button onClick={handleExpand} variant="secondary" disabled={isExpanding} className="gap-2">
              <Plus className="h-4 w-4" />
              {isExpanding ? 'Loading more...' : 'Show More'}
              {expansions>0 && <span className="text-xs opacity-70">({maxExpansions-expansions} left)</span>}
            </Button>
          )}
          <Button variant="outline" onClick={onTryAgain} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground pb-8 space-y-1">
          <p>Not finding what you're looking for? Try answering the questions differently for new recommendations.</p>
          {partial && <p>You stopped early. Continue the remaining questions for a more precise match.</p>}
        </div>
      </div>
    </div>
  );
}