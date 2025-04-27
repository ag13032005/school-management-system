const verifyCaptcha = (req, res, next) => {
    const captchaValue = req.body.captcha;
    const captchaSession = req.session.captcha;
    
    if (captchaValue && captchaSession && captchaValue === captchaSession) {
      return next();
    }
    
    req.flash('error_msg', 'Invalid CAPTCHA. Please try again.');
    res.redirect('/student/login');
  };
  
  module.exports = verifyCaptcha;