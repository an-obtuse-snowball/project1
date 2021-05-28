/* Instantiate the object with raw data*/
countryObject = {
    countryName: "No Country known", //Replace with function to instantiate
    capitalName: "Capital City is unknown", //Replace with function to instantiate
    latitude: "Unknown latitude",
    longitude: "Unknown Longitude",
    population: 0,
    currencyName: "Unknown currency name",  
    baseCurrencyValue: 0, 
    weather : {
        Temperature: 0,
        Humidity: 0,
        Precipitation: 0
    },
    timezone: "Unknown timezone",

};

//Instantiates the World Map
var worldMap;

//Requests location and updates the country Object
if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
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
    $('model').append("Location");
}

function error() {
    console.log("Failed to get geolocation from device");
    $('model').append("<p> Failed to acquire the current coordinates</p>");
}

//Populates the list of countries
function handleCountryJSON() {
axios.get('https://restcountries.eu/rest/v2/all?fields=name')
.then(function (response) {
    //[Handle Success]
    $.each(response.data, function(i, item) {
        let listEntry = "<li><a class='dropdown-item' value = '"+response.data[i].name+"' id = '"+response.data[i].name+"'>"+response.data[i].name+"</a><li>";
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
        countryObject.population = response.data[0].population;
        countryObject.timezone = response.data[0].timezones[0];
        console.log(countryObject);
    })
    .catch(function(error) {
        console.log(error);
    })
    .then(function() {
        $('#countryNameModal').html('Country Name: '+countryObject.countryName);
        $('#capitalModal').html('Capital: '+countryObject.capitalName);
        $('#latitudeModal').html('Rough Latitude: '+countryObject.latitude);
        $('#longitudeModal').html('Rough Longitude: '+countryObject.longitude);
        $('#populationModal').html('Population: '+countryObject.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        $('#currencyNameModal').html('Currency: '+countryObject.currencyName);
        $('#timezoneModal').html('Time Zone: '+countryObject.timezone);  
    })
}

$(document).ready(function () {
//Updates the country list to choose from the countries.json
handleCountryJSON();
worldMap = L.map('mapid').setView([countryObject.latitude, countryObject.longitude], 13)

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