const apiKey = '02980668ed0af6eccf66ce6f9cfe7f7b'
const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById('error');

const units = 'metric'; 
let temperatureSymobol = units == 'metric' ? "°C" : "°F";

async function fetchWeather() {
    try {
        weatherContainer.innerHTML = '';
        error.innerHTML = '';
        city.innerHTML = '';

        const cnt = 10;
        const cityInputtedByUser = document.getElementById('cityInput').value;

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}&cnt=${cnt}`;


        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod == '400' || data.cod == '404') {
            error.innerHTML = `Invalid.`;
            return;
        }

        data.list.forEach(hourlyWeatherData => {
            const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
            weatherContainer.appendChild(hourlyWeatherDataDiv);
        });

        city.innerHTML = `Hourly Weather for ${data.city.name}`;

    } catch (error) {
        console.log(error);
    }
}

function convertToLocalTime(dt) {

    const date = new Date(dt * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;

}

function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;

    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    description.innerHTML = `
        <div class = "weather_description">${main.temp}${temperatureSymobol} - ${convertedDateAndTime.substring(10)} - ${convertedDateAndTime.substring(5, 10)} </div>
    `;
    return description;
}