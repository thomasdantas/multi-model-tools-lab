const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const locationButton = document.querySelector("#location-button");
const statusNode = document.querySelector("#status");
const weatherCard = document.querySelector("#weather-card");

const locationName = document.querySelector("#location-name");
const weatherDescription = document.querySelector("#weather-description");
const temperature = document.querySelector("#temperature");
const apparentTemperature = document.querySelector("#apparent-temperature");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const precipitation = document.querySelector("#precipitation");
const timezone = document.querySelector("#timezone");
const observedAt = document.querySelector("#observed-at");

function setStatus(message) {
  statusNode.textContent = message;
}

function formatMetric(value, unit) {
  return `${value}${unit || ""}`;
}

function formatLocation(location) {
  return [location.city, location.region, location.country].filter(Boolean).join(", ");
}

function renderWeather(payload) {
  weatherCard.classList.remove("hidden");

  locationName.textContent = formatLocation(payload.location);
  weatherDescription.textContent = payload.weather.description;
  temperature.textContent = formatMetric(payload.weather.temperature, payload.weather.units.temperature_2m);
  apparentTemperature.textContent = formatMetric(payload.weather.apparentTemperature, payload.weather.units.apparent_temperature);
  humidity.textContent = formatMetric(payload.weather.humidity, payload.weather.units.relative_humidity_2m);
  windSpeed.textContent = formatMetric(payload.weather.windSpeed, payload.weather.units.wind_speed_10m);
  precipitation.textContent = formatMetric(payload.weather.precipitation, payload.weather.units.precipitation);
  timezone.textContent = payload.location.timezone;
  observedAt.textContent = new Date(payload.weather.observedAt).toLocaleString();
}

async function searchWeather(city) {
  setStatus(`Loading weather for ${city}...`);

  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  renderWeather(payload);
  setStatus("");
}

async function searchWeatherByCoordinates(latitude, longitude) {
  setStatus("Loading weather for your location...");

  const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  cityInput.value = payload.location.city || "";
  renderWeather(payload);
  setStatus("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatus("Enter a city name.");
    return;
  }

  try {
    await searchWeather(city);
  } catch (error) {
    weatherCard.classList.add("hidden");
    setStatus(error.message);
  }
});

locationButton.addEventListener("click", async () => {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported in this browser.");
    return;
  }

  setStatus("Resolving your location...");

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        await searchWeatherByCoordinates(coords.latitude, coords.longitude);
      } catch (error) {
        weatherCard.classList.add("hidden");
        setStatus(error.message || "Could not determine your location.");
      }
    },
    () => {
      setStatus("Location access was denied.");
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
});
