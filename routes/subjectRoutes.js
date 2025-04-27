const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { isTeacherAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isTeacherAuthenticated);

// Subject management
router.get('/', subjectController.getSubjects);
router.post('/add', subjectController.addSubject);
router.post('/edit/:id', subjectController.updateSubject);
router.get('/delete/:id', subjectController.deleteSubject);

module.exports = router;
