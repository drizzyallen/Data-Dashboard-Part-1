import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

export default function DetailView() {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      if (movie) return; // Already have data from Link state

      try {
        setLoading(true);
        // The API provides details for a specific ID with this endpoint
        const url = `https://moviesdatabase.p.rapidapi.com/titles/${id}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
          }
        });

        const data = await response.json();
        if (data.results) {
          setMovie(data.results);
        } else {
          setError('Series not found');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, movie, apiKey]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No data available</div>;

  return (
    <div className="detail-view">
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
        &larr; Back to Dashboard
      </Link>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          {movie.primaryImage?.url ? (
            <img src={movie.primaryImage.url} alt={movie.originalTitleText?.text} style={{ maxWidth: '400px', borderRadius: '8px' }}/>
          ) : (
            <div style={{ width: '400px', height: '600px', backgroundColor: '#e5e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
              No Image
            </div>
          )}
        </div>
        
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ marginTop: 0 }}>{movie.originalTitleText?.text}</h1>
          <p><strong>Release Date:</strong> {movie.releaseDate?.month}/{movie.releaseDate?.day}/{movie.releaseDate?.year}</p>
          <p><strong>Type:</strong> {movie.titleType?.text || 'N/A'}</p>
          {movie.isAdult !== undefined && (
            <p><strong>Is Adult:</strong> {movie.isAdult ? 'Yes' : 'No'}</p>
          )}
          {movie.releaseDate?.endYear && (
            <p><strong>End Year:</strong> {movie.releaseDate?.endYear}</p>
          )}
          {movie.primaryImage?.caption?.plainText && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--accent-bg)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                {movie.primaryImage.caption.plainText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
