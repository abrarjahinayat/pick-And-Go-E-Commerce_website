// FIXED VERSION - src/config/dbconfig.js

const mongoose = require("mongoose");

const dbconnection = async () => {
    try {
        // ⚠️ CRITICAL: Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
            console.log('Please set MONGODB_URI in cPanel > Setup Node.js App > Environment Variables');
            throw new Error('MONGODB_URI environment variable is required');
        }

        console.log('🔄 Attempting to connect to MongoDB...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds
        });

        console.log('✅ Database connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Full error details:', err);
        
        // ⚠️ IMPORTANT: Don't exit process in production
        // Let the app start without database for debugging
        console.log('⚠️  Server will continue without database connection');
        console.log('⚠️  Please check your MongoDB Atlas configuration');
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from database');
});

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔴 Mongoose connection closed due to app termination');
    process.exit(0);
});

module.exports = dbconnection;