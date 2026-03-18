import { Card, CardContent } from './ui/card';

interface DailyForecastProps {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    }
    return date.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  const getMaxTemp = () => {
    return Math.max(...daily.temperature_2m_max);
  };

  const getMinTemp = () => {
    return Math.min(...daily.temperature_2m_min);
  };

  const maxTemp = getMaxTemp();
  const minTemp = getMinTemp();
  const tempRange = maxTemp - minTemp;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
      {daily.time.map((time, index) => {
        const dayMax = daily.temperature_2m_max[index];
        const dayMin = daily.temperature_2m_min[index];
        const precip = daily.precipitation_sum[index];

        const maxPercentage = tempRange > 0 ? ((dayMax - minTemp) / tempRange) * 100 : 50;
        const minPercentage = tempRange > 0 ? ((dayMin - minTemp) / tempRange) * 100 : 50;

        return (
          <Card key={time}>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">{getDayName(time)}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Máx</span>
                  <span className="font-semibold">{Math.round(dayMax)}°C</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${maxPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mín</span>
                  <span className="font-semibold">{Math.round(dayMin)}°C</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${minPercentage}%` }}
                  />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Precipitação</span>
                    <span className="font-semibold">{precip.toFixed(1)} mm</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
