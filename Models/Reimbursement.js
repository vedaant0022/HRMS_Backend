const mongoose = require('mongoose');

const ReimbursementSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Travel', 'Food', 'Office Supplies', 'Medical', 'Others'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    documents: [
      {
        name: { type: String },
        url: { type: String }, 
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    submittedAt: {
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

module.exports = mongoose.model('Reimbursement', ReimbursementSchema);
