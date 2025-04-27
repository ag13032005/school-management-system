const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { isTeacherAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isTeacherAuthenticated);

// Grade management
router.get('/:standardId', gradeController.getGrades);
router.post('/add', gradeController.addGrade);
router.post('/edit/:id', gradeController.updateGrade);
router.get('/delete/:id', gradeController.deleteGrade);

module.exports = router;