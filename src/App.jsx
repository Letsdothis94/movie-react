import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

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

  const getMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <main>
      <div className='pattern'></div>

        <div className='wrapper'>
          <header>
            <img src='./hero.png' alt="Hero banner" />
            <h1><span className='text-gradient'>Movies</span> Catalogue</h1>
            <Search search={search} setSearch={setSearch} />
          </header>
          <section className='all-movies'>
            <h2 className='mt-[40px]'>All movies</h2>

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