require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const familyRoutes = require('./routes/family');
const todoRoutes = require('./routes/todos');
const calendarRoutes = require('./routes/calendar');
const billRoutes = require('./routes/bills');
const budgetRoutes = require('./routes/budget');
const profileRoutes = require('./routes/profile');
const invitationRoutes = require('./routes/invitations');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/invitations', invitationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Family Todo API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
