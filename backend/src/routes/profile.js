const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get profile
router.get('/', profileController.getProfile);

// Update profile
router.put('/', profileController.updateProfile);

// Change password
router.post('/change-password', profileController.changePassword);

module.exports = router;
