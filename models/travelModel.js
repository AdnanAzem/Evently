const pool = require('../config/db');

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
const getTravelPlansByUser = async (userId) => {
    try {
        const query = `
            SELECT tp.*, array_agg(a.*) AS activities
            FROM travel_plans tp
            LEFT JOIN activities a ON tp.id = a.plan_id
            WHERE tp.user_id = $1
            GROUP BY tp.id
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = { saveTravelPlan, getTravelPlansByUser };