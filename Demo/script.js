window.addEventListener('load', ()=>{
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree= document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature');
    const temperatureSpan = document.querySelector('.temperature span');

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/e2a300014df353c32e5265bac28a1a7e/${lat},${long}`;
            
            fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data =>{
                console.log(data);
                const {temperature, summary, icon} = data.currently;

                temperatureDescription.textContent = summary;
                temperatureDegree.textContent = temperature;
                locationTimezone.textContent = data.timezone;

                setIcons(icon, document.querySelector('.icon'));

                let celsius = (temperature - 32)*(5/9);

                //toggle temp in celsius
                temperatureSection.addEventListener('click', () =>{
                    if(temperatureSpan.textContent === "F"){
                        temperatureSpan.textContent = "C";
                        temperatureDegree.textContent = Math.floor(celsius);
                    }
                    else{
                        temperatureSpan.textContent = "F";
                        temperatureDegree.textContent = temperature;
                    }
                })
            })
        });
    }
    else{
        h1.textContent ="pls enable location";
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});