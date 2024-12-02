const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

// Load Environment Variables
dotenv.config();

// Check if MONGODB_URI is configured
if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set in the environment variables.');
    process.exit(1);
}

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/contacts', contactRoutes);

// Handle 404 Errors for Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An internal server error occurred',
        error: err.message, // Remove in production for security
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
