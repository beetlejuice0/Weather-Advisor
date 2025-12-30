import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    if (city.trim() !== "") {
      fetchWeather(city);
    }
  };

  // 🧠 Smart Suggestions
  const getSuggestions = () => {
    if (!weather) return [];

    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const condition = weather.weather[0].main.toLowerCase();
    const wind = weather.wind.speed;

    return [
      temp > 30
        ? "🥵 High temperature — stay hydrated and avoid noon heat."
        : temp < 15
        ? "🧥 Cooler weather — wear warm clothing."
        : "😊 Temperature is comfortable for outdoor activities.",

      condition.includes("rain") || condition.includes("haze")
        ? "🌧 Reduced visibility expected — drive carefully."
        : "☀ Clear weather — good time for travel and outdoor plans.",

      humidity > 70
        ? "💧 High humidity may cause discomfort."
        : "🌬 Humidity levels are comfortable.",

      wind > 10
        ? "💨 Strong winds — avoid two-wheelers."
        : "🚗 Wind conditions are safe for commuting.",

      "📅 No severe weather alerts detected in the near term."
    ];
  };

  return (
    <div className="app">
      <h1>🌦 Weather Display</h1>
      <p className="subtitle">
        Real-time updates with intelligent impact advisory
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name (e.g., Mumbai)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {weather && weather.main && (
        <>
          {/* WEATHER CARD */}
          <div className="weather-card-wrapper">
            <div className="weather-card">
              <h2>
                📍 {weather.name}, {weather.sys.country}
              </h2>
              <p className="condition">
                {weather.weather[0].description}
              </p>

              <div className="temp">
                {Math.round(weather.main.temp)}°C
              </div>

              <div className="details">
                <p>🤒 Feels like: {weather.main.feels_like}°C</p>
                <p>💧 Humidity: {weather.main.humidity}%</p>
                <p>💨 Wind: {weather.wind.speed} km/h</p>
                <p>👁 Visibility: {weather.visibility / 1000} km</p>
                <p>🌡 Pressure: {weather.main.pressure} hPa</p>
              </div>
            </div>
          </div>

          {/* SUGGESTIONS BOX (SEPARATE) */}
          <div className="suggestion-section">
            <h3>🧠 Smart Weather Suggestions</h3>
            <ul>
              {getSuggestions().map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
