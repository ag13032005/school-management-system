document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
      const alerts = document.querySelectorAll('.alert');
      alerts.forEach(function(alert) {
        const alertInstance = new bootstrap.Alert(alert);
        alertInstance.close();
      });
    }, 5000);
    
    // Form validation for student marks
    const studentMarksInputs = document.querySelectorAll('input[id^="marks_"]');
    studentMarksInputs.forEach(function(input) {
      input.addEventListener('input', function() {
        const maxMarks = parseInt(this.getAttribute('max'));
        if (parseInt(this.value) > maxMarks) {
          this.value = maxMarks;
        }
        if (parseInt(this.value) < 0) {
          this.value = 0;
        }
      });
    });
  });
  
// GET route to show edit all standards page
router.get('/standards/edit-all', async (req, res) => {
  try {
    const standards = await Standard.find().populate('subject');
    const subjects = await Subject.find({ status: 'active' });
    
    res.render('standards/edit-all', {
      standards,
      subjects,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load classes for editing');
    res.redirect('/standards');
  }
});

// POST route to update all standards
router.post('/standards/update-all', async (req, res) => {
  try {
    const { standards } = req.body;
    
    for (const standard of standards) {
      await Standard.findByIdAndUpdate(standard.id, {
        name: standard.name,
        gradeLevel: standard.gradeLevel,
        description: standard.description,
        subject: standard.subject || null,
        status: standard.status
      });
    }
    
    req.flash('success', 'All classes updated successfully');
    res.redirect('/standards');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update classes');
    res.redirect('/standards/edit-all');
  }
});

// GET route to show edit all subjects page
router.get('/subjects/edit-all', async (req, res) => {
  try {
    const subjects = await Subject.find();
    
    res.render('subjects/edit-all', {
      subjects,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load subjects for editing');
    res.redirect('/subjects');
  }
});

// POST route to update all subjects
router.post('/subjects/update-all', async (req, res) => {
  try {
    const { subjects } = req.body;
    
    for (const subject of subjects) {
      await Subject.findByIdAndUpdate(subject.id, {
        name: subject.name,
        code: subject.code,
        description: subject.description,
        department: subject.department || null,
        status: subject.status
      });
    }
    
    req.flash('success', 'All subjects updated successfully');
    res.redirect('/subjects');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update subjects');
    res.redirect('/subjects/edit-all');
  }
});

// GET route to show edit all students page
router.get('/teacher/students/edit-all', async (req, res) => {
  try {
    const students = await Student.find().populate('enrolledClasses');
    const standards = await Standard.find({ status: 'active' });
    
    res.render('teacher/students/edit-all', {
      students,
      standards,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load students for editing');
    res.redirect('/teacher/students');
  }
});

// POST route to update all students
router.post('/teacher/students/update-all', async (req, res) => {
  try {
    const { students } = req.body;
    
    for (const student of students) {
      // Handle enrolled classes - make sure it's always an array
      const enrolledClasses = Array.isArray(student.enrolledClasses) 
        ? student.enrolledClasses 
        : student.enrolledClasses ? [student.enrolledClasses] : [];
        
      await Student.findByIdAndUpdate(student.id, {
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeLevel: student.gradeLevel,
        email: student.email,
        enrolledClasses: enrolledClasses,
        status: student.status
      });
    }
    
    req.flash('success', 'All students updated successfully');
    res.redirect('/teacher/students');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update students');
    res.redirect('/teacher/students/edit-all');
  }
});
