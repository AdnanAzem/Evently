// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const travelRoutes = require('./routes/travelRoutes');
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middleware/authMiddleware'); // Import the middleware
const pool = require('./config/db'); // Import the database connection
const { getTravelPlansByUser } = require('./models/travelModel');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);

// Frontend routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/save-plan', (req, res) => {
    res.render('save-plan', { query: req.query });
});

app.get('/dashboard', authenticate, async (req, res) => {
    
    try {
        const userId = req.user.userId; // Access the userId from the authenticated user
        // console.log('Fetching plans for userId:', userId);

        const plans = await getTravelPlansByUser(userId);
        // console.log('Transformed plans:', JSON.stringify(plans, null, 2)); // Debugging log

        res.render('dashboard', { plans });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/login`);
});