/* Instantiate the object with raw data*/
countryObject = {
    countryName: "No Country known", //Replace with function to instantiate
    capitalName: "Capital City is unknown", //Replace with function to instantiate
    latitude: "Unknown latitude",
    longitude: "Unknown Longitude",
    currency: "Unknown currency",    
    weather : {
        Temperature: 0,
        Humidity: 0,
        Precipitation: 0
    }
};


//Requests location and updates the country Object
navigator.geolocation.getCurrentPosition(success, error, geoOptions);
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

function acquireCapitalJSON(countryName) {
    countryName = encodeURIComponent(countryObject.countryName);
    console.log(countryName);
    axios.get('')
    .then(function (response) {
        countryObject.capitalName = response.data[0];
    })
    .catch(function(error) {
        console.log(error);
    })
    .then(function() {
    //Once Finished    
    })
}
$(document).ready(function () {
//Updates the country list to choose from the countries.json
handleCountryJSON();
var mymap = L.map('mapid').setView([countryObject.latitude, countryObject.longitude], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);
});

//Trigger when a country is selected
$(document).on('click', 'a', function() {
    if(this.getAttribute("value") === "null") {
        console.log("Unable to find country value when clicked");
    }
    else {
            console.log(this.getAttribute("value"));
    acquireCapitalJSON("United Kingdom");
    }
})