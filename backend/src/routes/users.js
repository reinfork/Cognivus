const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users');
const {authenticateToken} = require('../middleware/auth');

// Apply authentication to all users routes
router.use(authenticateToken);

// Get all students
router.get('/', users_controller.get_all_users);

// Get a single student by ID
router.get('/:id', users_controller.get_users_by_id);

// Create a new student
router.post('/', users_controller.create_users);

// Update a student
router.put('/:id', users_controller.update_users);

// Delete a student
router.delete('/:id', users_controller.delete_users);

module.exports = router;