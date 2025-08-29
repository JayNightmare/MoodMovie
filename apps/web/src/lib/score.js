/**
 * Scores a movie based on a given specification for tie-breaking.
 * @param {object} movie - The movie object.
 * @param {object} spec - The candidate spec from the AI.
 * @returns {number} - The score.
 */
export function scoreMovie(movie, spec) {
    let score = 0;
    if (!movie || !spec) return score;

    // IMDb rating bonus
    if (movie.imdbRating) {
        score += movie.imdbRating * 0.5;
    }

    // Tag match bonus
    if (movie.tagsMatched && spec.includeTags) {
        const tagIntersection = movie.tagsMatched.filter((tag) =>
            spec.includeTags.includes(tag)
        );
        score += tagIntersection.length * 2;
    }

    // Genre match bonus
    if (movie.genres && spec.includeGenres) {
        const genreIntersection = movie.genres.filter((genre) =>
            spec.includeGenres.includes(genre)
        );
        score += genreIntersection.length;
    }

    return score;
}
