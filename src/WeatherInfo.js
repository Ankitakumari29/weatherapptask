import React, { useState, useEffect } from "react";
import "./styles.css";
const apiKey = "9f062e6adce8e561137df33ee90c84a3";

function WeatherInfo() {
  const [weatherData, setWeatherData] = useState(null);
  const [showFavourites, setShowFavourites] = useState(false);
  const [favouriteCities, setFavouriteCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  }

  function handleFavouriteClick(city) {
    fetchWeatherData(city);
    setShowFavourites(false);
  }

  function handleAddFavourite(city) {
    if (!favouriteCities.includes(city)) {
      setFavouriteCities([...favouriteCities, city]);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    if (searchTerm) {
      fetchWeatherData(searchTerm);
      setSearchTerm("");
    }
  }

  useEffect(() => {
    function getLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }

    async function fetchData() {
      try {
        const position = await getLocation();
        const { latitude, longitude } = position.coords;

        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiURL);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div>
        {weatherData ? (
          <div>
            <h2>Current Weather in {weatherData.name}</h2>
            <div className="box_container">
              <p className="boxx">
                Temperature: <br />
                {weatherData.main && weatherData.main.temp
                  ? `${weatherData.main.temp} °C`
                  : "N/A"}
              </p>
              <p className="boxx">
                Humidity: <br />
                {weatherData.main && weatherData.main.humidity
                  ? `${weatherData.main.humidity}%`
                  : "N/A"}
              </p>
              <p className="boxx">
                Weather Condition: <br />
                {weatherData.weather &&
                weatherData.weather[0] &&
                weatherData.weather[0].description
                  ? weatherData.weather[0].description
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

      <form onSubmit={handleSearch}>
        <input
          className="input"
          type="text"
          placeholder="Enter city name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      <button
        className="favbtn"
        onClick={() => handleAddFavourite(weatherData.name)}
      >
        Add to Favourites
      </button>
      <button
        className="favbtn"
        onClick={() => setShowFavourites(!showFavourites)}
      >
        Show Favourites
      </button>
      {showFavourites && (
        <div>
          <h3>Favourite Cities</h3>
          <ul>
            {favouriteCities.map((city) => (
              <li key={city}>
                <button
                  className="fav"
                  onClick={() => handleFavouriteClick(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeatherInfo;
