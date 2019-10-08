window.addEventListener('load', () => {
    let long;
    let lat;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            
            generateWeather(lat, long, -1);
        });
    }
    revealPastOptions(false);
    document.getElementById("inputSubmit").addEventListener('click', function () {
        try{
            clearErrorMessage();
            generateWeather(lat, long, getUserDateInput());
        }
        catch{
            displayErrorMessage();
        }
    });
    document.getElementById("current").addEventListener('click', function () {
        generateWeather(lat, long, -1)
        revealPastOptions(false);
        setActive("current");
    });
    document.getElementById("past").addEventListener('click', function () {
        revealPastOptions(true);
        setActive("past")
    });
    function setActive(tabToSet) {
        let activeTab = document.getElementsByClassName("active");
        if (activeTab.length > 0) {
            activeTab[0].className = activeTab[0].className.replace(" active", "");
        }
        let newActiveTab = document.getElementById(tabToSet);
        newActiveTab.className += " active";
    }
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

        let inputDate = document.getElementsByClassName("dateInput");
        let formattedDate = inputDate[0].value;

        moreInfoLink.href = `https://darksky.net/details/${lat},${long}/${formattedDate}`;
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
            temperatureReport.textContent = "temp: " + Math.round(temperature) + "°F";
            humidityReport.textContent = "humidity: " + Math.round(humidity * 100) + "%";
            dewpoint.textContent = "dew point: " + Math.round(dewPoint) + "°F";

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

    let formattedTime = dateInput[0].value + "T" + timeInput[0].value + ":00";

    //in minutes
    let offsetMin = dateInput[0].valueAsDate.getTimezoneOffset() //240
    let offsetHour = Math.abs(offsetMin / 60); //4
    let offsetMod = Math.abs(offsetMin % 60);

    let sign = (offsetMin > 0) ? "-" : "+";
    let hour = (offsetHour < 10 ? "0" + offsetHour : offsetHour);
    let min = (offsetMod < 10 ? "0" + offsetMod : offsetMod);

    debugger;
    formattedTime += sign + hour + min;
    console.log(formattedTime);

    //Thu Jun 20 2019 20:00:00 GMT-0400 (Eastern Daylight Time)
    //[YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]
    //let unixTime = (dateInput[0].valueAsNumber / 1000) + (timeInput[0].valueAsNumber / 1000);
    return formattedTime;
}
function displayErrorMessage(){
    let errorDiv = document.getElementsByClassName("errorHandling");
    errorDiv[0].textContent = "Error: Incorrect date and/or time."
}
function clearErrorMessage(){
    let test = document.getElementsByClassName("errorHandling");
    test[0].textContent = "";
}
