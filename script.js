const myAPIKey = "8b089a3e62e3567c3868005968739590";
const apiUrl = "https://api.openweathermap.org/data/2.5";

const form = document.querySelector("#search-form");
const button = document.querySelector("#search-button");

form.addEventListener("submit", handleCitySearch);
button.addEventListener("click", handleCitySearch);

// function that handles the city searched when the form is submitted
function handleCitySearch(event) {
  event.preventDefault();
  const input = document.querySelector("#search-input");
  // trims whitespaces from the input value and assigns it to cityName variable
  const cityName = input.value.trim();
  if (cityName.length > 0) {
    getCoordinates(cityName);
    // sets the value of the input element to an empty string
    input.value = "";
  }
}

function loadCityHistory() {
  // gets cityHistory from localStorage
  let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
  let historySection = document.querySelector("#history");
  let historySectionContent = "";

  // loops over the first 5 items of the cityHistory array
  for (let i = 0; i < cityHistory.length; i++) {
    const city = cityHistory[i];
    // historySection.appendChild(button);
    historySectionContent += `<button class="btn btn-secondary text-center mb-3" onclick="searchCity('${city}')">${city}</button>`;

  } 
   historySection.innerHTML = historySectionContent; 
}
loadCityHistory();

// function that constructs the URL for the OpenWeatherMap API request
function searchCity(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myAPIKey}`;
  $.ajax({
    method: "GET",
    url: url,
    // checks if the "code" is equal to 200 (success)
  }).then(function (response) {
    if (response.cod == 200) {
      // if the city was found, extracts the lat and lon from the response object
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      getWeatherData(lat, lon, cityName);
      } else {
      console.log("City not found");
    }
  });
}

// function that gets the weather data
function getWeatherData(lat, lon, cityName) {
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myAPIKey}`;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myAPIKey}`;
  
  $.ajax({
    method: "GET",
    url: url,
  }).then(function (response) {
    if (response.cod == 200) {
      updateWeather(response);
      loadCityHistory();
      // console.log(response);
    } else {
      console.log("Unable to get weather data!");
    }
  });

  // updates the city history in local storage by adding the new city name to the start of the array
  let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
  cityHistory.unshift(cityName);
  // checks that only 5 most recent city names are stored
  if (cityHistory.length > 6) cityHistory.pop();
  // stores the updated city history in localStorage
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}

// function that updates the weather
function updateWeather(data) {
  const cityName = data.city.name;
  // creates an object to get the current date and time
  const date = new Date();
  const iconUrl = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
  // gets the temperature from the object and converts it to Celsius
  const temp = (data.list[0].main.temp - 273.15).toFixed(2);
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  const todayForecast = document.querySelector("#today");
  // updates the HTML content of the today section with the weather data
  todayForecast.innerHTML = `
        <h2>${cityName} (${date.toLocaleDateString()})</h2>
        <img src = "${iconUrl}" alt = "${cityName}">
        <p>Temperature: ${temp} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}



// function that gets the coordinates from the api
function getCoordinates(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIKey}`;
  $.ajax({
    method: "GET",
    url: url,
  }).then(function (response) {
    if (response.cod === 200) {
      const lat = response.coord.lat;
      const lon = response.coord.lon;
      getWeatherData(lat, lon, city);
    } else {
      console.log("City not found");
    }
  });
}

