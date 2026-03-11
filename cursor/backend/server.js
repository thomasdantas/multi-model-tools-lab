import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, "../frontend")));

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

app.get("/api/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let latitude, longitude, locationName;

    if (lat && lon) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);
      locationName = "Sua localização";
    } else if (city && city.trim()) {
      const geoRes = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(city.trim())}&count=1`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }

      const result = geoData.results[0];
      latitude = result.latitude;
      longitude = result.longitude;
      locationName = `${result.name}, ${result.country}`;
    } else {
      return res
        .status(400)
        .json({ error: "Informe uma cidade ou coordenadas" });
    }

    const weatherRes = await fetch(
      `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`,
    );
    const weatherData = await weatherRes.json();

    if (weatherData.error) {
      return res.status(500).json({ error: "Erro ao obter dados do clima" });
    }

    res.json({
      location: locationName,
      latitude,
      longitude,
      timezone: weatherData.timezone,
      current: weatherData.current,
      units: weatherData.current_units,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
