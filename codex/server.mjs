import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 3000);

const staticFiles = {
  "/": { file: "index.html", contentType: "text/html; charset=utf-8" },
  "/styles.css": { file: "styles.css", contentType: "text/css; charset=utf-8" },
  "/app.js": { file: "app.js", contentType: "application/javascript; charset=utf-8" }
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function serveStaticFile(response, pathname) {
  const entry = staticFiles[pathname];

  if (!entry) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const filePath = path.join(publicDir, entry.file);
  const content = await readFile(filePath);
  response.writeHead(200, { "Content-Type": entry.contentType });
  response.end(content);
}

async function fetchLocation(city) {
  const searchParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const result = payload.results?.[0];

  if (!result) {
    return null;
  }

  return {
    city: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone
  };
}

async function fetchLocationByCoordinates(latitude, longitude) {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    language: "en",
    format: "json"
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Reverse geocoding request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const result = payload.results?.[0];

  if (!result) {
    return null;
  }

  return {
    city: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone
  };
}

async function fetchCurrentWeather(latitude, longitude, timezone) {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    timezone
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const current = payload.current;

  if (!current) {
    throw new Error("Weather API response did not include current conditions");
  }

  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    windSpeed: current.wind_speed_10m,
    isDay: Boolean(current.is_day),
    weatherCode: current.weather_code,
    observedAt: current.time,
    units: payload.current_units
  };
}

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };

  return descriptions[weatherCode] || "Unknown conditions";
}

async function handleWeatherRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const city = requestUrl.searchParams.get("city")?.trim();
  const latitudeParam = requestUrl.searchParams.get("latitude");
  const longitudeParam = requestUrl.searchParams.get("longitude");

  if (!city && (!latitudeParam || !longitudeParam)) {
    sendJson(response, 400, { error: "Provide 'city' or both 'latitude' and 'longitude'" });
    return;
  }

  try {
    let location = null;

    if (city) {
      location = await fetchLocation(city);
    } else {
      const latitude = Number(latitudeParam);
      const longitude = Number(longitudeParam);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        sendJson(response, 400, { error: "Latitude and longitude must be valid numbers" });
        return;
      }

      location = await fetchLocationByCoordinates(latitude, longitude);
    }

    if (!location) {
      sendJson(response, 404, { error: city ? `City '${city}' was not found` : "Location was not found" });
      return;
    }

    const weather = await fetchCurrentWeather(location.latitude, location.longitude, location.timezone);

    sendJson(response, 200, {
      location: {
        city: location.city,
        region: location.admin1,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      },
      weather: {
        ...weather,
        description: getWeatherDescription(weather.weatherCode)
      }
    });
  } catch (error) {
    console.error(error);
    sendJson(response, 502, { error: "Failed to retrieve weather data" });
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && requestUrl.pathname === "/api/weather") {
    await handleWeatherRequest(request, response);
    return;
  }

  if (request.method === "GET") {
    try {
      await serveStaticFile(response, requestUrl.pathname);
    } catch (error) {
      console.error(error);
      sendJson(response, 500, { error: "Failed to serve static asset" });
    }
    return;
  }

  sendJson(response, 405, { error: "Method not allowed" });
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
