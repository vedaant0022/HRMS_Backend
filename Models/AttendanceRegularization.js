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
      type: String, // Format: HH:mm (e.g., "09:00")
    },
    clockOut: {
      type: String, // Format: HH:mm (e.g., "18:00")
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the manager or HR who approved the regularization
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AttendanceRegularization', AttendanceRegularizationSchema);
