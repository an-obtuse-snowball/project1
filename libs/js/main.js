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

countries = {};

/* Configuration Options for GeoLocation */
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};

function success(pos) {
    countryObject.latitude = pos.coords.latitude;
    countryObject.longitude = pos.coords.longitude;
    console.log("Successfully acquired device location, updating current data to object.")
    console.log("Current Longitude: "+countryObject.latitude);
    console.log("Current Latitude: "+countryObject.latitude);
}

function error() {
    console.log("Failed to get geolocation from device");
}

function handleCountryJSON() {
axios.get('https://restcountries.eu/rest/v2/all?fields=name')
.then(function (response) {
    //Handle Success
var data = JSON.parse(response);
$.each(data, function(key, item) {
    console.log(item);
})
})
.catch(function(error) {
    //handle errors
    console.log(error);
})
.then(function() {
    console.log("Axios Request - handleCountryJSON: Completed");
});
}
$(document).ready(function () {
//Requests location and updates the country Object
navigator.geolocation.getCurrentPosition(success, error, geoOptions);

//Updates the country list to choose from the countries.json
handleCountryJSON();
});