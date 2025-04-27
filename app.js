const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const port = process.env.PORT || 8080;

// Initialize app
const app = express();

// Connect to database - MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://tavi:8454958530@tavi.mongodb.net/school_management?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Atlas Cluster Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Configure express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'school_management_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/authRoutes'));
app.use('/teacher', require('./routes/teacherRoutes'));
app.use('/student', require('./routes/studentRoutes'));
app.use('/standards', require('./routes/standardRoutes'));
app.use('/subjects', require('./routes/subjectRoutes'));

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = connectDB;
