const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyCaptcha = require('../middleware/captcha');

// Teacher auth routes
router.get('/teacher/login', authController.teacherLoginPage);
router.get('/teacher/signup', authController.teacherSignupPage);
router.post('/teacher/register', authController.registerTeacher);
router.post('/teacher/login', authController.loginTeacher);

// Student auth routes
router.get('/student/login', authController.studentLoginPage);
router.post('/student/login', verifyCaptcha, authController.loginStudent);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
