const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const geoBtn = document.getElementById("geo-btn");
const status = document.getElementById("status");
const card = document.getElementById("weather-card");

const weatherCodes = {
  0: { icon: "☀️", desc: "Céu limpo" },
  1: { icon: "🌤️", desc: "Predominantemente limpo" },
  2: { icon: "⛅", desc: "Parcialmente nublado" },
  3: { icon: "☁️", desc: "Nublado" },
  45: { icon: "🌫️", desc: "Neblina" },
  48: { icon: "🌫️", desc: "Neblina com geada" },
  51: { icon: "🌦️", desc: "Garoa leve" },
  53: { icon: "🌦️", desc: "Garoa moderada" },
  55: { icon: "🌦️", desc: "Garoa intensa" },
  61: { icon: "🌧️", desc: "Chuva leve" },
  63: { icon: "🌧️", desc: "Chuva moderada" },
  65: { icon: "🌧️", desc: "Chuva forte" },
  71: { icon: "🌨️", desc: "Neve leve" },
  73: { icon: "🌨️", desc: "Neve moderada" },
  75: { icon: "🌨️", desc: "Neve forte" },
  80: { icon: "🌧️", desc: "Pancadas de chuva" },
  81: { icon: "🌧️", desc: "Pancadas moderadas" },
  82: { icon: "⛈️", desc: "Pancadas fortes" },
  95: { icon: "⛈️", desc: "Tempestade" },
  96: { icon: "⛈️", desc: "Tempestade com granizo leve" },
  99: { icon: "⛈️", desc: "Tempestade com granizo forte" },
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { icon: "🌡️", desc: "Desconhecido" };
}

function showStatus(msg) {
  status.textContent = msg;
}

function displayWeather(data) {
  const { location, timezone, current } = data;
  const info = getWeatherInfo(current.weatherCode);

  document.getElementById("location-name").textContent =
    [location.name, location.country].filter(Boolean).join(", ");
  document.getElementById("timezone").textContent = timezone;
  document.getElementById("weather-icon").textContent = info.icon;
  document.getElementById("temperature").textContent = `${current.temperature}°C`;
  document.getElementById("weather-description").textContent = info.desc;
  document.getElementById("feels-like").textContent = `${current.apparentTemperature}°C`;
  document.getElementById("humidity").textContent = `${current.humidity}%`;
  document.getElementById("wind").textContent = `${current.windSpeed} km/h`;
  document.getElementById("precipitation").textContent = `${current.precipitation} mm`;

  card.classList.remove("hidden");
  showStatus("");
}

async function fetchWeather(params) {
  showStatus("Carregando...");
  card.classList.add("hidden");

  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/weather?${query}`);
    const data = await res.json();

    if (!res.ok) {
      showStatus(data.error || "Erro ao buscar dados");
      return;
    }

    displayWeather(data);
  } catch {
    showStatus("Erro de conexão com o servidor");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather({ city });
});

geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showStatus("Geolocalização não suportada pelo navegador");
    return;
  }

  showStatus("Obtendo localização...");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    },
    () => {
      showStatus("Permissão de localização negada");
    }
  );
});
