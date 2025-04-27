const Standard = require('../models/Standard');
const Subject = require('../models/Subject');
const Student = require('../models/Student');

// Get all standards
exports.getStandards = async (req, res) => {
  try {
    const teacherId = req.session.user.id;
    const standards = await Standard.find({ teacher: teacherId });
    
    res.render('teacher/standards', { standards });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch standards');
    res.redirect('/teacher/dashboard');
  }
};

// Add standard
exports.addStandard = async (req, res) => {
  const { name } = req.body;
  
  try {
    const newStandard = new Standard({
      name,
      teacher: req.session.user.id
    });
    
    await newStandard.save();
    req.flash('success_msg', 'Standard created successfully');
    res.redirect('/standards');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to create standard');
    res.redirect('/standards');
  }
};

// Edit standard
exports.updateStandard = async (req, res) => {
  const { name } = req.body;
  
  try {
    await Standard.findByIdAndUpdate(req.params.id, { name });
    req.flash('success_msg', 'Standard updated successfully');
    res.redirect('/standards');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update standard');
    res.redirect('/standards');
  }
};

// Delete standard
exports.deleteStandard = async (req, res) => {
  try {
    const standardId = req.params.id;
    
    // Check if there are students in this standard
    const studentsCount = await Student.countDocuments({ standard: standardId });
    
    if (studentsCount > 0) {
      req.flash('error_msg', 'Cannot delete standard with students. Please remove students first.');
      return res.redirect('/standards');
    }
    
    // Delete related subjects
    await Subject.deleteMany({ standard: standardId });
    
    // Delete related grades
    await Grade.deleteMany({ standard: standardId });
    
    // Delete standard
    await Standard.findByIdAndDelete(standardId);
    
    req.flash('success_msg', 'Standard and related data deleted successfully');
    res.redirect('/standards');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete standard');
    res.redirect('/standards');
  }
};

// Get standard details with subjects and grades
exports.getStandardDetails = async (req, res) => {
  try {
    const standardId = req.params.id;
    
    const standard = await Standard.findById(standardId);
    if (!standard) {
      req.flash('error_msg', 'Standard not found');
      return res.redirect('/standards');
    }
    
    const subjects = await Subject.find({ standard: standardId });
    const grades = await Grade.find({ standard: standardId }).sort({ minMarks: -1 });
    
    res.render('teacher/standardDetails', {
      standard,
      subjects,
      grades
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch standard details');
    res.redirect('/standards');
  }
};
