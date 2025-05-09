const Student = require('../models/Student');
const Subject = require('../models/Subject');
// Student dashboard
exports.dashboard = async (req, res) => {
  try {
    const studentId = req.session.user.id;
    
    const student = await Student.findById(studentId)
      .populate('standard')
      .populate({
        path: 'subjects.subject',
        model: 'Subject'
      });
    
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/student/login');
    }
    
    // Calculate total marks and percentage
    let totalMarks = 0;
    let totalMaxMarks = 0;
    
    const subjectResults = student.subjects.map(subjectData => {
      const { subject, marks } = subjectData;
      totalMarks += marks;
      totalMaxMarks += subject.maxMarks;
      
      const percentage = (marks / subject.maxMarks) * 100;
      
      return {
        name: subject.name,
        maxMarks: subject.maxMarks,
        marks,
        percentage: percentage.toFixed(2)
      };
    });
    
    const overallPercentage = totalMaxMarks > 0 ? 
      ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 0;
    
    res.render('student/dashboard', {
      student,
      subjectResults,
      totalMarks,
      totalMaxMarks,
      overallPercentage,
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/student/login');
  }
};
