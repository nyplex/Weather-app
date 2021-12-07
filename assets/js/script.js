/*To Do

-When user click on F||C display correct data
-Get the city's image
-Display the data

*https://royfloresnyc.medium.com/how-to-render-photos-of-any-city-in-the-world-in-your-app-740325fa6ff5

*/

const mediaPath = "assets/media/weather-icons/"
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const forecastContainer = [$("#forecast-1"), $("#forecast-2")]

/////////////// Theme switcher function ///////////////

$("#theme-switcher").on("change", () => {
    $("#body").toggleClass("dark-theme")
})

/////////////// Get user's IP ///////////////

$(document).ready(() => {
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        getData(data.ip)
    })
})

/////////////// Weather App Functions ///////////////
let fillInput = (value) => {
    $("#location-input").val(value)
}


function displayLocalDate() {
    const today = new Date();
    let d = weekDays[today.getDay()]
    let h = today.getHours();
    let m = today.getMinutes();
    m = m < 10 ? "0" + m : m
    document.getElementById('current-day').innerHTML = d + ", " + h + ":" + m;
    setTimeout(displayLocalDate, 5000);
  }

let displayData = (data) => {
    displayLocalDate()
    $("#current-temp").html(`${data.current.temp_c}<span>&#8451;</span>`)
    $("#feelsLike").html("Feels Like " + data.current.feelslike_c + "&#8451;")
    $("#cloudy").html("Clouds " + data.current.cloud + "%")
    $("#uv-index").text(data.current.uv)
    $("#wind-speed").html(data.current.wind_kph + "<span>km/h</span>")
    $("#sunrise-time").html(data.forecast.forecastday[0].astro.sunrise)
    $("#sunset-time").html(data.forecast.forecastday[0].astro.sunset)
    $("#humidity-level").text(data.current.humidity + "%")
    displayForecast(data.forecast.forecastday)
    if(data.current.is_day) {
        $("#current-icon").attr("src", mediaPath + "day/" + data.current.condition.code + ".png")
    }else{
        $("#current-icon").attr("src", mediaPath + "night/" + data.current.condition.code + ".png")
    }
    
}

let displayForecast = (data) => {
    const forecast = [data[1], data[2]]
    forecastContainer.forEach((val, index) => {
        const date = new Date(forecast[index].date)
        const day = weekDays[date.getDay()] 
        $(val[0]).children('h6').text(day)
        $(val[0]).children('img').attr('src', mediaPath + "day/" + forecast[index].day.condition.code + ".png")
        $(val[0]).children('p').html(`${forecast[index].day.maxtemp_c}&#xb0; &nbsp;&nbsp;&nbsp;&nbsp;${forecast[index].day.mintemp_c}&#xb0;`)
    })
}

let getData = (query) => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=d38951f8c912461b9b0113400210512&q=${query}&days=6&aqi=yes&alerts=no`)
    .then(response => response.json())
    .then(data => {
        fillInput(data.location.name)
        displayData(data)
        console.log(data);
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
        fillInput(value)
        $("#location-list").html("")
        $("#location-container").css("display", "none")
        getData(value)
    }
    return
})

