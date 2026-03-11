import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(join(__dirname, "public")));

async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    return null;
  }
  const loc = data.results[0];
  return {
    name: loc.name,
    country: loc.country,
    latitude: loc.latitude,
    longitude: loc.longitude,
  };
}

async function reverseGeocode(lat, lon) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=pt`;
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`
  );
  const data = await res.json();
  return {
    name: data.timezone?.split("/").pop()?.replace(/_/g, " ") || "Localização atual",
    country: "",
    latitude: lat,
    longitude: lon,
  };
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&timezone=auto`;
  const res = await fetch(url);
  return res.json();
}

app.get("/api/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let location;

    if (city) {
      location = await geocodeCity(city);
      if (!location) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }
    } else if (lat && lon) {
      location = await reverseGeocode(parseFloat(lat), parseFloat(lon));
    } else {
      return res.status(400).json({ error: "Informe uma cidade ou coordenadas" });
    }

    const weather = await getWeather(location.latitude, location.longitude);
    const current = weather.current;

    res.json({
      location: {
        name: location.name,
        country: location.country,
      },
      timezone: weather.timezone,
      current: {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        weatherCode: current.weather_code,
      },
    });
  } catch (err) {
    console.error("Erro ao buscar clima:", err);
    res.status(500).json({ error: "Erro interno ao buscar dados do clima" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
