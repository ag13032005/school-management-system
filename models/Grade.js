const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Standard',
    required: true
  },
  gradeName: {
    type: String,
    required: true
  },
  minMarks: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grade', GradeSchema);