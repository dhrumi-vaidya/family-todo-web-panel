const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const familyAdminController = require('../controllers/familyAdminController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create family
router.post('/create', familyController.createFamily);

// Join family
router.post('/join', familyController.joinFamily);

// Get family members
router.get('/members', familyController.getMembers);

// Leave family
router.delete('/leave', familyController.leaveFamily);

// Admin only: Update member role
router.put('/members/role', familyAdminController.updateMemberRole);

// Admin only: Remove member
router.delete('/members/:memberId', familyAdminController.removeMember);

module.exports = router;
