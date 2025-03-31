const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    date: {
      type: Date,
      required: true,  
    },
    clockIn: {
      type: String,  
      // required: true,
    },
    clockOut: {
      type: String,  
      // required: true,
    },
    totalHoursWorked: {
      type: Number, 
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
