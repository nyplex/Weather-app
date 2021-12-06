/*To Do

-Get client's IP
-Use IP to get locatation and current/forecast weather 
-Save the data (F/C) in a new object 
-Fill up "search" input with the IP's location
-Display the data 

-When user click on F||C display the data from the object 

-When user type in the "search" input fetch the SEARCH WEATHER API
-When the user click on a <li> => fill up the "search" input with the name of the <li>
and fetch the weather API using the name of the <li> as the location 
-Save the data (F/C) in a new object 
-Display the data

*https://royfloresnyc.medium.com/how-to-render-photos-of-any-city-in-the-world-in-your-app-740325fa6ff5

*/
/////////////// Theme switcher function ///////////////

$("#theme-switcher").on("change", () => {
    $("#body").toggleClass("dark-theme")
})

/////////////// Get user's IP ///////////////

$(document).ready(() => {
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        const ip = data.ip
    })
})

/////////////// Weather App Functions ///////////////

const currentWeather = {
    date: null,
    time: null,
    condition: null,
    icon: null,
    rain: null,
    temp: null,
    feelsLike: null
}

const forecast = []

let getForecast = (query) => {
    query.forEach(day => {
        console.log(day);
        forecast.push({
            date: day.date,
            icon: day.day.condition.code,
            minTemp: day.day.mintemp_c,
            maxTemp: day.day.maxtemp_c
        })
    })
    console.log(forecast);
}

let getData = (query) => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=d38951f8c912461b9b0113400210512&q=${query}&days=6&aqi=yes&alerts=no`)
    .then(response => response.json())
    .then(data => {
        currentWeather.condition = data.current.condition.text
        getForecast(data.forecast.forecastday)
        //console.log(data);
    })
}

$("#location-input").on("input", (e) => {
    const {value} = e.target
    $("#location-list").html("")
    if(value.length >= 3) {
        $("#location-container").css("display", "block")
        fetch(`http://api.weatherapi.com/v1/search.json?key=d38951f8c912461b9b0113400210512&q=${value}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(city => {
                $("#location-list").append(`<li>${city.name}</li>`)
            })
        });
    }else{
        $("#location-container").css("display", "none")
    }
})

$("#location-list").click((e) => {
    if($(e.target).is("li")) {
        const value = $(e.target).text()
        $("#location-input").val(value)
        $("#location-list").html("")
        $("#location-container").css("display", "none")
        getData(value)
    }
    return
})

