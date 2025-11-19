const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create new todo
router.post('/', todoController.createTodo);

// Get todos with filters
router.get('/', todoController.getTodos);

// Get all family todos
router.get('/family', todoController.getFamilyTodos);

// Get upcoming scheduled tasks
router.get('/upcoming', todoController.getUpcomingTodos);

// Update todo
router.put('/:id', todoController.updateTodo);

// Delete todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
