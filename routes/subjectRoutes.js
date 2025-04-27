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

// Modified Grade controller functionality to only handle marks
// controllers/gradeController.js
const Standard = require('../models/Standard');
const Grade = require('../models/Grade');

// Get marks for a standard
exports.getMarks = async (req, res) => {
  try {
    const standardId = req.params.standardId;
    const grades = await Grade.find({ standard: standardId }).sort({ marks: -1 });
    const standard = await Standard.findById(standardId);
    
    res.render('teacher/marks', {
      grades,
      standard
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch marks');
    res.redirect('/standards');
  }
};

// Add marks
exports.addMarks = async (req, res) => {
  const { standardId, studentId, subjectId, marks } = req.body;
  
  try {
    const newGrade = new Grade({
      standard: standardId,
      student: studentId,
      subject: subjectId,
      marks: marks,
      teacher: req.session.user.id
    });
    
    await newGrade.save();
    req.flash('success_msg', 'Marks added successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add marks');
    res.redirect(`/grades/${standardId}`);
  }
};

// Update marks
exports.updateMarks = async (req, res) => {
  const { marks, standardId } = req.body;
  
  try {
    await Grade.findByIdAndUpdate(req.params.id, {
      marks
    });
    
    req.flash('success_msg', 'Marks updated successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update marks');
    res.redirect(`/grades/${standardId}`);
  }
};

// Delete marks
exports.deleteMarks = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    const standardId = grade.standard;
    
    await Grade.findByIdAndDelete(req.params.id);
    
    req.flash('success_msg', 'Marks entry deleted successfully');
    res.redirect(`/grades/${standardId}`);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete marks');
    res.redirect('/standards');
  }
};
