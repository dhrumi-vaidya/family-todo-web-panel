const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        };

        const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/family-todo', options);
        isConnected = db.connections[0].readyState;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Attempting to connect without authentication...');
        try {
            const db = await mongoose.connect('mongodb://127.0.0.1:27017/family-todo', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            isConnected = db.connections[0].readyState;
            console.log('MongoDB connected successfully (no auth)');
        } catch (retryError) {
            console.error('MongoDB retry connection failed:', retryError.message);
            console.log('Please ensure MongoDB is running and MONGODB_URI is set in environment variables.');
            // Don't exit process in serverless environment
        }
    }
};

module.exports = connectDB;

