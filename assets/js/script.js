const userIP = {
    ip: null
}
/////////////// Theme switcher function ///////////////

$("#theme-switcher").on("change", () => {
    $("#body").toggleClass("dark-theme")
})

/////////////// Get user's IP ///////////////

$(document).ready(() => {
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        userIP.ip = data.ip
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

