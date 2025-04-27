const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isStudentAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isStudentAuthenticated);

// Dashboard
router.get('/dashboard', studentController.dashboard);

module.exports = router;
