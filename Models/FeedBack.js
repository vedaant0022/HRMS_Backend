const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Reference to your User model
            required: true,
        },
        feedback: {
            type: String,
            required: true, // Ensure feedback text is provided
            trim: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
