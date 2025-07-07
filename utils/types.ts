export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  homepage: string;
  status: string;
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface MovieImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
}

export interface MovieImagesResponse {
  backdrops: MovieImage[];
  posters: MovieImage[];
  id: number;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}
