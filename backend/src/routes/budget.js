const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Set/Update budget
router.post('/', budgetController.setBudget);

// Get current month budget
router.get('/current', budgetController.getCurrentBudget);

// Get budget for specific month
router.get('/:year/:month', budgetController.getBudget);

// Update spending
router.patch('/:id/spending', budgetController.updateSpending);

module.exports = router;
