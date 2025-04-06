'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchWeather } from '../redux/features/weatherSlice';
import { fetchCryptos } from '../redux/features/cryptoSlice';
import { fetchNews } from '../redux/features/newsSlice';
import { toggleFavoriteCity, toggleFavoriteCrypto } from '../redux/features/preferencesSlice';
import { connectWebSocket, closeWebSocket } from '../services/webSocketService';
import { HeartIcon, StarIcon, RefreshIcon, AlertIcon } from '../components/UI/Icons';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  
  // Selectors
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);
  const { data: cryptoData, loading: cryptoLoading, error: cryptoError } = useSelector(state => state.crypto);
  const { data: newsData, loading: newsLoading, error: newsError } = useSelector(state => state.news);
  const { favoriteCity, favoriteCrypto } = useSelector(state => state.preferences);
  
  // Cities and cryptos to track
  const cities = ['New York', 'London', 'Tokyo'];
  const cryptos = ['bitcoin', 'ethereum', 'cardano'];
  
  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeather(cities));
    dispatch(fetchCryptos(cryptos));
    dispatch(fetchNews());
    
    // Connect WebSocket
    connectWebSocket(dispatch, handleNotification);
    
    // Set up periodic data refresh
    const intervalId = setInterval(() => {
      dispatch(fetchWeather(cities));
      dispatch(fetchCryptos(cryptos));
      dispatch(fetchNews());
    }, 60000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      closeWebSocket();
    };
  }, [dispatch]);
  
  const handleNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  const handleToggleFavoriteCity = (city) => {
    dispatch(toggleFavoriteCity(city));
  };
  
  const handleToggleFavoriteCrypto = (crypto) => {
    dispatch(toggleFavoriteCrypto(crypto));
  };
  
  // Helper function to format numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };
  
  // Weather section JSX
  const renderWeatherSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Weather</h2>
        <button 
          onClick={() => dispatch(fetchWeather(cities))} 
          className="text-blue-500 hover:text-blue-700"
        >
          <RefreshIcon className="w-5 h-5" />
        </button>
      </div>
      
      {weatherLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : weatherError ? (
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p>Failed to load weather data. Please try again.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cities.map(city => {
            const cityData = weatherData[city];
            if (!cityData) return null;
            
            return (
              <div key={city} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Link href={/city/${city}}>
                    <h3 className="font-medium text-lg text-blue-600 hover:text-blue-800">{city}</h3>
                  </Link>
                  <button 
                    onClick={() => handleToggleFavoriteCity(city)}
                    className={${favoriteCity.includes(city) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500}
                  >
                    <StarIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-2 flex items-center">
                  <span className="text-3xl font-semibold">{Math.round(cityData.main.temp)}°C</span>
                  <div className="ml-4">
                    <div className="text-gray-600">{cityData.weather[0].main}</div>
                    <div className="text-sm text-gray-500">
                      Humidity: {cityData.main.humidity}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  // Crypto section JSX
  const renderCryptoSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cryptocurrency</h2>
        <button 
          onClick={() => dispatch(fetchCryptos(cryptos))} 
          className="text-blue-500 hover:text-blue-700"
        >
          <RefreshIcon className="w-5 h-5" />
        </button>
      </div>
      
      {cryptoLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cryptoError ? (
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p>Failed to load cryptocurrency data. Please try again.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cryptos.map(crypto => {
            const cryptoInfo = cryptoData[crypto];
            if (!cryptoInfo) return null;
            
            const priceChangeColor = 
              cryptoInfo.price_change_percentage_24h < 0 
                ? 'text-red-600' 
                : 'text-green-600';
                
            return (
              <div key={crypto} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <Link href={/crypto/${crypto}}>
                    <h3 className="font-medium text-lg text-blue-600 hover:text-blue-800 capitalize">
                      {cryptoInfo.name}
                    </h3>
                  </Link>
                  <button 
                    onClick={() => handleToggleFavoriteCrypto(crypto)}
                    className={${favoriteCrypto.includes(crypto) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500}
                  >
                    <StarIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-2">
                  <div className="text-2xl font-semibold">
                    {formatNumber(cryptoInfo.current_price)}
                  </div>
                  <div className={flex items-center mt-1 ${priceChangeColor}}>
                    <span>{cryptoInfo.price_change_percentage_24h.toFixed(2)}%</span>
                    <span className="text-xs ml-1">(24h)</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Market Cap: {formatNumber(cryptoInfo.market_cap)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  // News section JSX
  const renderNewsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Crypto News</h2>
        <button 
          onClick={() => dispatch(fetchNews())} 
          className="text-blue-500 hover:text-blue-700"
        >
          <RefreshIcon className="w-5 h-5" />
        </button>
      </div>
      
      {newsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : newsError ? (
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p>Failed to load news data. Please try again.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsData.slice(0, 5).map((article, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                <h3 className="font-medium text-blue-600 hover:text-blue-800 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {article.description}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // Notifications JSX
  const renderNotifications = () => (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={p-4 rounded-md shadow-lg flex items-start space-x-3 animate-fade-in ${
            notification.type === 'price_alert' 
              ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
              : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
          }}
        >
          <AlertIcon className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">
              {notification.type === 'price_alert' ? 'Price Alert' : 'Weather Alert'}
            </p>
            <p>{notification.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CryptoWeather Nexus</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderWeatherSection()}
          {renderCryptoSection()}
          {renderNewsSection()}
        </div>
      </main>
      
      {renderNotifications()}
    </div>
  );
}


