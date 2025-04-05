// components/Weather/WeatherSection.jsx
import { useSelector } from 'react-redux';
import WeatherCard from './WeatherCard';
import LoadingState from '../UI/LoadingState';
import ErrorState from '../UI/ErrorState';

export default function WeatherSection() {
  const { data, loading, error } = useSelector((state) => state.weather);
  const favorites = useSelector((state) => state.preferences.favoriteCity);
  
  if (loading) return <LoadingState message="Loading weather data..." />;
  if (error) return <ErrorState message={error} />;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weather</h2>
      <div className="space-y-4">
        {Object.keys(data).map((city) => (
          <WeatherCard
            key={city}
            city={city}
            data={data[city]}
            isFavorite={favorites.includes(city)}
          />
        ))}
      </div>
    </div>
  );
}