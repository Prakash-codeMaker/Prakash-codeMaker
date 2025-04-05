// app/page.js
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WeatherSection from '../components/Weather/WeatherSection';
import CryptoSection from '../components/Crypto/CryptoSection';
import NewsSection from '../components/News/NewsSection';
import { fetchWeather } from '../redux/features/weatherSlice';
import { fetchCryptos } from '../redux/features/cryptoSlice';
import { fetchNews } from '../redux/features/newsSlice';
import { connectWebSocket, closeWebSocket } from '../services/webSocketService';
import Notification from '../components/UI/Notification';

export default function Dashboard() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  
  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeather(['New York', 'London', 'Tokyo']));
    dispatch(fetchCryptos(['bitcoin', 'ethereum', 'dogecoin']));
    dispatch(fetchNews());
    
    // Connect WebSocket
    connectWebSocket(dispatch);
    
    // Set up periodic data refresh
    const intervalId = setInterval(() => {
      dispatch(fetchWeather(['New York', 'London', 'Tokyo']));
      dispatch(fetchCryptos(['bitcoin', 'ethereum', 'dogecoin']));
      dispatch(fetchNews());
    }, 60000);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      closeWebSocket();
    };
  }, [dispatch]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CryptoWeather Nexus</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeatherSection />
        <CryptoSection />
        <NewsSection />
      </div>
      
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );
}