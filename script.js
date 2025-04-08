const apiKey = "a53854c5a6c653509f914555ae23c8b9"; 
let units = "metric";
let isCelsius = true;

async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    updateWeatherUI(data);
  } catch (err) {
    document.getElementById("location").textContent = "Error fetching weather data.";
  }
}

function updateWeatherUI(data) {
  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}° ${isCelsius ? "C" : "F"}`;
  document.getElementById("weather").textContent = `Condition: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const weatherIcon = document.getElementById("weatherIcon");
  weatherIcon.src = iconUrl;
  weatherIcon.style.display = "block";

  const now = new Date();
  document.getElementById("time").textContent = `Last updated: ${now.toLocaleTimeString()}`;

  // Change background based on weather
  const main = data.weather[0].main.toLowerCase();
  let bg;
  switch (main) {
    case "clear":
      bg = "linear-gradient(to top, #fceabb, #f8b500)";
      break;
    case "clouds":
      bg = "linear-gradient(to top, #d7d2cc, #304352)";
      break;
    case "rain":
    case "drizzle":
      bg = "linear-gradient(to top, #4e54c8, #8f94fb)";
      break;
    case "thunderstorm":
      bg = "linear-gradient(to top, #232526, #414345)";
      break;
    case "snow":
      bg = "linear-gradient(to top, #e6dada, #274046)";
      break;
    default:
      bg = "#eef2f3";
  }
  document.body.style.background = bg;
}

function getLocationAndUpdate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeather(lat, lon);
    }, () => {
      document.getElementById("location").textContent = "Location access denied. Try searching a city.";
    });
  } else {
    document.getElementById("location").textContent = "Geolocation not supported.";
  }
}

async function getCityWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    updateWeatherUI(data);
  } catch (error) {
    alert("City not found or error fetching data.");
  }
}

// Toggle temperature units
document.getElementById("toggleUnit").addEventListener("click", () => {
  isCelsius = !isCelsius;
  units = isCelsius ? "metric" : "imperial";
  document.getElementById("toggleUnit").textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  getLocationAndUpdate();
});

// Initial load
getLocationAndUpdate();
setInterval(getLocationAndUpdate, 60000); // Update every 60 sec
