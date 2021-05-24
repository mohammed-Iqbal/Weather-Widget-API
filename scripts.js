// Openweathermap API.
const api = '7bf41286bd1da6e1c6115aa733eb588b';

// get Dom Element for 5 days forecast
let current_condition_element = document.getElementById("current-conditions");
let forecast_element = document.getElementById("fivedayforecast");

const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednessday",
    "Thursday",
    "Friday",
    "Saturday"
];
let long, lat;

// declar units
let CelsiusUnit = 'metric';
let CelsiusSymbol = '℃';
let FahrenheitUnit = 'imperial';
let FahrenheitSymbol = '°F';

window.addEventListener('load', () => {
// Accesing Geolocation of Users.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            currentWeatherForecast(lat, long, CelsiusUnit, CelsiusSymbol);
            fiveDayForecast(lat, long, CelsiusUnit, CelsiusSymbol);
        });
    }
});

async function toggle(button) {
    switch (button.value) {
        case "Switch to Fahrenheit":
            button.value = "Switch to Celsius";
            currentWeatherForecast(lat, long, FahrenheitUnit, FahrenheitSymbol);
            fiveDayForecast(lat, long, FahrenheitUnit, FahrenheitSymbol);
            break;
        case "Switch to Celsius":
            button.value = "Switch to Fahrenheit";
            currentWeatherForecast(lat, long, CelsiusUnit, CelsiusSymbol);
            fiveDayForecast(lat, long, CelsiusUnit, CelsiusSymbol);
            break;
    }
}

async function currentWeatherForecast(lat, long, units, symbol) {
// api end point for current waather.
    const current = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=${units}`;
    fetch(current)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let {temp} = data.main;
                let {description, icon} = data.weather[0];
                let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`; // create icon url
// create html for current temprature
                let html = '<h2>Current Conditions</h2>' +
                        '<img src="' + iconUrl + '" />' +
                        '<div class="current">' +
                        '<div class="temp">' + temp + symbol + '</div>' +
                        '<div class="condition">' + description + '</div>' +
                        '</div>';
                current_condition_element.innerHTML = html;


            });
}

async function fiveDayForecast(lat, long, units, symbol) {
// api end point for forecast using same lat and lng        
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${api}&units=${units}`;
    fetch(forecast)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let forecastHtml = '';
                let dayHtml = '';
                let headingCondition = true;
                let currentDay = weekDays[new Date(data.list[0].dt_txt).getDay()];
                let dayMinMax=[];
                for (let i = 0; i < data.list.length; i++) {
                    
                    let {temp_min, temp_max} = data.list[i].main; // get min and max tempreature
                    let {description, icon} = data.list[i].weather[0];
                    let dt_txt = data.list[i].dt_txt;
                    let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                    // Generate Time from date time
                    let date = new Date(dt_txt);
                    let day = weekDays[date.getDay()];
                    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                    
                    // Add html in forecastHtml if day change
                    if (currentDay != day) {
                        forecastHtml += dayHtml;
                        forecastHtml += '<p>' + currentDay + ' Max Temprature ' + Math.max(...dayMinMax)+ symbol + ' Min Temprature ' + Math.min(...dayMinMax)+ symbol + '</p>';
                        dayMinMax=[];
                        forecastHtml += '</div>';
                        dayHtml = '';
                        headingCondition = true;
                        currentDay = day;
                    }

                    // for heading if first day is same as current day
                    if (currentDay == day && headingCondition) {
                        forecastHtml += '<h3 class="dayHeading">' + day + '</h3>'
                        forecastHtml += '<div class="forecast">';
                        headingCondition = false;
                    }
                    
                    // create html for each forecast dyanamically
                    dayHtml += '<div class="day">' +
                            '<h3>' + hour + ':' + minute + ':' + second + '</h3>' +
                            '<img src="' + iconUrl + '" />' +
                            '<div class="description">' + description + '</div>' +
                            '<div class="temp">' +
                            '<span class="high">' + temp_max + symbol + '</span>/<span class="low">' + temp_min + symbol + '</span>' +
                            '</div>' +
                            '</div>';
                    dayMinMax.push(temp_min);
                    dayMinMax.push(temp_max);
                }
                // for last day forecasts
                forecastHtml += dayHtml;
                forecastHtml += '<p>' + currentDay + ' Max Temprature ' + Math.max(...dayMinMax)+ symbol + ' Min Temprature ' + Math.min(...dayMinMax)+ symbol + '</p>';
                forecastHtml += '</div>';
                forecast_element.innerHTML = forecastHtml;

            });
}
