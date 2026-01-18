require('dotenv').config();
const express = require('express');
const dbconnection = require('./src/config/dbconfig');
const router = require('./src/route');
const errorHandlingMiddleware = require('./src/utils/errorhandling');
const pathNotFoundMiddleware = require('./src/utils/pathnotefound');
const cors = require('cors');

const app = express();
const httpserver = require('http').createServer(app);

// Use PORT from Render environment
const port = process.env.PORT || 4000;

// CORS - Allow your frontend domain
app.use(cors({
    origin: [
        'https://trendygo.top',
        'https://www.trendygo.top',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection
dbconnection()
    .then(() => console.log('✅ Database connected'))
    .catch(err => console.error('❌ Database error:', err.message));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Health check
app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    res.json({
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date()
    });
});

// Routes
app.use(router);

// Error handling
app.use(pathNotFoundMiddleware);
app.use(errorHandlingMiddleware);

// Start server
httpserver.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;