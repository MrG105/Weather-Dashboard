var todaysWeather = document.getElementById('Todays-Forecast');
var APIKey = "fc68a64d0afee1bc09c4e15296f59f41";
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var cityName = document.getElementById('city-name');
var currentIcon = document.getElementById('current-icon');
var currentTemp = document.getElementById('temp');
var currentWind = document.getElementById('wind-speed');
var currentHumidity = document.getElementById('humidity');
var currentUV = document.getElementById('UV-index');

// Function to search weather by city and update card with response data
function getCoords(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + APIKey
    fetch(queryURL) 
    .then(function (response) {
        return response.json();
    })
   
    .then(function (data) {
        todaysWeather.classList.remove('d-none');
        var currentDate = new Date(data.dt * 1000);
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        cityName.innerHTML = data.name + " "  + "-" + " " + month + "/" + day + "/" + year;
        var weatherIcon = data.weather[0].icon;
        currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        currentTemp.innerHTML = "Temperature: " + data.main.temp;
        currentWind.innerHTML = "Wind Speed: " + data.wind.speed +" MPH";
        currentHumidity.innerHTML = "Humidity: " + data.main.humidity + "%";
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        // OneCall API for UV Index and 5 Day Forecast
        var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&cnt=1" + "&appid=" + APIKey;
        fetch(weatherURL)
        .then(function (response) {
            return response.json();
            
         })
    })
}

// Event Handler for Search Button
$('#searchBtn').click(function () {
    var city = $( ":input" ).val();
    getCoords(city);
    searchHistory.push(city);
    localStorage.setItem("search", JSON.stringify(searchHistory))
})