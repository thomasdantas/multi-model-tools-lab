import { Card, CardContent } from '@/components/ui/card';
import { WeatherData, getWeatherCondition } from '@/types/weather';
import { Droplets, Wind, Sun, CloudRain } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

function UVIndexBar({ value }: { value: number }) {
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'bg-green-500';
    if (uv <= 5) return 'bg-yellow-500';
    if (uv <= 7) return 'bg-orange-500';
    if (uv <= 10) return 'bg-red-500';
    return 'bg-purple-600';
  };

  const getUVLabel = (uv: number) => {
    if (uv <= 2) return 'Baixo';
    if (uv <= 5) return 'Moderado';
    if (uv <= 7) return 'Alto';
    if (uv <= 10) return 'Muito Alto';
    return 'Extremo';
  };

  const percentage = Math.min((value / 11) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>Índice UV</span>
        <span className="font-medium">{value.toFixed(1)} - {getUVLabel(value)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-purple-600">
        <div 
          className={`h-4 w-4 rounded-full border-2 border-white shadow-md ${getUVColor(value)} -mt-1`}
          style={{ marginLeft: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const condition = getWeatherCondition(data.current.weather_code);

  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${condition.bgClass} text-white border-0`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{condition.icon}</span>
            <div>
              <p className="text-5xl font-bold">{Math.round(data.current.temperature_2m)}°C</p>
              <p className="text-lg opacity-90">{condition.description}</p>
              <p className="text-sm opacity-80">{data.city}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 opacity-80" />
              <div>
                <p className="text-sm opacity-80">Umidade</p>
                <p className="font-semibold">{data.current.relative_humidity_2m}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 opacity-80" />
              <div>
                <p className="text-sm opacity-80">Vento</p>
                <p className="font-semibold">{data.current.wind_speed_10m} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 opacity-80" />
              <div>
                <p className="text-sm opacity-80">UV</p>
                <p className="font-semibold">{data.current.uv_index.toFixed(1)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 opacity-80" />
              <div>
                <p className="text-sm opacity-80">Precipitação</p>
                <p className="font-semibold">{data.current.precipitation} mm</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white/20 rounded-lg p-3">
          <UVIndexBar value={data.current.uv_index} />
        </div>
      </CardContent>
    </Card>
  );
}
