var todaysWeather = document.getElementById('Todays-Forecast');
var APIKey = "fc68a64d0afee1bc09c4e15296f59f41";
var cityName = document.getElementById('city-name');
var currentIcon = document.getElementById('current-icon');
var currentTemp = document.getElementById('temp');
var currentWind = document.getElementById('wind-speed');
var currentHumidity = document.getElementById('humidity');
var currentUV = document.getElementById('UV-index');
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var history = document.getElementById('history');
var forecastHeader = document.getElementById('fiveDayForecast-header');
var fiveDayForecast = document.querySelectorAll('.forecast');


// Function to search weather by city and update card with response data
function getCoords(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey
    fetch(queryURL) 
    .then(function (response1) {
        return response1.json();
    })
   
    // OneCall API for UV Index and 5 Day Forecast
    .then(function (data) {        
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&cnt=1" + "&units=imperial" + "&appid=" + APIKey;
        fetch(weatherURL)
        .then(function (response2) {
            setCurrentWeather(data);       
            return response2.json();
        })            
            .then(function (data2) {
                setUVIndex(data2);
                setFiveDayForecast(data2);                 
            })
    })
}
// sets Current Weather Card
function setCurrentWeather(data) {
    todaysWeather.classList.remove('d-none');
    var currentDate = new Date(data.dt * 1000);
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    cityName.innerHTML = data.name + " "  + "-" + " " + month + "/" + day + "/" + year;
    var weatherIcon = data.weather[0].icon;
    currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
    currentTemp.innerHTML = "Temperature: " + data.main.temp + "&#8457";
    currentWind.innerHTML = "Wind Speed: " + data.wind.speed +" MPH";
    currentHumidity.innerHTML = "Humidity: " + data.main.humidity + "%";
}
// Function to set UV Index
function setUVIndex (data) {
    currentUV.innerHTML = "UV Index: " + data.current.uvi;
    if (data.current.uvi <= 2) {
        currentUV.setAttribute('class', 'badge badge-success');
    } else if (data.current.uvi <= 5) {
        currentUV.setAttribute('class', 'badge badge-warning');
    } else {
        currentUV.setAttribute('class', 'badge badge-danger');
    }
    
}

function setFiveDayForecast (data) {
    forecastHeader.classList.remove('d-none');
    for (i = 0; i <fiveDayForecast.length; i++) {
        var forecastDate = new Date(data.dt * 1000);
        var day = forecastDate.getDate();
        var month = forecastDate.getMonth() + 1;
        var year = forecastDate.getFullYear();
        var dailyDate = document.createElement('h3')
        dailyDate.innerHTML =  month + "/" + day + "/" + year;
        var weatherIcon = data.daily[i].weather[0].icon;
        var forecastIcon = document.createElement('img');
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        var forecastTemp = document.createElement('p');
        forecastTemp.innerHTML = "Temperature: " + data.daily[i].temp + "&#8457";
        var forecastWind = document.createElement('p');
        forecastWind.innerHTML = "Wind Speed: " + data.daily[i].wind_speed +" MPH";
        var forecastHumidity = document.createElement('p');
        forecastHumidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
        }


}
// Function to list Recent Searches
function listSearchHistory() {
    for (let i = 0; i < searchHistory.length; i++) {
        var recentCity = document.createElement('input');
        recentCity.setAttribute('type', 'text');
        recentCity.setAttribute('class', 'form-control d-block bg-grey');
        recentCity.setAttribute('readonly', true);
        recentCity.setAttribute('value', searchHistory[i]);
        recentCity.addEventListener('click', function () {
            getCoords(recentCity.value);
        })
    }
}

function init() {
    listSearchHistory();
}

// Event Handler for 'Search' Button
$('#searchBtn').click(function () {
    var city = $( ":input" ).val();
    getCoords(city);
    searchHistory.push(city);
    localStorage.setItem("search", JSON.stringify(searchHistory))
})
// Event Handler for 'Clear Recent Searches' Button
$('#clearBtn').click(function () {
    localStorage.clear();
    searchHistory = [];
    listSearchHistory();
})

init();