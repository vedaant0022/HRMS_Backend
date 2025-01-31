const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    title: {
      type: String,
      required: true, 
    },
    description: {
      type: String, 
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'], 
      default: 'Medium',
    },
    dueDate: {
      type: Date, 
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date, 
    },
    comments: [
      {
        commentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        comment: { type: String }, 
        commentedAt: { type: Date, default: Date.now }, 
      },
    ],
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Task', TaskSchema);
