/*To Do

-////Get client's IP
-///Use IP to get locatation and current/forecast weather 
-(((Save the data (F/C) in a new object))) 
-///Fill up "search" input with the IP's location
-Get the city's image 
-Display the data 

-When user click on F||C display the data from the object 

-///When user type in the "search" input fetch the SEARCH WEATHER API
-///When the user click on a <li> => fill up the "search" input with the name of the <li>
-Fetch the weather API using the name of the <li> as the location 
-Save the data (F/C) in a new object 
-Get the city's image
-Display the data

*https://royfloresnyc.medium.com/how-to-render-photos-of-any-city-in-the-world-in-your-app-740325fa6ff5

*/

const mediaPath = "assets/media/weather-icons/"
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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

let getDay = (date) => {
    const currentTime = new Date(date)
    return weekDays[currentTime.getDay()]
}

let getTime = (date) => {
    const currentTime = new Date(date)
    return `${currentTime.getHours()}:${currentTime.getMinutes()}`
}

let displayData = (data) => {
    $("#current-day").html("<strong>" + getDay(data.location.localtime) + ", </strong>" +  getTime(data.location.localtime))
    $("#current-temp").html(`${data.current.temp_c}<span>&#8451;</span>`)
    if(data.current.is_day) {
        $("#current-icon").attr("src", mediaPath + "day/" + data.current.condition.code + ".png")
    }else{
        $("#current-icon").attr("src", mediaPath + "night/" + data.current.condition.code + ".png")
    }
    
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

