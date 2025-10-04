import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers : {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  // waits for half a second to update the new search value, less api calls :D
  useDebounce(() => setDebounceSearch(search), 500, [search]);

  const getMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      let req = await fetch(endpoint, API_OPTIONS);
      
      if(!req.ok) {
        throw new Error(`Failed to fetch movies`);
      }
      
      let res = await req.json();
      if(res.Response === "false") {
        setErrorMessage(res.Error || 'Failed to fetch movies');
        setMovies([]);
        return;
      }

      console.log(res);
      setMovies(res.results || []);

      if(query && res.results.length > 0) {
        await updateSearchCount(query, res.results[0]);
      }
      // updateSearchCount();
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    getMovies(debounceSearch);
  }, [debounceSearch]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern'></div>

        <div className='wrapper'>
          <header>
            <img src='./hero.png' alt="Hero banner" />
            <h1>🎞️ <span className='text-gradient'>Movie</span> Finder 🔍</h1>
            <Search search={search} setSearch={setSearch} />
          </header>

          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending movies</h2>
              <ul>
                {trendingMovies.map((movie, i) => (
                  <li key={movie.id}>
                    <p>{i + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2>All movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}

          </section>
        </div>
    </main>
  )
}

export default App