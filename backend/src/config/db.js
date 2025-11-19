const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        };

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/family-todo', options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Attempting to connect without authentication...');
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/family-todo', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB connected successfully (no auth)');
        } catch (retryError) {
            console.error('MongoDB retry connection failed:', retryError.message);
            console.log('Please ensure MongoDB is running: sudo systemctl start mongod');
            process.exit(1);
        }
    }
};

module.exports = connectDB;
