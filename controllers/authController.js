const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const crypto = require('crypto');

// Render teacher login page
exports.teacherLoginPage = (req, res) => {
  res.render('auth/teacherLogin');
};

// Render teacher signup page
exports.teacherSignupPage = (req, res) => {
  res.render('auth/teacherSignup');
};

// Render student login page with CAPTCHA
exports.studentLoginPage = (req, res) => {
  // Generate CAPTCHA
  const captcha = Math.random().toString(36).slice(2, 8);
  req.session.captcha = captcha;
  
  res.render('auth/studentLogin', { captcha });
};

// Register teacher
exports.registerTeacher = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  
  try {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/teacher/signup');
    }
    
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/teacher/signup');
    }
    
    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/teacher/signup');
    }
    
    // Create new teacher
    const newTeacher = new Teacher({
      name,
      email,
      password
    });
    
    await newTeacher.save();
    req.flash('success_msg', 'Registration successful. Please log in.');
    res.redirect('/teacher/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/teacher/signup');
  }
};

// Login teacher
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validation
    if (!email || !password) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/teacher/login');
    }
    
    // Find teacher
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/teacher/login');
    }
    
    // Verify password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/teacher/login');
    }
    
    // Set session
    req.session.user = {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email
    };
    req.session.role = 'teacher';
    
    res.redirect('/teacher/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/teacher/login');
  }
};

// Login student with Student ID and CAPTCHA
exports.loginStudent = async (req, res) => {
  const { studentId, captcha } = req.body;
  
  try {
    // Validation
    if (!studentId) {
      req.flash('error_msg', 'Please enter your Student ID');
      return res.redirect('/student/login');
    }
    
    // Find student
    const student = await Student.findOne({ studentId }).populate('standard');
    if (!student) {
      req.flash('error_msg', 'Invalid Student ID');
      return res.redirect('/student/login');
    }
    
    // Set session
    req.session.user = {
      id: student._id,
      name: student.name,
      studentId: student.studentId,
      standard: student.standard.name,
      rollNo: student.rollNo
    };
    req.session.role = 'student';
    
    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error');
    res.redirect('/student/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
