window.addEventListener('load', () => {
    let long;
    let lat;
    // degree, humidity, dew point

    let location = document.querySelector('.location');
    let statusReport = document.querySelector('.status');
    let temperatureReport = document.querySelector('.temperature');
    let humidityReport = document.querySelector('.humidity');
    let dewpoint = document.querySelector('.dewpoint');
    let moreInfoLink = document.querySelector('.link');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;

            moreInfoLink.href = `https://darksky.net/forecast/${lat},${long}/`;

            let locationAPI = `https://nominatim.openstreetmap.org/search.php?q=${lat}%2C${long}&format=json`;
            //what if non US location
            //let locationAPI = `https://nominatim.openstreetmap.org/search.php?q=48.118219, 11.630618&format=json`;
            fetch(locationAPI)
                .then(response => {
                    return response.json();
                })
                .then(details => {
                    console.log(details);
                    const { display_name } = details[0];
                    location.textContent = display_name;

                })

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/e2a300014df353c32e5265bac28a1a7e/${lat},${long}`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const { summary, temperature, humidity, dewPoint, icon } = data.currently;

                    statusReport.textContent = summary;
                    temperatureReport.textContent = "temp: " + temperature;
                    humidityReport.textContent = "humidity: " + humidity*100 +"%";
                    dewpoint.textContent = "dew point: " + dewPoint;

                    setIcons(icon, document.querySelector('.icon'));

                })
        });
    }
    else {
        statusReport.textContent = "pls enable location";
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "black" });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});