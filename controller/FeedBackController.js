const FeedBack = require("../Models/FeedBack");


const addFeedback = async (req, res) => {
    try {
        const { employeeId ,feedback } = req.body;

        const newFeedback = new FeedBack({
            employeeId, 
            feedback
        });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", data: newFeedback });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getFeedback = async (req, res) => {
    try {
        const feedbacks = await FeedBack.find()
            .populate('employeeId', 'personalDetails.firstName personalDetails.lastName email role');

        res.status(200).json({
            message: 'Feedback fetched successfully',
            feedbacks,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addFeedback, getFeedback }
