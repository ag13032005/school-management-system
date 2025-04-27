const express = require('express');
const router = express.Router();
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

// Adding Grade controller functionality
// controllers/gradeController.js
const Grade = require('../models/Grade');
const Standard = require('../models/Standard');

// Get grades for a standard
exports.getGrades = async (req, res) => {
  try {
    const standardId = req.params.standardId;
    const grades = await Grade.find({ standard: standardId }).sort({ minMarks: -1 });
    const standard = await Standard.findById(standardId);
    
    res.render('teacher/grades', {
      grades,
      standard
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch grades');
    res.redirect('/standards');
  }
};

// Add grade
exports.addGrade = async (req, res) => {
  const { standardId, gradeName, minMarks, maxMarks } = req.body;
  
  try {
    // Validate marks range
    if (minMarks > maxMarks) {
      req.flash('error_msg', 'Minimum marks cannot exceed maximum marks');
      return res.redirect(`/grades/${standardId}`);
    }
    
    // Check for overlapping ranges
    const existingGrades = await Grade.find({ 
      standard: standardId,
      $or: [
        { minMarks: { $lte: maxMarks, $gte: minMarks } },
        { maxMarks: { $gte: minMarks, $lte: maxMarks } },
        { $and: [
          { minMarks: { $lte: minMarks } },
          { maxMarks: { $gte: maxMarks } }
        ]}
      ]
    });
    
    if (existingGrades.length > 0) {
      req.flash('error_msg', 'Grade range overlaps with existing grades');
      return res.redirect(`/grades/${standardId}`);
    }
    
    const newGrade = new Grade({
      standard: standardId,
      gradeName,
      minMarks,
      maxMarks,
      teacher: req.session.user.id
    });
    
    await newGrade.save();
    req.flash('success_msg', 'Grade added successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add grade');
    res.redirect(`/grades/${standardId}`);
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  const { gradeName, minMarks, maxMarks, standardId } = req.body;
  
  try {
    // Validate marks range
    if (minMarks > maxMarks) {
      req.flash('error_msg', 'Minimum marks cannot exceed maximum marks');
      return res.redirect(`/grades/${standardId}`);
    }
    
    // Check for overlapping ranges (excluding this grade)
    const existingGrades = await Grade.find({ 
      standard: standardId,
      _id: { $ne: req.params.id },
      $or: [
        { minMarks: { $lte: maxMarks, $gte: minMarks } },
        { maxMarks: { $gte: minMarks, $lte: maxMarks } },
        { $and: [
          { minMarks: { $lte: minMarks } },
          { maxMarks: { $gte: maxMarks } }
        ]}
      ]
    });
    
    if (existingGrades.length > 0) {
      req.flash('error_msg', 'Grade range overlaps with existing grades');
      return res.redirect(`/grades/${standardId}`);
    }
    
    await Grade.findByIdAndUpdate(req.params.id, {
      gradeName,
      minMarks,
      maxMarks
    });
    
    req.flash('success_msg', 'Grade updated successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update grade');
    res.redirect(`/grades/${standardId}`);
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    const standardId = grade.standard;
    
    await Grade.findByIdAndDelete(req.params.id);
    
    req.flash('success_msg', 'Grade deleted successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete grade');
    res.redirect('/standards');
  }
};

// routes/gradeRoutes.js - Grade routes
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