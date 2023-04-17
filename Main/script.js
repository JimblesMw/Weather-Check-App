var APIKey = "140868a0bfdca5e4838b5700f0881180";
var city;
var queryURL;
var geoQuery;
var lat;
var long;
var prevSearches = document.getElementById('previous_cities');
var prevSearchesButton = document.getElementById('prevcities');
var searchStorage = window.localStorage.getItem("City")
? JSON.parse(window.localStorage.getItem("City"))
: [];

var d = new Date();
var day0 = d.getDate();
var month0 = d.getMonth();
var year0 = d.getFullYear();
if(month0 < 12){
    month0 = month0 + 1;
}
else{
    month0 = 12;
};
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];


function CheckDay(day){
    if(day + d.getDay() > 6){
        return day + d.getDay() - 7;
    }
    else{
        return day + d.getDay();
    }
}
    for(i = 0; i<5; i++){
        document.getElementById("day" + (i+1)).innerHTML = weekday[CheckDay(i+1)];
    }

    document.querySelector('#Para2').innerHTML = "Current Weather" + ' ('+ month0 +'/'+ day0 +'/' +year0 +')';

    console.log(searchStorage);
    let uniqueSearches = [...new Set(searchStorage)];
    console.log(uniqueSearches);
        for (var i = 0; i < uniqueSearches.length; i++) {
            if (uniqueSearches[i] === '') {
                console.log('null');
            }
            else {
        var entry = document.createElement('li');
        var newBtn = document.createElement('button');
        newBtn.innerHTML = uniqueSearches[i];
        newBtn.dataset.city = uniqueSearches[i];
        newBtn.onclick = function() {
            getCurrentWeather(this.getAttribute("data-city"));
        };
        prevSearchButton.appendChild(newBtn);
        }
    }

    var searchValue = document.querySelector('#cityInput');
searchValue.addEventListener('keypress', setFunc);
    function setFunc(e) {

        if(e.keyCode === 13) {
            getCurrentWeather(searchValue.value);
        }
    }


    function getInfo() {
        getCurrentWeather(searchValue.value);
    };

    function findMe() {

           const succesfulLookup = (position) => {
           var latitude2 = position.coords.latitude;
           var longitude2 = position.coords.longitude;
           var city2;
           console.log(latitude2);
           console.log (longitude2);
           console.log(position);

           fetch("https://api.openweathermap.org/geo/1.0/reverse?lat=" + latitude2 + "&lon=" + longitude2 +"&limit=1&appid="+ APIKey)
           .then (function (response) {
               return response.json();
           })
           .then(function (latlong) {
               
               console.log(latlong);
               city2 = latlong[0].name;
               getCurrentWeather(city2);
               document.querySelector('#cityInput').value = city2;
             
           })
           .catch(function (err) {
               console.log(err);
           })
   };
       navigator.geolocation.getCurrentPosition(succesfulLookup, console.log);

    };


    function getCurrentWeather(city) {
        var day0 = d.getDate();
        var month0 = d.getMonth();
        var year0 = d.getFullYear();
    
        if(month0 < 12){
            month0 = month0 + 1;
        }
        else{
            month0 = 12;
        };

        document.querySelector('#city').innerHTML = city;

    if (!searchStorage.includes(city)) {
        searchStorage.push(city);
        localStorage.setItem("City", city);
        console.log(localStorage.getItem("City"));
         localStorage.setItem("City", JSON.stringify(searchStorage));
         var entry = document.createElement('li');
         var newBtn = document.createElement('button');
         newBtn.innerHTML = city;
         newBtn.dataset.city = city;
         newBtn.onclick = function() {
            getCurrentWeather(this.getAttribute("data-city"));
        };
        prevCitiesButton.appendChild(newBtn);


    }

    geoQuery = 'https://api.openweathermap.org/geo/1.0/direct?q='+ city+ '&limit=5&appid=' + APIKey;

    getLatLong(city)
    long = latlong[0].lon;

    getData(lat, long);
}


function getData(lat, long) {
var lat1 = lat;
var long2 = long;

queryURL = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat1 + '&lon=' + long2 +'&units=imperial&exclude=hourly,minutely,daily&appid=' + APIKey;
        fetch(queryURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (weather) {
            
            document.getElementById("img0").src = "https://openweathermap.org/img/wn/"+ weather.current.weather[0].icon +".png";
            document.querySelector('#temp').innerHTML = "Temp: " + weather.current.temp;            
            document.querySelector('#humidity').innerHTML = "Humidity: "+ weather.current.humidity;
            document.querySelector('#wind_dir_speed').innerHTML = "Wind Speed: "+weather.current.wind_speed + " MPH";
        })
        .catch(function (err) {
            console.log(err);
        })
    }


    function getForecast(city) {
        queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+APIKey;
        fetch(queryURL)
        .then (function (response) {
            return response.json();
        })
        .then(function (forecast) {
            var j = 1;
        for (var i = 1; i<6; i++) {
            document.getElementById("img"+i).src = "https://openweathermap.org/img/wn/"+ forecast.list[j].weather[0].icon +".png";
            document.getElementById("day" + (i) + "Min").innerHTML = "Temp: " + Number(forecast.list[j].main.temp).toFixed(1)+ "°";
            document.getElementById("day" + (i) + "Max").innerHTML = "Wind Speed: " + Number(forecast.list[j].wind.speed)+ "MPH";
            document.getElementById("day" + (i) + "humidity").innerHTML = "Humidity: " + Number(forecast.list[j].main.humidity);
            j = j +8;
        }
   })
}
