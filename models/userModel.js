const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Register a new user
const createUser = async (username, email, password) => {
    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into the database
        const query = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Find a user by email
const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

module.exports = { createUser, findUserByEmail };