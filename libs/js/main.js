function setCountryState() {

        //Use the API to initialise these to current location. 
       var countryObject = {
            countryName: "United Kingdom",
            capitalName: "London",
            latitude: -41.2,     //These are the 
            longitude: 26.1,    //two main deliminators for determining the rest of the data.
            currency: "GBP",
            weather : {
                Temperature: 14.2,
                Humidity: 56,
                Precipitation: 82
            }
        }
return countryObject;
    };
console.log(setCountryState());




