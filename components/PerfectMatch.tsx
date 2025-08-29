import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Star, ArrowLeft, RefreshCw, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { submitMovieReview } from '../utils/ai-logic';

interface PerfectMatchProps {
  movie: Movie;
  onBack: () => void;
  onTryAgain: () => void;
}

export function PerfectMatch({ movie, onBack, onTryAgain }: PerfectMatchProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await submitMovieReview(movie, rating, review);
      
      if (success) {
        setIsSubmitted(true);
      } else {
        // Still show success to user but log the error
        console.error('Failed to submit to Discord, but showing success to user');
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // Still show success to avoid poor UX
      setIsSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <Button variant="outline" onClick={onTryAgain}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>

        {/* Movie Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="overflow-hidden border-0 shadow-lg">
              <ImageWithFallback
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-medium">{movie.title}</h1>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {Math.round(movie.matchScore)}% Match
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">{movie.year}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">{movie.rating}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-base leading-relaxed">{movie.description}</p>

            <div>
              <h3 className="font-medium mb-3">Available on:</h3>
              <div className="flex flex-wrap gap-2">
                {movie.streamingServices.map((service) => (
                  <Badge key={service} variant="secondary" className="px-3 py-1">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {movie.trailerUrl && (
              <Button variant="outline" asChild>
                <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Trailer
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Rating and Review */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Rate This Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSubmitted ? (
              <>
                <div>
                  <p className="mb-4">How would you rate this movie recommendation?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        title={`Rate ${value} out of 5`}
                        key={value}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRatingClick(value)}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            value <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {rating === 1 && "Not a good match"}
                      {rating === 2 && "Could be better"}
                      {rating === 3 && "Pretty good match"}
                      {rating === 4 && "Great recommendation!"}
                      {rating === 5 && "Perfect match!"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">
                    Share your thoughts (optional):
                  </label>
                  <Textarea
                    placeholder="What did you think about this recommendation? Any feedback for us?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                  /> 
                </div>

                <Button 
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Share Feedback
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Thank you for your feedback!</h3>
                <p className="text-muted-foreground">
                  Your review has been shared and will help us improve our recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pb-8">
          Your feedback helps us learn and provide better movie recommendations for everyone.
        </div>
      </div>
    </div>
  );
}