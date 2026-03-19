export interface WeatherData {
  city: string;
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    precipitation: string;
    wind_speed_10m: string;
    uv_index: string;
  };
}

export interface WeatherCondition {
  icon: string;
  description: string;
  bgClass: string;
}

export const getWeatherCondition = (code: number): WeatherCondition => {
  if (code === 0) return { icon: '☀️', description: 'Céu limpo', bgClass: 'from-blue-400 to-blue-600' };
  if (code <= 3) return { icon: '⛅', description: 'Parcialmente nublado', bgClass: 'from-blue-300 to-gray-400' };
  if (code <= 49) return { icon: '🌫️', description: 'Neblina', bgClass: 'from-gray-400 to-gray-600' };
  if (code <= 59) return { icon: '🌧️', description: 'Chuvisco', bgClass: 'from-gray-500 to-blue-600' };
  if (code <= 69) return { icon: '🌧️', description: 'Chuva', bgClass: 'from-gray-600 to-blue-700' };
  if (code <= 79) return { icon: '🌨️', description: 'Neve', bgClass: 'from-gray-300 to-blue-200' };
  if (code <= 84) return { icon: '🌧️', description: 'Pancadas de chuva', bgClass: 'from-gray-600 to-blue-800' };
  if (code <= 94) return { icon: '🌨️', description: 'Pancadas de neve', bgClass: 'from-gray-400 to-blue-300' };
  return { icon: '⛈️', description: 'Tempestade', bgClass: 'from-gray-700 to-purple-800' };
};

export const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌧️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '🌨️';
  if (code <= 84) return '🌧️';
  if (code <= 94) return '🌨️';
  return '⛈️';
};
