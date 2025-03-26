
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

 const getActivitiesForCity = async (city) => {
    try {
        const response = await fetch(`https://api.foursquare.com/v3/places/search?near=${city}&limit=5`, {
            method: 'GET',
            headers: {
                Authorization: process.env.FOURSQUARE_API_KEY,
            },
        });

        const data = await response.json();
        console.log('Foursquare API response:', data); // Debugging log

        return data.results.map(place => ({
            name: place.name,
            description: place.description || 'No description available', // Default value if description is missing
            location: place.location,
        }));
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch activities');
    }
};



module.exports = { fetchWeatherData, fetchActivitySuggestions , getActivitiesForCity};
