import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData, getWeatherIcon } from '@/types/weather';
import { CloudRain } from 'lucide-react';

interface DailyForecastProps {
  data: WeatherData;
}

function TemperatureBar({ min, max, dayMin, dayMax }: { min: number; max: number; dayMin: number; dayMax: number }) {
  const range = max - min;
  const leftPercent = ((dayMin - min) / range) * 100;
  const widthPercent = ((dayMax - dayMin) / range) * 100;

  return (
    <div className="relative h-2 w-full bg-secondary rounded-full">
      <div 
        className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500"
        style={{ 
          left: `${leftPercent}%`, 
          width: `${Math.max(widthPercent, 5)}%` 
        }}
      />
    </div>
  );
}

export function DailyForecast({ data }: DailyForecastProps) {
  const allMinTemps = data.daily.temperature_2m_min;
  const allMaxTemps = data.daily.temperature_2m_max;
  const globalMin = Math.min(...allMinTemps);
  const globalMax = Math.max(...allMaxTemps);

  const formatDay = (dateStr: string, index: number) => {
    if (index === 0) return 'Hoje';
    if (index === 1) return 'Amanhã';
    const date = new Date(dateStr);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.daily.time.map((time, index) => (
            <div 
              key={time}
              className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
            >
              <div className="w-16 flex-shrink-0">
                <p className="font-medium">{formatDay(time, index)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(time)}</p>
              </div>
              
              <span className="text-2xl flex-shrink-0">
                {getWeatherIcon(data.daily.weather_code[index])}
              </span>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <CloudRain className="w-3 h-3" />
                <span>{data.daily.precipitation_sum[index].toFixed(1)}mm</span>
              </div>
              
              <span className="text-sm text-blue-500 w-10 text-right flex-shrink-0">
                {Math.round(data.daily.temperature_2m_min[index])}°
              </span>
              
              <div className="flex-1 min-w-[80px]">
                <TemperatureBar 
                  min={globalMin}
                  max={globalMax}
                  dayMin={data.daily.temperature_2m_min[index]}
                  dayMax={data.daily.temperature_2m_max[index]}
                />
              </div>
              
              <span className="text-sm text-orange-500 w-10 flex-shrink-0">
                {Math.round(data.daily.temperature_2m_max[index])}°
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
