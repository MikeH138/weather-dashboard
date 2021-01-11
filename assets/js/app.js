$(document).ready(function () {
// API key and other related variables
var APIKey = "57997d33e6ed54e5bf55f2b8f7ec7cec";
var city = "";
var lat = "";
var lon = "";

// DOM variables for search input and recent search list
var searchHistory = document.querySelector(".search-history");

var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Variables for displaying the current date
var currentDate = new Date();
var month = currentDate.getMonth();
var day = currentDate.getDate();
var year = currentDate.getFullYear();

// Requesting the current weather
function getCurrentWeather() {
  
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    var currentWeatherResponse = response;

    lat = response.coord.lat;
    lon = response.coord.lon;

    queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      var currentUV = response;

      displayCurrentWeather(currentWeatherResponse, currentUV);
    });
  });
}

// Generating a list of recent user searches
function buildSearchList() {
  searchHistory.innerHTML = "";

  for (var i = 0; i < recentSearches.length; i++) {
    var listOfCities = recentSearches[i];

    var recentCity = document.createElement("li");
    recentCity.textContent = listOfCities;
    recentCity.classList.add("list-group-item", "search-history");

    searchHistory.appendChild(recentCity);
  }
}

// Generating the html for the current weather in the city the user searched for
function displayCurrentWeather(response1, response2) {
  document.getElementById("card-body");
  $(".city-title").html(`<h1>${response1.name} (${month + 1}/${day}/${year}) <img src="https://openweathermap.org/img/wn/${response1.weather[0].icon}.png"></h1>`);
  $(".temperature").text(`Temperature: ${response1.main.temp.toFixed(1)} °F`);
  $(".humidity").text(`Humidity: ${response1.main.humidity}%`);
  $(".wind-speed").text(`Wind Speed: ${response1.wind.speed} MPH`);
  $(".uv-index").html(`<div>UV Index: <span id="uvIndex">${response2.value}</span></div>`);

  var uvIndex = response2.value;
  var uvStyle = document.getElementById("uvIndex");

  if (uvIndex < 3) {
    uvStyle.classList.add("favorable");
  } else if (uvIndex > 3 && uvIndex < 7) {
    uvStyle.classList.add("moderate");
  } else {
    uvStyle.classList.add("severe");
  }

}

// Generating the 5 Day forecast for the city the user entered and rendering it on the page
function getFiveDayForecast() {

  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    $(".five-day-forecast").html(`<h3>5-Day Forecast:</h3>`);

    var forecast = "";

    $(".card-deck").empty();

    for (var i = 0; i < 5; i++) {

      forecast +=
        `<div class="card text-white bg-primary card-pad">
          <h5>${month + 1}/${day + 1 + i}/${year}</h5>
          <span><img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png"></span>
          <p>Temp: ${response.list[i].main.temp.toFixed(2)}&#176;F</p>
          <p>Humidity: ${response.list[i].main.humidity}&#37</p>
          </div>`;
    }

    $(".card-deck").append(forecast);

  });

}

// Saving recent searches to localStorage
function saveSearches() {
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

// Event handler (on-click) for the search button
$(".search-btn").on("click", function(e) {
  e.preventDefault();

  var searchBar = (document.querySelector(".search-bar")).value.trim();

  if (searchBar === "") {
    return;
  }

  recentSearches.push(searchBar);

  searchBar.text = "";
  city = searchBar;

  saveSearches();

  buildSearchList();

  getCurrentWeather();

  getFiveDayForecast();

});

})