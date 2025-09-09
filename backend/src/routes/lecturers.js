const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturers');

// Get all students
router.get('/', lecturerController.getAllLecturer);

// Get a single student by ID
router.get('/:id', lecturerController.getLecturerById);

// Create a new student
router.post('/', lecturerController.createLecturer);

// Update a student
router.put('/:id', lecturerController.updateLecturer);

// Delete a student
router.delete('/:id', lecturerController.deleteLecturer);

module.exports = router;