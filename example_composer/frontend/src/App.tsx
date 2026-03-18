import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { WeatherSearch } from './components/WeatherSearch';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    uv_index: number;
    precipitation: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

type WeatherState = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [weatherState, setWeatherState] = useState<WeatherState>('idle');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchWeather = async (city: string) => {
    setWeatherState('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`);

      if (response.status === 400) {
        setWeatherState('error');
        setErrorMessage('Por favor, digite o nome de uma cidade.');
        return;
      }

      if (response.status === 404) {
        setWeatherState('error');
        setErrorMessage('Cidade não encontrada. Tente novamente com outro nome.');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do clima');
      }

      const data = await response.json();
      setWeatherData(data);
      setWeatherState('success');
    } catch (error) {
      setWeatherState('error');
      setErrorMessage('Erro ao conectar com o servidor. Tente novamente.');
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setWeatherState('error');
      setErrorMessage('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setWeatherState('loading');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
          );

          if (response.status === 400) {
            setWeatherState('error');
            setErrorMessage('Erro ao processar coordenadas.');
            return;
          }

          if (!response.ok) {
            throw new Error('Erro ao buscar dados do clima');
          }

          const data = await response.json();
          setWeatherData(data);
          setWeatherState('success');
        } catch (error) {
          setWeatherState('error');
          setErrorMessage('Erro ao obter localização. Tente novamente.');
        }
      },
      () => {
        setWeatherState('error');
        setErrorMessage('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      }
    );
  };

  const getWeatherColor = () => {
    if (!weatherData) return 'border-blue-200 bg-blue-50';
    const temp = weatherData.current.temperature_2m;
    const precip = weatherData.current.precipitation;

    if (precip > 0) {
      return 'border-gray-300 bg-gray-100';
    }
    if (temp >= 25) {
      return 'border-orange-200 bg-orange-50';
    }
    if (temp >= 15) {
      return 'border-blue-200 bg-blue-50';
    }
    return 'border-blue-300 bg-blue-100';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-8">Painel de Monitoramento de Clima</h1>
          <WeatherSearch
            onSearch={fetchWeather}
            onGeolocation={handleGeolocation}
            isLoading={weatherState === 'loading'}
          />
        </div>

        {weatherState === 'loading' && <WeatherSkeleton />}

        {weatherState === 'error' && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
                  <p className="text-muted-foreground mb-4">{errorMessage}</p>
                  <Button onClick={() => setWeatherState('idle')}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {weatherState === 'success' && weatherData && (
          <div className="space-y-6">
            <CurrentWeather
              temperature={weatherData.current.temperature_2m}
              humidity={weatherData.current.relative_humidity_2m}
              windSpeed={weatherData.current.wind_speed_10m}
              uvIndex={weatherData.current.uv_index}
              precipitation={weatherData.current.precipitation}
              weatherColor={getWeatherColor()}
            />
            <HourlyForecast hourly={weatherData.hourly} />
            <div>
              <h2 className="text-2xl font-bold mb-4">Previsão para os Próximos 7 Dias</h2>
              <DailyForecast daily={weatherData.daily} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
