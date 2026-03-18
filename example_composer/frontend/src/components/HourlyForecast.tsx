import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface HourlyForecastProps {
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
  };
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  const data = hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    temperature: hourly.temperature_2m[index],
    precipitation: hourly.precipitation[index],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão Hora a Hora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="temp" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="precip" orientation="right" label={{ value: 'mm', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-32 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="precipitation" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
