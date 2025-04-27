const isTeacherAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.role === 'teacher') {
      return next();
    }
    req.flash('error_msg', 'Please log in as a teacher to access this resource');
    res.redirect('/teacher/login');
  };
  
  const isStudentAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.role === 'student') {
      return next();
    }
    req.flash('error_msg', 'Please log in with your Student ID to access this resource');
    res.redirect('/student/login');
  };
  
  module.exports = {
    isTeacherAuthenticated,
    isStudentAuthenticated
  };