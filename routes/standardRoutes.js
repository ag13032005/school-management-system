const express = require('express');
const router = express.Router();
const standardController = require('../controllers/standardController');
const { isTeacherAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(isTeacherAuthenticated);

// Standard management
router.get('/', standardController.getStandards);
router.post('/add', standardController.addStandard);
router.post('/edit/:id', standardController.updateStandard);
router.get('/delete/:id', standardController.deleteStandard);
router.get('/details/:id', standardController.getStandardDetails);

module.exports = router;
