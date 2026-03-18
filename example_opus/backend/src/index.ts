import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/weather', async (req: Request, res: Response) => {
  const { city, lat, lon } = req.query;
  
  if (!city && (!lat || !lon)) {
    res.status(400).json({ error: 'City name or coordinates (lat, lon) are required' });
    return;
  }

  let latitude: number;
  let longitude: number;
  let cityName: string;

  if (lat && lon) {
    latitude = parseFloat(lat as string);
    longitude = parseFloat(lon as string);
    cityName = 'Current Location';
  } else {
    const geoResponse = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(city as string)}&count=1&language=pt`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    const location = geoData.results[0];
    latitude = location.latitude;
    longitude = location.longitude;
    cityName = location.name;
  }

  const weatherParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,uv_index',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
    timezone: 'auto',
    forecast_days: '7'
  });

  const weatherResponse = await fetch(`${WEATHER_API}?${weatherParams}`);
  const weatherData = await weatherResponse.json();

  res.json({
    city: cityName,
    latitude,
    longitude,
    ...weatherData
  });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});