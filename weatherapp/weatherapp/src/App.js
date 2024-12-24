import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "aa8dfd477e1e46f6878172405242412 "; // Replace with your actual API key

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: API_KEY,
            q: city,
          },
        }
      );
      setWeatherData(response.data);
    } catch (err) {
      setError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Weather Application</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading && <p className="loading-message">Loading data…</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="weather-cards">
        {weatherData && (
          <div className="weather-card">
            <h2>{weatherData.location.name}</h2>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Condition: {weatherData.current.condition.text}</p>
            <p>Wind Speed: {weatherData.current.wind_kph} kph</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
