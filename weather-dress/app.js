document.addEventListener('DOMContentLoaded', function () {
  const temperatureUnitButton = document.getElementById('toggleButton');
  const weatherInfo = document.getElementById('weatherInfo');
  const clothingImage = document.getElementById('clothingImage');

  let temperatureUnit = 'C';

  const handleToggleTemperatureUnit = () => {
    temperatureUnit = temperatureUnit === 'C' ? 'F' : 'C';
    updateTemperatureUnitText();
  };

  const updateTemperatureUnitText = () => {
    temperatureUnitButton.textContent = `Toggle Temperature Unit (${temperatureUnit})`;
  };

  const convertTemperature = (temperature, unit) => {
    return unit === 'F' ? (temperature * 9) / 5 + 32 : temperature;
  };

  const getTemperatureUnitSymbol = (unit) => {
    return unit === 'F' ? '°F' : '°C';
  };

  const renderWeatherInfo = (weather) => {
    if (!weather) {
      return;
    }

    const { name, main, weather: weatherDetails } = weather;
    const conditionCode = weatherDetails && weatherDetails.length > 0 ? weatherDetails[0].id : null;
    const conditionText = getWeatherConditionText(conditionCode);

    weatherInfo.innerHTML = `
      <h2>${name}</h2>
      ${main ? `<p>Temperature: ${convertTemperature(main.temp, temperatureUnit)}${getTemperatureUnitSymbol(temperatureUnit)}</p>` : ''}
      ${weatherDetails ? `<p>Condition: ${conditionText} ${conditionText ? getWeatherIcon(conditionCode) : ''}</p>` : ''}
    `;
  };

  const getWeatherConditionText = (conditionCode) => {
    switch (conditionCode) {
      case 800:
        return 'Clear Sky';
      case 801:
      case 802:
      case 803:
      case 804:
        return 'Clouds';
      // ... (Other cases)
      default:
        return 'Unknown';
    }
  };

  const getWeatherIcon = (conditionCode) => {
    switch (conditionCode) {
      case 800:
        return '<i class="fas fa-sun"></i>';
      case 801:
      case 802:
      case 803:
      case 804:
        return '<i class="fas fa-cloud"></i>';
      // ... (Other cases)
      default:
        return '';
    }
  };

  const fetchWeatherDataByCoordinates = async (latitude, longitude) => {
    try {
      const apiKey = '53ec0ec9cf5998a579ac680a871a01da';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Error fetching weather data:', response.status);
        setWeatherData(null);
        return;
      }

      const data = await response.json();
      renderWeatherInfo(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const getLocationAndWeather = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherDataByCoordinates(latitude, longitude);
          },
          (error) => {
            console.error("Error getting user's location:", error);
            setWeatherData(null);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  // Event listeners
  temperatureUnitButton.addEventListener('click', handleToggleTemperatureUnit);

  // Initial setup
  updateTemperatureUnitText();
  getLocationAndWeather();
});
