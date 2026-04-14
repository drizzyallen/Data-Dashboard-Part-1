import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReleaseYearChart from '../components/ReleaseYearChart';
import ReleaseMonthChart from '../components/ReleaseMonthChart';

export default function Dashboard() {
  const [seriesInfo, setseriesInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderYear, setSliderYear] = useState(0);

  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

  const { minYear, maxYear } = useMemo(() => {
    const allYears = seriesInfo.map(m => m.releaseDate?.year).filter(y => y !== undefined && y !== null);
    if (allYears.length === 0) return { minYear: 1900, maxYear: new Date().getFullYear() };
    return { minYear: Math.min(...allYears), maxYear: Math.max(...allYears) };
  }, [seriesInfo]);

  useEffect(() => {
    if (seriesInfo.length > 0) {
      setSliderYear(minYear);
    }
  }, [seriesInfo, minYear]);

  const filteredSeries = seriesInfo.filter((movie) => {
    let matchSearch = true;
    if (searchQuery) {
      const year = parseInt(searchQuery);
      if (!isNaN(year)) {
        matchSearch = movie.releaseDate?.year >= year;
      }
    }

    let matchYear = true;
    if (sliderYear > 0) {
      if (sliderYear !== minYear) {
        matchYear = movie.releaseDate?.year ? movie.releaseDate.year >= sliderYear : false;
      }
    }

    return matchSearch && matchYear;
  });

  const getMostCommonYear = () => {
    if (filteredSeries.length === 0) return "N/A";
    const yearCounts = {};
    filteredSeries.forEach((movie) => {
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
    if (filteredSeries.length === 0) return "N/A";
    const years = filteredSeries.map((m) => m.releaseDate?.year).filter((y) => y !== undefined && y !== null);
    if (years.length === 0) return "N/A";
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? `${min}` : `${min} - ${max}`;
  };

  const fetchData = async () => {
    const url = `https://moviesdatabase.p.rapidapi.com/titles/random?limit=10&list=top_rated_series_250`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
        }
      });
      const data = await response.json();
      setseriesInfo(data.results);
    } catch (error) {
      console.error("Error fetching movie AKAs:", error);
    }
  };

  return (
    <div>
      <h1>10 Random series</h1>
      <h2>Click the button to get 10 random series</h2>
      <button onClick={fetchData}>Get Random Series</button>
      
      {seriesInfo.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a year..."
            />
            <p>Filter series from that year and after</p>
          </div>
          
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <label htmlFor="yearSlider" style={{ display: 'block', marginBottom: '10px' }}>
              Filter by release year ({sliderYear}):
            </label>
            <input 
              type="range" 
              id="yearSlider"
              min={minYear} 
              max={maxYear} 
              value={sliderYear} 
              onChange={(e) => setSliderYear(Number(e.target.value))} 
              style={{ width: '100%', maxWidth: '300px' }}
            />
            <p>Showing series released in {sliderYear} and after</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 45%' }}>
              <h3>Dataset Stats:</h3>
              <p>Number of series: {filteredSeries.length}</p>
              <p>Common year of release: {getMostCommonYear()}</p>
              <p>Ranges of years: {getYearRange()}</p>
            </div>
          </div>

          {/* Render Charts */}
          {filteredSeries.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '40px' }}>
              <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '300px' }}>
                <ReleaseYearChart data={filteredSeries} />
              </div>
              <div style={{ flex: '1 1 calc(50% - 20px)', minWidth: '300px' }}>
                <ReleaseMonthChart data={filteredSeries} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Render the series list */}
      <div className="movie-list" style={{ marginTop: '40px', textAlign: 'left' }}>
        {filteredSeries.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.primaryImage?.url || 'https://via.placeholder.com/200'} alt={movie.originalTitleText?.text} width={200}/>
            <div style={{ paddingLeft: '20px' }}>
              <h2>{movie.originalTitleText?.text}</h2>
              <p>Release Date: {movie.releaseDate?.month}/{movie.releaseDate?.day}/{movie.releaseDate?.year}</p>
              <Link to={`/series/${movie.id}`} state={{ movie }}>
                <button style={{ marginTop: '10px' }}>View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
