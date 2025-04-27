const Subject = require('../models/Subject');
const Standard = require('../models/Standard');
const Student = require('../models/Student');

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const teacherId = req.session.user.id;
    
    const subjects = await Subject.find({ teacher: teacherId })
      .populate('standard');
    
    const standards = await Standard.find({ teacher: teacherId });
    
    res.render('teacher/subjects', {
      subjects,
      standards
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch subjects');
    res.redirect('/teacher/dashboard');
  }
};

// Add subject
exports.addSubject = async (req, res) => {
  const { name, standardId, maxMarks } = req.body;
  
  try {
    const newSubject = new Subject({
      name,
      standard: standardId,
      maxMarks,
      teacher: req.session.user.id
    });
    
    const savedSubject = await newSubject.save();
    
    // Add subject to all students in that standard
    await Student.updateMany(
      { standard: standardId },
      { $push: { subjects: { subject: savedSubject._id, marks: 0 } } }
    );
    
    req.flash('success_msg', 'Subject added successfully');
    res.redirect('/subjects');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add subject');
    res.redirect('/subjects');
  }
};

// Edit subject
exports.updateSubject = async (req, res) => {
  const { name, maxMarks } = req.body;
  
  try {
    await Subject.findByIdAndUpdate(req.params.id, { name, maxMarks });
    req.flash('success_msg', 'Subject updated successfully');
    res.redirect('/subjects');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update subject');
    res.redirect('/subjects');
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    
    // Remove subject from all students
    await Student.updateMany(
      {},
      { $pull: { subjects: { subject: subjectId } } }
    );
    
    // Delete subject
    await Subject.findByIdAndDelete(subjectId);
    
    req.flash('success_msg', 'Subject deleted successfully');
    res.redirect('/subjects');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete subject');
    res.redirect('/subjects');
  }
};