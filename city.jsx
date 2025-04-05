// app/city/[id]/page.js
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityWeatherHistory } from '../../../redux/features/weatherSlice';
import WeatherDetail from '../../../components/Weather/WeatherDetail';
import LoadingState from '../../../components/UI/LoadingState';
import ErrorState from '../../../components/UI/ErrorState';

export default function CityDetailPage() {
  const params = useParams();
  const cityId = params.id;
  const dispatch = useDispatch();
  const { historyData, historyLoading, historyError } = useSelector((state) => state.weather);
  
  useEffect(() => {
    if (cityId) {
      dispatch(fetchCityWeatherHistory(cityId));
    }
  }, [cityId, dispatch]);
  
  if (historyLoading) return <LoadingState message="Loading weather history..." />;
  if (historyError) return <ErrorState message={historyError} />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{cityId} Weather Details</h1>
      {historyData[cityId] && <WeatherDetail data={historyData[cityId]} />}
    </div>
  );
}