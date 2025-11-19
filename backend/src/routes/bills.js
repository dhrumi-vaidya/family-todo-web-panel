const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create bill
router.post('/', billController.createBill);

// Get bills with filters
router.get('/', billController.getBills);

// Get upcoming bills
router.get('/upcoming', billController.getUpcomingBills);

//Mark bill as paid
router.patch('/:id/paid', billController.markBillPaid);

// Update bill
router.put('/:id', billController.updateBill);

// Delete bill
router.delete('/:id', billController.deleteBill);

module.exports = router;
