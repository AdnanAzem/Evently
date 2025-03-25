
require('dotenv').config();
const axios = require('axios');


// Fetch weather data from OpenWeatherMap API
const fetchWeatherData = async (city) => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric', // Use metric units for temperature in Celsius
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch activity suggestions from Foursquare API
const fetchActivitySuggestions = async (location) => {
    try {
        const response = await axios.get('https://api.foursquare.com/v3/places/search', {
            headers: {
                Authorization: process.env.FOURSQUARE_API_KEY,
            },
            params: {
                near: location, // Search near this location
                limit: 5,       // Limit results to 5 activities
            },
        });
        return response.data.results; // Return the list of places
    } catch (error) {
        throw error;
    }
};



module.exports = { fetchWeatherData, fetchActivitySuggestions };
