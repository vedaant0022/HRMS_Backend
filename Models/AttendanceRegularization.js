const mongoose = require('mongoose');

const AttendanceRegularizationSchema = new mongoose.Schema(
  {
    employeeId: {
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
    },
    clockOut: {
      type: String, 
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceRegularization', AttendanceRegularizationSchema);
