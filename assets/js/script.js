const apiKey = "f0dc6ff883ba76f9d1293ab130d58446";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherCard = document.getElementById("weatherCard");
const weatherStats = document.getElementById("weatherStats");
const forecastSection = document.getElementById("forecastSection");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const currentDate = document.getElementById("currentDate");

const weatherIcon = document.getElementById("weatherIcon");

const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const minmax = document.getElementById("minmax");

const forecastContainer =
    document.getElementById("forecastContainer");

const historyContainer =
    document.getElementById("historyContainer");

/* SHOW LOADING */

function showLoading() {

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");
    weatherStats.classList.add("hidden");
    forecastSection.classList.add("hidden");

    errorMessage.textContent = "";
}

/* HIDE LOADING */

function hideLoading() {

    loading.classList.add("hidden");
}

/* GET WEATHER */

async function getWeather(city) {

    showLoading();

    try {

        const weatherResponse =
            await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

        if (!weatherResponse.ok) {

            throw new Error(
                "City not found."
            );
        }

        const weatherData =
            await weatherResponse.json();

        displayWeather(weatherData);

        getForecast(city);

        saveSearch(city);

    }

    catch (error) {

        errorMessage.textContent =
            error.message;

    }

    finally {

        hideLoading();
    }
}

/* DISPLAY WEATHER */

function displayWeather(data) {

    cityName.textContent =
        data.name;

    countryName.textContent =
        data.sys.country;

    currentDate.textContent =
        new Date().toLocaleString();

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;

    minmax.textContent =
        `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    sunrise.textContent =
        formatTime(data.sys.sunrise);

    sunset.textContent =
        formatTime(data.sys.sunset);

    weatherCard.classList.remove("hidden");
    weatherStats.classList.remove("hidden");

    updateBackground(
        data.weather[0].main
    );
}

/* FORECAST */

async function getForecast(city) {

    try {

        const response =
            await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
            );

        const data =
            await response.json();

        displayForecast(data);

    }

    catch (error) {

        console.log(error);
    }
}

/* DISPLAY FORECAST */

function displayForecast(data) {

    forecastContainer.innerHTML = "";

    const dailyData =
        data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

    dailyData.slice(0, 5).forEach(day => {

        const card =
            document.createElement("div");

        card.className =
            "forecast-card";

        card.innerHTML = `
            <h3>
                ${new Date(day.dt_txt)
                    .toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                    )}
            </h3>

            <img
            src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <p>
                ${Math.round(day.main.temp)}°C
            </p>

            <p>
                ${day.weather[0].description}
            </p>
        `;

        forecastContainer.appendChild(card);
    });

    forecastSection.classList.remove(
        "hidden"
    );
}

/* TIME FORMAT */

function formatTime(timestamp) {

    return new Date(
        timestamp * 1000
    ).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

/* SEARCH HISTORY */

function saveSearch(city) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "weatherHistory"
            )
        ) || [];

    if (
        !history.includes(city)
    ) {

        history.unshift(city);

        history =
            history.slice(0, 8);

        localStorage.setItem(
            "weatherHistory",
            JSON.stringify(history)
        );
    }

    renderHistory();
}

function renderHistory() {

    let history =
        JSON.parse(
            localStorage.getItem(
                "weatherHistory"
            )
        ) || [];

    historyContainer.innerHTML = "";

    history.forEach(city => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";

        item.textContent =
            city;

        item.addEventListener(
            "click",
            () => getWeather(city)
        );

        historyContainer.appendChild(
            item
        );
    });
}

/* DYNAMIC BACKGROUND */

function updateBackground(type) {

    const body =
        document.body;

    switch (type) {

        case "Clear":

            body.style.background =
                "linear-gradient(135deg,#4facfe,#00f2fe)";
            break;

        case "Clouds":

            body.style.background =
                "linear-gradient(135deg,#667db6,#0082c8,#667db6)";
            break;

        case "Rain":

            body.style.background =
                "linear-gradient(135deg,#232526,#414345)";
            break;

        case "Snow":

            body.style.background =
                "linear-gradient(135deg,#E6DADA,#274046)";
            break;

        case "Thunderstorm":

            body.style.background =
                "linear-gradient(135deg,#141E30,#243B55)";
            break;

        default:

            body.style.background =
                "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)";
    }
}

/* GEOLOCATION */

locationBtn.addEventListener(
    "click",
    () => {

        navigator.geolocation.getCurrentPosition(
            async position => {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;

                showLoading();

                try {

                    const response =
                        await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                        );

                    const data =
                        await response.json();

                    displayWeather(data);

                    getForecast(
                        data.name
                    );
                }

                catch (error) {

                    errorMessage.textContent =
                        "Unable to fetch location weather.";
                }

                finally {

                    hideLoading();
                }
            }
        );
    }
);

/* SEARCH BUTTON */

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();

        if (city === "") {

            errorMessage.textContent =
                "Please enter a city.";

            return;
        }

        getWeather(city);
    }
);

/* ENTER KEY */

cityInput.addEventListener(
    "keypress",
    event => {

        if (
            event.key === "Enter"
        ) {

            searchBtn.click();
        }
    }
);

/* INITIAL LOAD */

renderHistory();

getWeather("London");