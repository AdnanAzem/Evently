const pool = require('../config/db');

// Helper function to parse the malformed activities string
const parseActivities = (activitiesString) => {
    console.log('Input activitiesString:', activitiesString); // Debugging log
    console.log('Type of activitiesString:', typeof activitiesString); // Debugging log

    if (!activitiesString) return []; // Return an empty array if activitiesString is null or undefined

    // Ensure activitiesString is a string before processing
    if (typeof activitiesString !== 'string') {
        console.error('Invalid activitiesString type:', typeof activitiesString);
        return [];
    }

    // Example input: "{\"(1,1,\\\"Baha'i Gardens (הגנים הבהאים)\\\",\\\"No description available\\\",\\\"45 Yefe Nof St\\\")\",\"(2,1,...)}\"
    const activitiesArray = activitiesString
        .replace(/^\{|\}$/g, '') // Remove the outer curly braces
        .split(',') // Split by commas to separate individual activities
        .map(activity => {
            // Extract the fields from the activity string
            const match = activity.match(/\((\d+),(\d+),"([^"]+)","([^"]+)","([^"]+)"\)/);
            if (!match) return null; // Skip invalid activity strings

            const [, id, planId, name, description, location] = match;
            return { id, planId, name, description, location };
        })
        .filter(Boolean); // Filter out any null values

    return activitiesArray;
};

// Save a new travel plan
const saveTravelPlan = async (userId, destination, startDate, endDate, weatherData, activities) => {
    try {
        // Insert the travel plan into the database
        const planQuery = `
            INSERT INTO travel_plans (user_id, destination, start_date, end_date, weather_data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;
        const planValues = [userId, destination, startDate, endDate, weatherData];
        const planResult = await pool.query(planQuery, planValues);
        const planId = planResult.rows[0].id;

        // Insert associated activities into the database
        for (const activity of activities) {
            const activityQuery = `
                INSERT INTO activities (plan_id, name, description, location)
                VALUES ($1, $2, $3, $4)
            `;
            const activityValues = [
                planId,
                activity.name,
                activity.description || 'No description available',
                activity.location?.address || 'Location not provided',
            ];
            await pool.query(activityQuery, activityValues);
        }

        return { id: planId, destination, startDate, endDate, weatherData, activities };
    } catch (error) {
        throw error;
    }
};

// Get all travel plans for a user
// Get all travel plans for a user
// Get all travel plans for a user
const getTravelPlansByUser = async (userId) => {
    try {
        const query = `
            SELECT *
            FROM travel_plans
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [userId]);

        // Transform the fetched data
        return result.rows.map(plan => {
            let activities = plan.activities;

            // If activities is a string, parse it
            if (typeof activities === 'string') {
                activities = parseActivities(activities);
            }
            // If activities is already an array, use it directly
            else if (Array.isArray(activities)) {
                activities = activities;
            }
            // If activities is invalid, default to an empty array
            else {
                activities = [];
            }

            return {
                ...plan,
                activities,
            };
        });
    } catch (error) {
        throw error;
    }
};

module.exports = { saveTravelPlan, getTravelPlansByUser };