// OpenWeatherMap API configuration
const API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04'; // Using a different API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.querySelector('.city-name');
const country = document.querySelector('.country');
const temperature = document.querySelector('.temperature');
const weatherIcon = document.querySelector('.weather-icon');
const weatherDescription = document.querySelector('.weather-description');
const feelsLike = document.querySelector('.feels-like');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');
const weatherCard = document.getElementById('weather-card');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Functions
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        setLoading(true);
        const weatherData = await getWeatherData(city);
        updateUI(weatherData);
        searchInput.value = '';
    } catch (error) {
        showError('City not found. Please check the spelling and try again.');
    } finally {
        setLoading(false);
    }
}

async function getWeatherData(city) {
    const response = await fetch(
        `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
        throw new Error('City not found');
    }
    
    return await response.json();
}

function updateUI(data) {
    weatherCard.classList.add('fade-out');
    
    setTimeout(() => {
        cityName.textContent = data.name;
        country.textContent = data.sys.country;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        weatherIcon.alt = data.weather[0].description;
        weatherDescription.textContent = capitalizeFirstLetter(data.weather[0].description);
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        
        weatherCard.classList.remove('fade-out');
        weatherCard.classList.add('fade-in');
    }, 300);
}

function setLoading(isLoading) {
    const loader = document.querySelector('.loader');
    if (isLoading) {
        weatherCard.classList.add('loading');
        loader.style.display = 'flex';
    } else {
        weatherCard.classList.remove('loading');
        loader.style.display = 'none';
    }
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="error-content">
            <i class="bi bi-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize with a default city
window.addEventListener('load', () => {
    searchInput.value = 'London';
    handleSearch();
});