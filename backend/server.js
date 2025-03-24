const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
// const eventRoutes = require('./routes/eventRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});