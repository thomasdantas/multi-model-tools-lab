import { Droplets, Wind, Sun, CloudRain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CurrentWeatherProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  precipitation: number;
  weatherColor: string;
}

export function CurrentWeather({
  temperature,
  humidity,
  windSpeed,
  uvIndex,
  precipitation,
  weatherColor,
}: CurrentWeatherProps) {
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'bg-green-500';
    if (uv <= 5) return 'bg-yellow-500';
    if (uv <= 7) return 'bg-orange-500';
    if (uv <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVPercentage = (uv: number) => {
    return Math.min((uv / 11) * 100, 100);
  };

  return (
    <Card className={`border-2 ${weatherColor}`}>
      <CardHeader>
        <CardTitle className="text-4xl font-bold">
          {Math.round(temperature)}°C
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Umidade</p>
              <p className="text-lg font-semibold">{humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Vento</p>
              <p className="text-lg font-semibold">{windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Precipitação</p>
              <p className="text-lg font-semibold">{precipitation} mm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Índice UV</p>
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getUVColor(uvIndex)}`}
                      style={{ width: `${getUVPercentage(uvIndex)}%` }}
                    />
                  </div>
                  <span className="text-lg font-semibold">{uvIndex}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
