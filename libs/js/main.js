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
    $.ajax({
        url: "./libs/js/getCountryList.php",
        type: 'POST',
        dataType: "json",
        data,

        success: function(result) {
            console.log("Ajax request success");
            console.log(JSON.stringify(result));
            if(result.status.name == "ok") {
                console.log(result);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log (errorThrown);
        }
    });

    console.log(data);




};
//Requests location and updates the country Object
navigator.geolocation.getCurrentPosition(success, error, geoOptions);

//Updates the country list to choose from the countries.json
handleCountryJSON();


