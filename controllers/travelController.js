const pool = require('../config/db');
const { fetchWeatherData, fetchActivitySuggestions, getActivitiesForCity } = require('../utils/apiHelper');

const { saveTravelPlan, getTravelPlansByUser } = require('../models/travelModel');

// Search for a destination and fetch weather/activity data
const searchDestination = async (req, res) => {
    try {
        const { city } = req.body;

        // Fetch weather data
        const weatherData = await fetchWeatherData(city);

        // Fetch activity suggestions
        const activities = await getActivitiesForCity(city);

        res.status(200).json({
            message: 'Destination data fetched successfully',
            weather: weatherData,
            activities: activities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Save a travel plan
const saveTravelPlanHandler = async (req, res) => {
    try {
        const { destination, startDate, endDate, weatherData, activities } = req.body;
        const userId = req.user.userId; // Extract userId from the JWT token

        // console.log('Saving plan for userId:', userId); // Debugging log

        // Save the travel plan
        const planQuery = `
            INSERT INTO travel_plans (user_id, destination, start_date, end_date, weather_data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const planValues = [userId, destination, startDate, endDate, weatherData];
        const planResult = await pool.query(planQuery, planValues);
        const planId = planResult.rows[0].id;

        // console.log('Inserted planId:', planId); // Debugging log

        // Save associated activities
        if (Array.isArray(activities) && activities.length > 0) {
            for (const activity of activities) {
                const activityQuery = `
                    INSERT INTO activities (plan_id, name, description, location)
                    VALUES ($1, $2, $3, $4)
                `;
                const activityValues = [
                    planId,
                    activity.name,
                    activity.description || 'No description available', // Default value if description is missing
                    activity.location?.address || 'Location not provided',
                ];
                await pool.query(activityQuery, activityValues);
            }
        }

        res.status(201).json({
            message: 'Travel plan saved successfully',
            plan: { id: planId, destination, startDate, endDate, weatherData, activities },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all travel plans for a user
const getTravelPlansHandler = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch travel plans
        const plans = await getTravelPlansByUser(userId);

        // Ensure plans always include an empty activities array if none exist
        const formattedPlans = plans.map(plan => ({
            ...plan,
            activities: plan.activities || [],
        }));

        res.status(200).json({
            message: 'Travel plans fetched successfully',
            plans: formattedPlans,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { searchDestination, saveTravelPlanHandler, getTravelPlansHandler };


// module.exports = { searchDestination, saveTravelPlan };