const API_KEY = "ccd987c3c543c211bfe32fd032769068";
// const API_KEY = "YOUR_OPENWEATHER_API_KEY";

// MAP INIT
var map = L.map('map').setView([20, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
let marker;

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("dark");
}

// GPS LOCATION
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        });
    } else {
        alert("Geolocation not supported.");
    }
}

// SEARCH
function searchWeather() {
    const city = document.getElementById("cityInput").value;
    if (city.trim() !== "") getWeather(city);
}

// TOP 5
function loadCity(city) {
    getWeather(city);
}

/* --------------------------
   MAIN WEATHER FUNCTION
--------------------------- */
async function getWeather(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    updateUI(data);
    getForecast(data.coord.lat, data.coord.lon);
}

/* --------------------------
   WEATHER BY COORDINATES
--------------------------- */
async function getWeatherByCoords(lat, lon) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    updateUI(data);
    getForecast(lat, lon);
}

/* --------------------------
      UPDATE UI & MAP
--------------------------- */
function updateUI(data) {
    document.getElementById("cityName").innerText =
        `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText =
        `${data.main.temp}°C`;
    document.getElementById("description").innerText =
        data.weather[0].description;
    document.getElementById("extra").innerHTML =
        `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;

    // ICON
    let icon = data.weather[0].icon.slice(0, 2);
    document.getElementById("bigIcon").className =
        "wi " + mapIcon(icon);

    document.getElementById("weatherCard").classList.remove("hidden");

    // ANIMATED BACKGROUND
    setBackground(icon);

    // MAP
    const { lat, lon } = data.coord;
    map.setView([lat, lon], 10);

    if (marker) marker.remove();
    marker = L.marker([lat, lon]).addTo(map);
}

/* --------------------------
       5-DAY FORECAST
--------------------------- */
async function getForecast(lat, lon) {
    const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    forecastDiv.classList.remove("hidden");

    let temps = [];
    let labels = [];

    for (let i = 0; i < data.list.length; i += 8) {
        let day = data.list[i];
        let icon = day.weather[0].icon.slice(0, 2);

        forecastDiv.innerHTML += `
            <div class="forecast-day">
                <span>${new Date(day.dt_txt).toLocaleDateString()}</span>
                <span><i class="wi ${mapIcon(icon)}"></i></span>
                <span>${Math.round(day.main.temp)}°C</span>
            </div>
        `;

        temps.push(day.main.temp);
        labels.push(new Date(day.dt_txt).toLocaleDateString());
    }

    drawChart(labels, temps);
}

/* --------------------------
      TEMP CHART
--------------------------- */
let chart;

function drawChart(labels, temps) {
    const ctx = document.getElementById("tempChart");
    ctx.classList.remove("hidden");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Temperature (°C)",
                data: temps,
                borderColor: "#4158D0",
                borderWidth: 3,
                fill: false
            }]
        }
    });
}

/* --------------------------
       ICON MAPPING
--------------------------- */
function mapIcon(code) {
    const icons = {
        "01": "wi-day-sunny",
        "02": "wi-day-cloudy",
        "03": "wi-cloud",
        "04": "wi-cloudy",
        "09": "wi-showers",
        "10": "wi-rain",
        "11": "wi-thunderstorm",
        "13": "wi-snow",
        "50": "wi-fog"
    };
    return icons[code] || "wi-na";
}

/* --------------------------
   ANIMATED BACKGROUNDS
--------------------------- */
function setBackground(icon) {
    if (icon === "01") document.body.style.background = "linear-gradient(135deg,#FFD371,#FFB100)";
    if (icon === "02") document.body.style.background = "linear-gradient(135deg,#8EC5FC,#E0C3FC)";
    if (icon === "03" || icon === "04") document.body.style.background = "linear-gradient(135deg,#8e9eab,#eef2f3)";
    if (icon === "09" || icon === "10") document.body.style.background = "linear-gradient(135deg,#4facfe,#00f2fe)";
    if (icon === "11") document.body.style.background = "linear-gradient(135deg,#232526,#414345)";
    if (icon === "13") document.body.style.background = "linear-gradient(135deg,#89f7fe,#66a6ff)";
    if (icon === "50") document.body.style.background = "linear-gradient(135deg,#bdc3c7,#2c3e50)";
}
