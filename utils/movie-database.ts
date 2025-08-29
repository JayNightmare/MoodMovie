import { Movie } from '../App';

export const movieDatabase: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    year: 2010,
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.8,
    matchScore: 0,
    streamingServices: ['Netflix', 'Amazon Prime', 'HBO Max'],
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
  },
  {
    id: '2',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genre: ['Comedy', 'Drama', 'Adventure'],
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.1,
    matchScore: 0,
    streamingServices: ['Disney+', 'Hulu', 'Amazon Prime']
  },
  {
    id: '3',
    title: 'Mad Max: Fury Road',
    year: 2015,
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshipper, and a drifter named Max.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.1,
    matchScore: 0,
    streamingServices: ['HBO Max', 'Amazon Prime']
  },
  {
    id: '4',
    title: 'Her',
    year: 2013,
    genre: ['Romance', 'Drama', 'Sci-Fi'],
    description: 'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.0,
    matchScore: 0,
    streamingServices: ['Netflix', 'Amazon Prime']
  },
  {
    id: '5',
    title: 'Parasite',
    year: 2019,
    genre: ['Drama', 'Thriller', 'Dark Comedy'],
    description: 'A poor family schemes to become employed by a wealthy family by infiltrating their household and posing as unrelated, highly qualified individuals.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.6,
    matchScore: 0,
    streamingServices: ['Hulu', 'Amazon Prime']
  },
  {
    id: '6',
    title: 'Spirited Away',
    year: 2001,
    genre: ['Animation', 'Adventure', 'Fantasy'],
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 9.2,
    matchScore: 0,
    streamingServices: ['HBO Max', 'Netflix']
  },
  {
    id: '7',
    title: 'The Social Network',
    year: 2010,
    genre: ['Biography', 'Drama'],
    description: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 7.7,
    matchScore: 0,
    streamingServices: ['Netflix', 'Amazon Prime']
  },
  {
    id: '8',
    title: 'Knives Out',
    year: 2019,
    genre: ['Comedy', 'Crime', 'Mystery'],
    description: 'A detective investigates the death of a patriarch of an eccentric, combative family.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 7.9,
    matchScore: 0,
    streamingServices: ['Amazon Prime', 'Hulu']
  },
  {
    id: '9',
    title: 'Dune',
    year: 2021,
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.0,
    matchScore: 0,
    streamingServices: ['HBO Max', 'Amazon Prime']
  },
  {
    id: '10',
    title: 'La La Land',
    year: 2016,
    genre: ['Comedy', 'Drama', 'Musical'],
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    poster: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NTYzOTgyOTd8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 8.0,
    matchScore: 0,
    streamingServices: ['Netflix', 'Amazon Prime', 'Hulu']
  }
];