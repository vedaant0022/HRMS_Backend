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
      enum: ['travel', 'food', 'office supplies', 'medical', 'other'],
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
        name: { type: String }, // e.g., "Invoice", "Receipt"
        url: { type: String }, // Cloud storage link
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the manager or HR who approved the reimbursement
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reimbursement', ReimbursementSchema);
