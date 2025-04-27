const Student = require('../models/Student');
const Standard = require('../models/Standard');
const Subject = require('../models/Subject');

// Teacher dashboard
exports.dashboard = async (req, res) => {
  try {
    const teacherId = req.session.user.id;
    
    // Get counts for dashboard stats
    const standardsCount = await Standard.countDocuments({ teacher: teacherId });
    const subjectsCount = await Subject.countDocuments({ teacher: teacherId });
    const studentsCount = await Student.countDocuments({
      standard: { $in: await Standard.find({ teacher: teacherId }).select('_id') }
    });
    
    res.render('teacher/dashboard', {
      standardsCount,
      subjectsCount,
      studentsCount
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/');
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const teacherId = req.session.user.id;
    
    // Get standards of the teacher
    const standards = await Standard.find({ teacher: teacherId });
    const standardIds = standards.map(standard => standard._id);
    
    // Get students in those standards
    const students = await Student.find({ standard: { $in: standardIds } })
      .populate('standard')
      .populate({
        path: 'subjects.subject',
        model: 'Subject'
      });
    
    res.render('teacher/students', {
      students,
      standards
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to fetch students');
    res.redirect('/teacher/dashboard');
  }
};

// Render add student form
exports.addStudentForm = async (req, res) => {
  try {
    const teacherId = req.session.user.id;
    const standards = await Standard.find({ teacher: teacherId });
    
    res.render('teacher/addStudent', { standards });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/teacher/students');
  }
};

// Add new student
exports.addStudent = async (req, res) => {
  const { name, rollNo, standardId } = req.body;
  
  try {
    // Create unique student ID
    const studentId = `STD${Date.now().toString().slice(-6)}`;
    
    // Find subjects for the selected standard
    const subjects = await Subject.find({ standard: standardId });
    
    // Create student subject array
    const studentSubjects = subjects.map(subject => ({
      subject: subject._id,
      marks: 0
    }));
    
    // Create new student
    const newStudent = new Student({
      name,
      studentId,
      rollNo,
      standard: standardId,
      subjects: studentSubjects
    });
    
    await newStudent.save();
    
    req.flash('success_msg', `Student added successfully with ID: ${studentId}`);
    res.redirect('/teacher/students');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add student');
    res.redirect('/teacher/students/add');
  }
};

// Render edit student form
exports.editStudentForm = async (req, res) => {
  try {
    const studentId = req.params.id;
    const teacherId = req.session.user.id;
    
    const student = await Student.findById(studentId)
      .populate('standard')
      .populate({
        path: 'subjects.subject',
        model: 'Subject'
      });
      
    const standards = await Standard.find({ teacher: teacherId });
    
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/teacher/students');
    }
    
    res.render('teacher/editStudent', {
      student,
      standards
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to load student data');
    res.redirect('/teacher/students');
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  const { name, rollNo, standardId, marks } = req.body;
  
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/teacher/students');
    }
    
    // Update basic info
    student.name = name;
    student.rollNo = rollNo;
    
    // Check if standard changed
    if (standardId !== student.standard.toString()) {
      student.standard = standardId;
      
      // Get subjects for new standard
      const subjects = await Subject.find({ standard: standardId });
      student.subjects = subjects.map(subject => ({
        subject: subject._id,
        marks: 0
      }));
    } else {
      // Update marks
      if (marks) {
        Object.keys(marks).forEach(subjectId => {
          const subjectIndex = student.subjects.findIndex(
            s => s.subject.toString() === subjectId
          );
          
          if (subjectIndex !== -1) {
            student.subjects[subjectIndex].marks = marks[subjectId];
          }
        });
      }
    }
    
    await student.save();
    req.flash('success_msg', 'Student updated successfully');
    res.redirect('/teacher/students');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update student');
    res.redirect(`/teacher/students/edit/${req.params.id}`);
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Student deleted successfully');
    res.redirect('/teacher/students');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete student');
    res.redirect('/teacher/students');
  }
};
