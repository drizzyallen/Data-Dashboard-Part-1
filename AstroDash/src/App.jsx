import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [movieInfo, setMovieInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY

  const getMostCommonYear = () => {
    if (movieInfo.length === 0) return "N/A";

    const yearCounts = {};
    movieInfo.forEach((movie) => {
      const year = movie.releaseDate?.year;
      if (year) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    let maxCount = 0;
    let mostCommonYear = "N/A";
    for (const year in yearCounts) {
      if (yearCounts[year] > maxCount) {
        maxCount = yearCounts[year];
        mostCommonYear = year;
      }
    }

    return mostCommonYear;
  };

  const getYearRange = () => {
    if (movieInfo.length === 0) return "N/A";
    const years = movieInfo.map((m) => m.releaseDate?.year).filter((y) => y !== undefined && y !== null);
    if (years.length === 0) return "N/A";
    
    const min = Math.min(...years);
    const max = Math.max(...years);
    
    return min === max ? `${min}` : `${min} - ${max}`;
  };

  const handleGetRandomSeries = () => {
    return (
      <div>
        {movieInfo ? movieInfo.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.primaryImage.url} alt={movie.originalTitleText.text} width={200}/>
            <h2>{movie.originalTitleText.text}</h2>
            <p>Release Date: {movie.releaseDate.month}/{movie.releaseDate.day}/{movie.releaseDate.year}</p>

          </div>
        )) : <p></p>}
      </div>
    )
  }

  const handleFilterByYear = (year) => {
    const filteredMovies = movieInfo.filter((movie) => movie.releaseDate.year >= year);
    setMovieInfo(filteredMovies);
  }

  const fetchData = async () => {
    // 1. The API expects the movie name inside the URL path
    const url = `https://moviesdatabase.p.rapidapi.com/titles/random?limit=10&list=top_rated_series_250`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // 3. Put your API Key and Host here
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
        }
      });
      
      const data = await response.json();
      setMovieInfo(data.results);
      console.log(data.results);
    } catch (error) {
      console.error("Error fetching movie AKAs:", error);
    }
  };

  return (
    <>
      <div>
        <h1>10 Random series</h1>
        <h2>click the button to get 10 random series </h2>
        <button onClick={fetchData}>Get Random Series</button>
        <div className="movie-list">
          {movieInfo.length > 0 ? (
              <>  
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <p>Enter a year to filter by... it will filter the movies from that year and after</p>
                <button onClick={() => handleFilterByYear(searchQuery)}>Search!</button>
              </>
              ) : <p></p>}

              {movieInfo.length > 0 ? (
                <>
                  <h3>Dataset Stats:</h3>
                  <p>Number of movies: {movieInfo.length}</p>
                  <p>Common year of release: {getMostCommonYear()}</p>
                  <p>Ranges of years: {getYearRange()}</p>
                </>
              ):(<></>)}

          {handleGetRandomSeries()}
        </div>
      </div>
      
    </>
  )
}

export default App
