import React, { useEffect, useState } from 'react';
import hot from './assets/hot.jpg';
import cold from './assets/cold.jpg';
import Descriptions from './components/Descriptions';
import { getformattedWeatherData } from './weatherService';
import { FaMagnifyingGlass, FaLocationArrow } from 'react-icons/fa6';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Clock from './components/Clock'; 

function App() {
  const [city, setCity] = useState('Jaipur');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(hot);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getformattedWeatherData(city, units);
      if (data) {
        setWeather(data);
        toast.success("Weather Fetched!");
        const threshold = units === 'metric' ? 20 : 60;
        setBg(data.temp <= threshold ? cold : hot);
      } else {
        toast.error("Failed to fetch weather data. Please check the city name.");
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C';
    setUnits(isCelsius ? 'metric' : 'imperial');
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      const inputField = e.currentTarget;
      const capitalizedCity = inputField.value.charAt(0).toUpperCase() + inputField.value.slice(1).toLowerCase();
      setCity(capitalizedCity);
      inputField.value = capitalizedCity;

      toast.info("Fetching weather data...");
    }
  };

  const handleSearchClick = () => {
    const inputField = document.querySelector('input[name="city"]');
    const capitalizedCity = inputField.value.charAt(0).toUpperCase() + inputField.value.slice(1).toLowerCase();
    setCity(capitalizedCity);
    inputField.value = capitalizedCity;

    toast.info("Fetching weather data...");
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      toast.info("Fetching Your Location...");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherDataByCoords(latitude, longitude);
          toast.success("Fetched Your Location!");
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchWeatherDataByCoords = async (latitude, longitude) => {
    const data = await getformattedWeatherData(`${latitude},${longitude}`, units);
    if (data) {
      setWeather(data);
      const threshold = units === 'metric' ? 20 : 60;
      setBg(data.temp <= threshold ? cold : hot);
      toast.success("Weather Fetched!");
    } else {
      toast.error("Failed to fetch weather data for your location.");
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <div className="input-group">
                <input 
                  onKeyDown={enterKeyPressed} 
                  type="text" 
                  name="city" 
                  placeholder="Enter City...." 
                />
                <FaMagnifyingGlass className="search-icon" onClick={handleSearchClick} />
                <FaLocationArrow className="location-icon" onClick={handleLocationClick} />
              </div>
              <button onClick={handleUnitsClick}> °F</button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weather icon" className="weather-icon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()}°${units === 'metric' ? 'C' : 'F'}`}</h1>
              </div>
            </div>

            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
      <Clock /> 
    </div>
  );
}

export default App;
