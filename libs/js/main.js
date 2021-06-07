/* Instantiate the object with raw data*/
countryObject = {
    countryName: "No Country known", //Replace with function to instantiate
    capitalName: "Capital City is unknown", //Replace with function to instantiate
    isoCode: "",
    latitude: "Unknown latitude",
    longitude: "Unknown Longitude",
    population: 0,
    currencyName: "Unknown currency name",  
    currencyCode: "Unknown Currency Code",
    currencyValue: 1,
    baseCurrencyValue: 1,
    baseCurrencyCode: "GBP", 
    weather : {
        temperature: 0,
        humidity: 0,
        pressure: 0
    },
    timezone: "Unknown timezone",

};

//Instantiates the World Map
var worldMap;

//Requests location and updates the country Object
if(!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
} else {
navigator.geolocation.getCurrentPosition(success, error, geoOptions);
};
/* Configuration Options for GeoLocation */
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};

function success(pos) {
    countryObject.latitude = pos.coords.latitude;
    countryObject.longitude = pos.coords.longitude;
}

function error() {
    console.log("Failed to get geolocation from device");
}

//Populates the list of countries
function handleCountryJSON() {
axios.get('https://michaelsnow.xyz/project1/libs/js/countryBorders.json')
.then(function (response) {
    //[Handle Success]
    $.each(response.data.features, function(i, item) {
        
        let listEntry = "<li><a class='dropdown-item' value = '"+response.data.features[i].properties.name+"' id = '"+response.data.features[i].properties.name+"'>"+response.data.features[i].properties.name+"</a><li>";
        $("#dropdownList").append(listEntry);
    }) 


})
.catch(function(error) {
    //[Handle errors]
    console.log(error);
})
.then(function() {
    //[Completion Code]
});
}

function loadCountryData(countryName) {
    countryNameEnc = encodeURIComponent(countryName);
    axios.get('https://restcountries.eu/rest/v2/name/'+countryNameEnc)
    .then(function (response) {
        countryObject.capitalName = response.data[0].capital;
        countryObject.latitude = response.data[0].latlng[0];
        countryObject.longitude = response.data[0].latlng[1];
        countryObject.currencyName = response.data[0].currencies[0].name;
        countryObject.currencyCode = response.data[0].currencies[0].code;
        console.log(countryObject.currencyCode);
        countryObject.population = response.data[0].population;
        countryObject.timezone = response.data[0].timezones[0];
        countryObject.iso2 = response.data[0].alpha2Code;
    })
    .catch(function(error) {
        console.log(error);
    })
    .then(function() {
        $('#countryNameModal').html(' Country Name:  '+countryObject.countryName);
        $('#capitalModal').html(' Capital:  '+countryObject.capitalName);
        $('#latitudeModal').html(' Rough Latitude:  '+countryObject.latitude);
        $('#longitudeModal').html(' Rough Longitude:  '+countryObject.longitude);
        $('#populationModal').html(' Population:  '+countryObject.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $('#currencyNameModal').html(' Currency:  '+countryObject.currencyName+' ('+countryObject.currencyCode+')')
        $('#timezoneModal').html(' Time Zone:  '+countryObject.timezone);  
    });
    axios.get('https://api.openweathermap.org/data/2.5/weather?units=metric&lat='+countryObject.latitude+'&lon='+countryObject.longitude+'&appid=442d9c285ccba223632883d70318b93c')
    .then(function (response) {
        countryObject.weather.Temperature = response.data.main.feels_like;
        countryObject.weather.humidity = response.data.main.humidity;
        countryObject.weather.pressure = response.data.main.pressure;
        })
    .catch(function(error) {
        console.log(error);
    })
    .then(function() {
        $('#temperatureModal').html(' Temperature:  '+countryObject.weather.Temperature+' &#8451;');
        $('#humidityModal').html(' Humiditity:  '+countryObject.weather.humidity+'%')
        $('#pressureModal').html(' Pressure:  '+countryObject.weather.pressure+'Mb');  

    });
    axios.get('https://michaelsnow.xyz/project1/libs/js/countryBorders.json')
    .then(function(response) {
        console.log(response.data.features[0]);
        //each() {}
        L.geoJSON(response.data.features[0].geometry.coordinates, {
            style: function (feature) {
                return {
                    fillColor: "#FFFFFF"
                    color: "#000000"
                };
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.description;
        }).addTo(worldMap);
    }
    )};
$(document).ready(function () {
//Updates the country list to choose from the countries.json
handleCountryJSON();
try {
    worldMap = L.map('mapid').setView([countryObject.latitude, countryObject.longitude], 13)
}
catch(err) {
    console.log(err);
}


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 14,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1
}).addTo(worldMap);
});

//Trigger when a country is selected
$(document).on('click', '.dropdown-item', function() {
    if(this.getAttribute("value") == "null") {
        console.log("Unable to find country value when clicked");
    }
    else {
            $('#navbarDarkDropdownMenuLink').html(this.getAttribute("value"));
            countryObject.countryName = this.getAttribute("value");
            loadCountryData(this.getAttribute("value"));
            setTimeout(() => {
                worldMap.flyTo([countryObject.latitude, countryObject.longitude], 6);
            }, 600);
            
            //(Configure the model with the new data)
            $('#ModalCenter').modal('show');
    }
})