const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      default: '123456',
    },

    role: {
      type: String,
      enum: ['Admin', 'HR', 'Manager', 'Employee'],
      default: 'Employee',
    },

    personalDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String },
      dob: { type: Date },
      address: {
        residence: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String },
      },
    },

    jobDetails: {
      designation: { type: String },
      department: { type: String },
      dateOfJoining: { type: Date },
      managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      HRid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },

    documents: [
      {
        doctype: { type: String },
        url: { type: String },
        filename: { type: String }, // New field for custom filename
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    leaveBalance: {
      sickLeave: { type: Number, default: 0 },
      casualLeave: { type: Number, default: 0 },
      earnedLeave: { type: Number, default: 0 },
    },

    attendance: {
      presentDays: { type: Number, default: 0 },
      absentDays: { type: Number, default: 0 },
      leavesTaken: { type: Number, default: 0 },
    },


    appliedLeaves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplyLeaves',
      },
    ],

    reimbursements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reimbursement',
      },
    ],


    attendanceRegularization: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AttendanceRegularization',
      },
    ],

    attendanceRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AttendanceRecord',
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema,);
