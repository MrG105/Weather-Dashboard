var todaysWeather = document.getElementById('Todays-Forecast');
var APIKey = "fc68a64d0afee1bc09c4e15296f59f41";
var cityName = document.getElementById('city-name');
var currentIcon = document.getElementById('current-icon');
var currentTemp = document.getElementById('temp');
var currentWind = document.getElementById('wind-speed');
var currentHumidity = document.getElementById('humidity');
var currentUV = document.getElementById('UV-index');
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var recentHistory = document.getElementById('history');
var forecastHeader = document.getElementById('fiveDayForecast-header');
var fiveDayForecast = document.querySelectorAll('.forecast');


// Function to search weather by city and update card with response data
function getCoords(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey
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
// Function to display and populate the forecast cards
function setFiveDayForecast (data) {
    forecastHeader.classList.remove('d-none');
    for (i = 0; i <fiveDayForecast.length; i++) {
        fiveDayForecast[i].innerHTML = '';
        var forecastDate = new Date(data.daily[i+1].dt * 1000);
        var day = forecastDate.getDate();
        var month = forecastDate.getMonth() + 1;
        var year = forecastDate.getFullYear();
        var dailyDate = document.createElement('h3')
        dailyDate.innerHTML =  month + "/" + day + "/" + year;
        fiveDayForecast[i].appendChild(dailyDate);
        var weatherIcon = data.daily[i+1].weather[0].icon;
        var forecastIcon = document.createElement('img');
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        fiveDayForecast[i].appendChild(forecastIcon);
        var forecastTemp = document.createElement('p');
        forecastTemp.innerHTML = "Temperature: " + data.daily[i+1].temp.day + "&#8457";
        fiveDayForecast[i].appendChild(forecastTemp);
        var forecastWind = document.createElement('p');
        forecastWind.innerHTML = "Wind Speed: " + data.daily[i+1].wind_speed +" MPH";
        fiveDayForecast[i].appendChild(forecastWind);
        var forecastHumidity = document.createElement('p');
        forecastHumidity.innerHTML = "Humidity: " + data.daily[i+1].humidity + "%";
        fiveDayForecast[i].appendChild(forecastHumidity);
        }


}
// Function to list Recent Searches
function listSearchHistory() {
    recentHistory.innerHTML = '';
    for (let i = 0; i < searchHistory.length; i++) {
        var recentCity = document.createElement('button');
        recentCity.setAttribute('class', 'row text-center d-block btn btn-secondary mb-2 btn-block');
        recentCity.setAttribute('value', searchHistory[i]);
        recentCity.innerText = recentCity.value;
        recentCity.addEventListener('click', function () {
            getCoords(this.value);
        })
        recentHistory.appendChild(recentCity);
    }
}
// Function to load Recent Searches on startup
function init() {
    listSearchHistory();
}

// Event Handler for 'Search' Button
$('#searchBtn').click(function () {
    var city = $( ":input" ).val();
    getCoords(city);
    searchHistory.push(city);
    localStorage.setItem("search", JSON.stringify(searchHistory))
    listSearchHistory();
})
// Event Handler for 'Clear Recent Searches' Button
$('#clearBtn').click(function () {
    localStorage.clear();
    searchHistory = [];
    listSearchHistory();
})

// runs on page start
init();
