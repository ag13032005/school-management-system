const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { isTeacherAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isTeacherAuthenticated);

// Dashboard
router.get('/dashboard', teacherController.dashboard);

// Student management
router.get('/students', teacherController.getStudents);
router.get('/students/add', teacherController.addStudentForm);
router.post('/students/add', teacherController.addStudent);
router.get('/students/edit/:id', teacherController.editStudentForm);
router.post('/students/edit/:id', teacherController.updateStudent);
router.get('/students/delete/:id', teacherController.deleteStudent);

module.exports = router;