
const mediaPath = "assets/media/weather-icons/"
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const forecastContainer = [$("#forecast-1"), $("#forecast-2")]
let celcius = true
let weatherData

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


/////////////// Far/Celcius swither ///////////////

$(".degree-swticher").click((e)=>{
    const {id} = e.target
    if(id === "celcius") {
        celcius = true
        $("#celcius").addClass("activate")
        $("#far").removeClass("activate")
    }else{
        $("#celcius").removeClass("activate")
        $("#far").addClass("activate")
        celcius = false
    }
    displayData(weatherData)
})


/////////////// Weather App Functions ///////////////

let fillInput = (value) => {
    $("#location-input").val(value)
    $("#city-name").text(value)
    getPic(value)
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
    if(celcius) {
        $("#current-temp").html(`${data.current.temp_c}<span>&#8451;</span>`)
        $("#feelsLike").html("Feels Like " + data.current.feelslike_c + "&#8451;")
        $("#wind-speed").html(data.current.wind_kph + "<span>km/h</span>")
        $("#visibility-level").html(data.current.vis_km + "<span> Km</span>")
    }else{
        $("#current-temp").html(`${data.current.temp_f}<span>&#x2109;</span>`)
        $("#feelsLike").html("Feels Like " + data.current.feelslike_f + "&#x2109;")
        $("#wind-speed").html(data.current.wind_mph + "<span>Mph</span>")
        $("#visibility-level").html(data.current.vis_miles + "<span> Miles</span>")
    }
    
    $("#cloudy").html("Clouds " + data.current.cloud + "%")
    $("#uv-index").text(data.current.uv)
    $("#sunrise-time").html(data.forecast.forecastday[0].astro.sunrise)
    $("#sunset-time").html(data.forecast.forecastday[0].astro.sunset)
    $("#humidity-level").text(data.current.humidity + "%")
    displayForecast(data.forecast.forecastday)
    if (data.current.is_day) {
        $("#current-icon").attr("src", mediaPath + "day/" + data.current.condition.code + ".png")
    } else {
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
        if(celcius) {
            $(val[0]).children('p').html(`${forecast[index].day.maxtemp_c}&#8451; &nbsp;&nbsp;&nbsp;&nbsp;${forecast[index].day.mintemp_c}&#8451;`)
        }else{
            $(val[0]).children('p').html(`${forecast[index].day.maxtemp_f}&#x2109; &nbsp;&nbsp;&nbsp;&nbsp;${forecast[index].day.mintemp_f}&#x2109;`)
        }
        
    })
}



let getData = (query) => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=d38951f8c912461b9b0113400210512&q=${query}&days=6&aqi=yes&alerts=no`)
        .then(response => response.json())
        .then(data => {
            weatherData = data
            fillInput(data.location.name)
            displayData(weatherData)
        })
}


$("#location-input").on("input", (e) => {
    const {
        value
    } = e.target
    $("#location-list").html("")
    if (value.length >= 3) {
        $("#location-container").css("display", "block")
        fetch(`http://api.weatherapi.com/v1/search.json?key=d38951f8c912461b9b0113400210512&q=${value}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(city => {
                    $("#location-list").append(`<li>${city.name}</li>`)
                })
            });
    } else {
        $("#location-container").css("display", "none")
    }
})

$("#location-list").click((e) => {
    if ($(e.target).is("li")) {
        const value = $(e.target).text()
        fillInput(value)
        $("#location-list").html("")
        $("#location-container").css("display", "none")
        getData(value)
    }
    return
})




let getPic = (query) => {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&key=AIzaSyCRXAo17cwIDixQEO71iausNIfwaPP2ov8&inputtype=textquery&fields=name,photos`
    fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            displayPic(data.candidates[0].photos[0].photo_reference)
        })
        .catch(e => {
            console.log(e);
            return e;
        });
}


let displayPic = (ref) => {
    $("#city-pic").attr("src", `https://maps.googleapis.com/maps/api/place/photo?photoreference=${ref}&key=AIzaSyCRXAo17cwIDixQEO71iausNIfwaPP2ov8&maxwidth=400&maxheight=400`)

}
