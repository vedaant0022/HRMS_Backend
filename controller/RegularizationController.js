const moment = require("moment");
const AttendanceRegularization = require("../Models/AttendanceRegularization");
const User = require("../Models/User");

const applyRegularization = async (req, res) => {
    try {
        const { userId, date, clockIn, clockOut, reason } = req.body;

        const existingRequest = await AttendanceRegularization.findOne({ employeeId: userId, date });

        if (existingRequest) {
            return res.status(400).json({ message: "A regularization request already exists for this date." });
        }

        const newRequest = new AttendanceRegularization({
            employeeId: userId,
            date: moment(date).startOf('day').toDate(),
            clockIn,
            clockOut,
            reason,
            status: 'Pending',
        });

        await newRequest.save();
        res.status(201).json({ message: "Attendance regularization request submitted.", request: newRequest });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getRegularizationRequests = async (req, res) => {
    try {
        const { userId, role } = req.user; 

        let requests;
        if (role === 'Admin' || role === 'HR') {
            requests = await AttendanceRegularization.find().populate('employeeId', 'firstName lastName email');
        } else {
            requests = await AttendanceRegularization.find({ employeeId: userId });
        }

        res.status(200).json({ message: "Regularization requests fetched.", requests });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getUserRegularizationRequests = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const requests = await AttendanceRegularization.find({ employeeId: userId });
        if (requests.length == 0) {
            return res.status(404).json({ message: "No regularization requests found for this user." });
        }

        res.status(200).json({ message: "Your regularization requests fetched.", requests });

    } catch (error) {
        console.error("Error fetching regularization requests:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateRegularizationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userID } = req.body; 

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!['Admin', 'HR'].includes(user.role)) {
            return res.status(403).json({ message: "Access denied. Only Admin or HR can update status." });
        }

        const request = await AttendanceRegularization.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Regularization request not found." });
        }

        request.status = status;
        request.approvedBy = userID;
        await request.save();

        res.status(200).json({ message: `Request ${status.toLowerCase()} successfully.`, request });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { applyRegularization, getRegularizationRequests, updateRegularizationStatus, getUserRegularizationRequests };