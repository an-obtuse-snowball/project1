/* Instantiate the object with raw data*/
countryObject = {
    countryName: "No Country known", //Replace with function to instantiate
    capitalName: "Capital City is unknown", //Replace with function to instantiate
    isoCode: "??",
    latitude: "Unknown latitude",
    longitude: "Unknown Longitude",
    population: 0,
    currencyName: "Unknown currency name",
    currencyCode: "Unknown Currency Code",
    currencyValue: 1,
    baseCurrencyValue: 1,
    baseCurrencyCode: "GBP",
    weather: {
        temperature: 0,
        humidity: 0,
        pressure: 0
    },
    timezone: [],

};

user = {
    latitude: "",
    longitude: "",
}

var countryCode = "";

//Instantiates the World Map
var worldMap;
//Globally declares current or initial geoJSON feature collection
var currentFeature;

//Requests location and updates the country Object
if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
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
    countryObject.latitude, user.latitude = pos.coords.latitude;
    countryObject.longitude, user.longitude = pos.coords.longitude;
}

function error() {
    console.log("Failed to get geolocation from device");
}
//Functions for acquiring data
function getIsoFromCoords(lat, long) {
    $.ajax({
        url: "./libs/php/getISOCode.php",
        type: "get",
        data: {
            lat: lat,
            lng: long,
        },
        success: function(response) {
            countryCode = response.data.countryCode;

            loadCountryDataFromISO(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    });
    //return isoCode
}
//Populates the list of countries
function handleCountryJSON() {
    $.ajax({
        url: "./libs/php/getCountryListings.php",
        type: "get",
        dataType: "json",
        success: function(response) {
            //[Handle Success]
            var countryList = [];
            $.each(response.data.features, function(i, item) {

                var country = {
                    countryCode: response.data.features[i].properties.iso_a2,
                    countryName: response.data.features[i].properties.name
                };
                countryList.push(country);
            });
            countryList.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

            $.each(countryList, function(i, item) {
                let listEntry = "<option class='dropdown-item' value = '" + countryList[i].countryCode + "' id = '" + countryList[i].countryName + "'>" + countryList[i].countryName + "</option>";
                $("#dropdownList").append(listEntry);
            })

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //[Handle errors]
            console.log(error, jqXHR, textStatus, errrorThrown);
        }
    })
}

//Loads data from restCountries, countryborders and WeatherMaps APIs
function loadCountryDataFromISO(isoCode) {

    $.ajax({
        url: './libs/php/getCountryData.php',
        type: "get",
        dataType: "json",
        data: {
            countryISO: isoCode,
        },
        success: function(response) {
            countryObject.countryName = response.data.name;
            countryObject.capitalName = response.data.capital;
            countryObject.latitude = response.data.latlng[0];
            countryObject.longitude = response.data.latlng[1];
            countryObject.currencyName = response.data.currencies[0].name;
            countryObject.currencyCode = response.data.currencies[0].code;
            countryObject.population = response.data.population;
            countryObject.timezone = response.data.timezones;

            countryObject.isoCode = response.data.alpha2Code;
            $('#ModalLongTitle').html(countryObject.countryName);
            $('#populationModal').html(response.data.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $('#currencyNameModal').html(countryObject.currencyName + ' (' + countryObject.currencyCode + ')')
            $('#timezoneModal').html(countryObject.timezone[0] + " to " + response.data.timezones[countryObject.timezone.length - 1]);
            $('#capitalModal').html(countryObject.capitalName + ", " + isoCode);
            $('#coordinatesModal').html(countryObject.latitude + " Latitude, " + countryObject.longitude + " Longitude");
            $('#languageModal').html(response.data.languages[0].name);



            callWeather(countryObject.latitude, countryObject.longitude);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })

    $.ajax({
        //Pulls the list of borders, loops and filters through the JSON to find the same country with a matching ISO Code
        url: './libs/php/getSpecificCountry.php',
        type: 'get',
        dataType: 'json',
        data: {
            iso: isoCode
        },

        success: function(response) {
            if (currentFeature) {
                currentFeature.clearLayers();
            }

            //currentFeature.clearLayers();
            currentFeature = L.geoJSON(response.data, {
                style: function(feature) {
                    return {
                        color: "#BCBCBC",
                        opacity: 1,

                    };
                }
            }).bindPopup(function(layer) {
                return layer.feature.properties.description;
            }).addTo(worldMap)
            worldMap.fitBounds(currentFeature.getBounds())

        },
        error: function(jqXHR, textStatus, errorThrown) {
            //[Handle errors]
            console.log(error, jqXHR, textStatus, errorThrown);
        }
    })
};

function callWeather(wLatitude, wLongitude) {
    $.ajax({
        url: './libs/php/getForecast.php',
        type: 'get',
        dataType: 'json',
        data: {
            lat: wLatitude,
            lon: wLongitude,
        },
        success: function(response) {
            var url = 'http://openweathermap.org/img/wn/' + response.data.current.weather[0].icon + '@2x.png';
            console.log(url);
            $('#weatherTitle').html("Today's Weather");
            $('#weatherIcon').html('<img src="'+url+'" />');
            $('#weatherDescription').append(response.data.current.weather[0].main+"/"+response.data.current.weather[0].description);
            $('#temperatureModal').html(response.data.daily[0].temp.min + ' &#8451;<br>'+response.data.daily[0].temp.max+' &#8451;');
            $('#humidityModal').html('<i class="bi bi-droplet"></i> '+response.data.current.humidity + '% Humidity')
            $('#pressureModal').html('<i class="bi bi-arrows-collapse"></i> '+response.data.current.pressure + 'Mb');
            $('#windModal').html('<i class="bi bi-wind"></i> '+response.data.current.wind_speed + 'Mph');

            //Loads the Forecast Data
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var d = new Date();
            dayName = days[d.getDay()];
            dayNameTomorrow = days[d.getDay()+1];
            dayNameNextDay = days[d.getDay()+2];
            $('#currentDay').html(dayName+ " "+(d.getDate()));
            $('#tomorrow').html(dayNameTomorrow+ " "+(d.getDate()+1));
            $('#nextDay').html(dayNameNextDay+ " "+(d.getDate()+2));

            $('#currentTemperature').html('<b>'+response.data.daily[1].temp.max + ' &#8451;</b><br>'+response.data.daily[1].temp.min+' &#8451;');
            $('#tomorrowsTemperature').html('<b>'+response.data.daily[2].temp.max + ' &#8451;</b><br>'+response.data.daily[2].temp.min+' &#8451;');
            $('#nextDayTemperature').html('<b>'+response.data.daily[3].temp.max + '  &#8451;</b><br>'+response.data.daily[3].temp.min+' &#8451;');

            
            //Pulls up the modal once all data has finally finished
            $('#ModalCenter').modal('show');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(error, jqXHR, textStatus, errorThrown);
        }
    })
}
//Trigger when a country is selected
/* Needs to be reconfigured to work for options
$(document).on('change', '#dropdown-item', function() {
    if (this.getAttribute("value") == "null") {
        console.log("Unable to find country value when clicked");
    } else {
        $('#navbarDarkDropdownMenuLink').html(this.getAttribute("id"));
        countryObject.isoCode = this.getAttribute("value");
        loadCountryDataFromISO(countryObject.isoCode);


        //(Configure the model with the new data)
        $('#ModalCenter').modal('show');
    }
})
*/

$(document).ready(function() {

    //Updates the country list to choose from the countries.json
    handleCountryJSON();
    //Acquire data on
    getIsoFromCoords(user.latitude, user.longitude);
    try {
        worldMap = L.map('mapid').setView([user.latitude, user.longitude], 5)
    } catch (err) {
        console.log("oops");
    }



    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 14,
        setView: true,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(worldMap);
});