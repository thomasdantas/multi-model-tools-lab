const WEATHER_ICONS = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌧️",
  53: "🌧️",
  55: "🌧️",
  56: "🌨️",
  57: "🌨️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌨️",
  67: "🌨️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  77: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  85: "🌨️",
  86: "🌨️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

const WEATHER_DESC = {
  0: "Céu limpo",
  1: "Predominantemente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa densa",
  56: "Garoa congelante leve",
  57: "Garoa congelante densa",
  61: "Chuva leve",
  63: "Chuva moderada",
  65: "Chuva forte",
  66: "Chuva congelante leve",
  67: "Chuva congelante forte",
  71: "Neve leve",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva leves",
  81: "Pancadas de chuva moderadas",
  82: "Pancadas de chuva violentas",
  85: "Pancadas de neve leves",
  86: "Pancadas de neve fortes",
  95: "Trovoada",
  96: "Trovoada com granizo leve",
  99: "Trovoada com granizo forte",
};

function getWeatherInfo(code) {
  for (let i = code; i >= 0; i--) {
    if (WEATHER_ICONS[i] !== undefined) {
      return {
        icon: WEATHER_ICONS[i],
        desc: WEATHER_DESC[i] || "Condições variáveis",
      };
    }
  }
  return { icon: "🌡️", desc: "Condições variáveis" };
}

const elements = {
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  locationBtn: document.getElementById("locationBtn"),
  loading: document.getElementById("loading"),
  error: document.getElementById("error"),
  weatherCard: document.getElementById("weatherCard"),
  locationName: document.getElementById("locationName"),
  weatherIcon: document.getElementById("weatherIcon"),
  temperature: document.getElementById("temperature"),
  weatherDesc: document.getElementById("weatherDesc"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
};

function showLoading(show) {
  elements.loading.classList.toggle("hidden", !show);
}

function showError(message) {
  elements.error.textContent = message;
  elements.error.classList.remove("hidden");
  elements.weatherCard.classList.add("hidden");
}

function hideError() {
  elements.error.classList.add("hidden");
}

function showWeather(data) {
  hideError();
  const { icon, desc } = getWeatherInfo(data.current.weather_code);

  elements.locationName.textContent = data.location;
  elements.weatherIcon.textContent = icon;
  elements.temperature.textContent = `${Math.round(data.current.temperature_2m)}°C`;
  elements.weatherDesc.textContent = desc;
  elements.humidity.textContent = `${data.current.relative_humidity_2m}%`;
  elements.wind.textContent = `${data.current.wind_speed_10m} ${data.units?.wind_speed_10m || "km/h"}`;

  elements.weatherCard.classList.remove("hidden");
}

async function fetchWeather(params) {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`/api/weather?${searchParams}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro ao buscar clima");
  }
  return data;
}

async function searchByCity() {
  const city = elements.cityInput.value.trim();
  if (!city) {
    showError("Digite o nome de uma cidade");
    return;
  }

  showLoading(true);
  hideError();
  try {
    const data = await fetchWeather({ city });
    showWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    showLoading(false);
  }
}

async function searchByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocalização não suportada pelo navegador");
    return;
  }

  showLoading(true);
  hideError();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const data = await fetchWeather({ lat: latitude, lon: longitude });
        showWeather(data);
        elements.cityInput.value = "";
      } catch (err) {
        showError(err.message);
      } finally {
        showLoading(false);
      }
    },
    (err) => {
      showError(
        err.code === 1
          ? "Permissão de localização negada"
          : "Não foi possível obter sua localização",
      );
      showLoading(false);
    },
  );
}

elements.searchBtn.addEventListener("click", searchByCity);
elements.cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchByCity();
});
elements.locationBtn.addEventListener("click", searchByLocation);
