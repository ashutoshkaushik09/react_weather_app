const API_KEY = '506ebe5c36ea67d78164a037232a5a3a';

const makeIconURL = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const getformattedWeatherData = async (city, units = 'metric') => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    const { weather, main: { temp, feels_like, temp_min, temp_max, pressure, humidity }, wind: { speed }, sys: { country }, name } = data;

    const { description, icon } = weather[0];

    return {
      description,
      iconURL: makeIconURL(icon), 
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      speed,
      country,
      name,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null; 
  }
};

export { getformattedWeatherData };
