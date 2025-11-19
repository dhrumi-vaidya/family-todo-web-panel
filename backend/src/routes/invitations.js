const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const auth = require('../middleware/auth');

// Public route - get invitation details
router.get('/:token', invitationController.getInvitation);

// Public route - accept invitation (register)
router.post('/accept', invitationController.acceptInvitation);

// Protected routes
router.use(auth);

// Send invitation
router.post('/send', invitationController.sendInvitation);

// Get pending invitations (admin only)
router.get('/pending/list', invitationController.getPendingInvitations);

// Approve or reject invitation (admin only)
router.post('/review', invitationController.reviewInvitation);

module.exports = router;
