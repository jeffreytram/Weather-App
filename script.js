window.addEventListener('load', () => {
    let long;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            generateWeather(lat, long, -1)
        });
    }
    revealPastOptions(false);
    document.getElementById("inputSubmit").addEventListener('click', function () {
        generateWeather(lat, long, getUserDateInput());
    });
});

function generateWeather(lat, long, time) {
    let location = document.querySelector('.location');
    let statusReport = document.querySelector('.status');
    let temperatureReport = document.querySelector('.temperature');
    let humidityReport = document.querySelector('.humidity');
    let dewpoint = document.querySelector('.dewpoint');
    let moreInfoLink = document.querySelector('.link');

    let locationAPI = `https://nominatim.openstreetmap.org/search.php?q=${lat}%2C${long}&format=json`;
    //what if non US location
    //let locationAPI = `https://nominatim.openstreetmap.org/search.php?q=48.118219, 11.630618&format=json`;
    fetch(locationAPI)
        .then(response => {
            return response.json();
        })
        .then(details => {
            const { display_name } = details[0];
            location.textContent = display_name;
        });

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    let api;
    //time machine
    if (time != -1) {
        //api = `${proxy}https://api.darksky.net/forecast/e2a300014df353c32e5265bac28a1a7e/${lat},${long},${time}`;
        api = `${proxy}https://api.darksky.net/forecast/e2a300014df353c32e5265bac28a1a7e/${lat},${long},${time}`;
        moreInfoLink.href = ``;
    }
    else {
        //current
        api = `${proxy}https://api.darksky.net/forecast/e2a300014df353c32e5265bac28a1a7e/${lat},${long}`;
        moreInfoLink.href = `https://darksky.net/forecast/${lat},${long}/`;
    }

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const { summary, temperature, humidity, dewPoint, icon } = data.currently;

            statusReport.textContent = summary;
            temperatureReport.textContent = "temp: " + temperature;
            humidityReport.textContent = "humidity: " + humidity * 100 + "%";
            dewpoint.textContent = "dew point: " + dewPoint;

            setIcons(icon, document.querySelector('.icon'));

        });
}

function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "black" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}
function revealPastOptions(reveal) {
    options = document.getElementsByClassName("pastOptions");
    if (reveal) {
        options[0].style.display = "inline";
    }
    else {
        options[0].style.display = "none";
    }
}
function getUserDateInput() {
    let dateInput = document.getElementsByClassName("dateInput");
    let timeInput = document.getElementsByClassName("timeInput");

    let formattedTime = dateInput[0].value +"T"+timeInput[0].value+":00";

    //in minutes
    let offsetMin = dateInput[0].valueAsDate.getTimezoneOffset() //240
    let offsetHour = Math.abs(offsetMin/60); //4
    let offsetMod = Math.abs(offsetMin % 60);

    let sign = (offsetMin>0)?"-":"+";
    let hour = (offsetHour<10?"0"+offsetHour:offsetHour);
    let min = (offsetMod<10?"0"+offsetMod:offsetMod);

    formattedTime += sign+hour+min;
    //Thu Jun 20 2019 20:00:00 GMT-0400 (Eastern Daylight Time)
    //how to get offset
    //[YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]
    //let unixTime = (dateInput[0].valueAsNumber / 1000) + (timeInput[0].valueAsNumber / 1000);
    return formattedTime;
}
