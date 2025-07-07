const API_KEY = "9f02e7d5e38657a958973c7e9e197463";
const API_READ_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZjAyZTdkNWUzODY1N2E5NTg5NzNjN2U5ZTE5NzQ2MyIsIm5iZiI6MTc1MTg5NDM1My4xNjgsInN1YiI6IjY4NmJjOTUxMmQyMzk5ZGI4YzU0MDBiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uFy0c5iZBwltqVMQcvcStcRoQYmJD4ZXLLDVe9yIyWA";
const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
  "Content-Type": "application/json;charset=utf-8",
};

export async function fetchUpcomingMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/movie/upcoming?language=en-US&page=${page}`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to fetch upcoming movies");
  return res.json();
}

export async function fetchMovieDetails(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function fetchMovieImages(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}/images`, { headers });
  if (!res.ok) throw new Error("Failed to fetch movie images");
  return res.json();
}

export async function fetchMovieVideos(id: string) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos`, { headers });
  if (!res.ok) throw new Error("Failed to fetch movie videos");
  return res.json();
}

export async function searchMovies(query: string, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=${page}`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}
