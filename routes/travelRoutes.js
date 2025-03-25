const express = require('express');
const { searchDestination, saveTravelPlanHandler, getTravelPlansHandler } = require('../controllers/travelController');
const authenticate = require('../middleware/authMiddleware'); // Middleware to verify JWT token

const router = express.Router();

// Search for a destination
router.post('/search', searchDestination);

// Save a travel plan
router.post('/save-plan', authenticate, saveTravelPlanHandler);

// Get all travel plans for a user
router.get('/plans', authenticate, getTravelPlansHandler);

module.exports = router;