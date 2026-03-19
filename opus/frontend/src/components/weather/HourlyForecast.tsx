import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData, getWeatherIcon } from '@/types/weather';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface HourlyForecastProps {
  data: WeatherData;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const now = new Date();
  const hourlyData = data.hourly.time
    .map((time, index) => ({
      time: new Date(time),
      hour: new Date(time).getHours(),
      temperature: data.hourly.temperature_2m[index],
      precipitation: data.hourly.precipitation_probability[index],
      icon: getWeatherIcon(data.hourly.weather_code[index])
    }))
    .filter(item => item.time >= now)
    .slice(0, 24);

  const formatHour = (hour: number) => `${hour}h`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Previsão por Hora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 min-w-0 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="hour" 
                tickFormatter={formatHour}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="temp"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}°`}
              />
              <YAxis 
                yAxisId="precip"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
                formatter={(value, name) => {
                  if (name === 'temperature') return [`${value}°C`, 'Temperatura'];
                  return [`${value}%`, 'Chance de chuva'];
                }}
                labelFormatter={(hour) => `${hour}:00`}
              />
              <Legend 
                formatter={(value) => value === 'temperature' ? 'Temperatura' : 'Chance de chuva'}
              />
              <Area 
                yAxisId="temp"
                type="monotone" 
                dataKey="temperature" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorTemp)"
              />
              <Area 
                yAxisId="precip"
                type="monotone" 
                dataKey="precipitation" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorPrecip)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {hourlyData.slice(0, 12).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center flex-shrink-0 w-[60px] p-2 bg-secondary/50 rounded-lg"
            >
              <span className="text-xs text-muted-foreground">{formatHour(item.hour)}</span>
              <span className="text-xl my-1">{item.icon}</span>
              <span className="text-sm font-medium">{Math.round(item.temperature)}°</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
