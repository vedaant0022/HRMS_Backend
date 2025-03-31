const AttendanceRecord = require("../Models/AttendanceRecord ");
const User = require('../Models/User');
const moment = require('moment');

// const clockIn = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         // Check if user has already clocked in today
//         const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)
//         const existingRecord = await AttendanceRecord.findOne({
//             userId,
//             date: today
//         });

//         if (existingRecord) {
//             return res.status(400).json({ message: 'You have already clocked in today.' });
//         }

//         const clockInTime = new Date().toISOString(); // Get current time

//         const newAttendance = new AttendanceRecord({
//             userId,
//             date: today,
//             clockIn: clockInTime,
//             clockOut: null,
//             totalHoursWorked: 0
//         });

//         await newAttendance.save();

//         // Update user's attendanceRecords array
//         await User.findByIdAndUpdate(userId, { $push: { attendanceRecords: newAttendance._id } });

//         res.status(201).json({ message: 'Clocked in successfully', attendance: newAttendance });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };

const clockIn = async (req, res) => {
    try {
        const { userId } = req.body;

        // Get today's date in YYYY-MM-DD format
        const today = moment().startOf('day').toDate();

        // Check if the user has already clocked in today
        const existingRecord = await AttendanceRecord.findOne({ userId, date: today });

        if (existingRecord) {
            return res.status(400).json({ message: "User has already checked in today." });
        }

        // Set clock-in time
        const clockInTime = moment().format('hh:mm A');

        // Create a new attendance record
        const newAttendance = new AttendanceRecord({
            userId,
            date: today,
            clockIn: clockInTime,
            clockOut: null, // No clock-out initially
            totalHoursWorked: 0
        });

        await newAttendance.save();

        res.status(201).json({
            message: "Clock-In successful",
            attendance: newAttendance
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const clockOut = async (req, res) => {
    try {
        const { userId } = req.body;

        // Get today's date in YYYY-MM-DD format
        const today = moment().startOf('day').toDate();

        // Find today's attendance record
        const attendanceRecord = await AttendanceRecord.findOne({ userId, date: today });

        if (!attendanceRecord) {
            return res.status(400).json({ message: "User did not check-in today." });
        }

        // Check if already clocked out
        if (attendanceRecord.clockOut) {
            return res.status(400).json({ message: "User has already clocked out today." });
        }

        // Set clock-out time
        const clockOutTime = moment().format('hh:mm A');

        // Calculate total hours worked
        const clockInTime = moment(attendanceRecord.clockIn, 'hh:mm A');
        const totalHours = moment().diff(clockInTime, 'hours', true); // true for decimal hours

        // Update attendance record
        attendanceRecord.clockOut = clockOutTime;
        attendanceRecord.totalHoursWorked = totalHours;

        await attendanceRecord.save();

        res.status(200).json({
            message: "Clock-Out successful",
            attendance: attendanceRecord
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getUserAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        const attendanceRecords = await AttendanceRecord.find({ userId }).sort({ date: -1 });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        res.status(200).json({ message: 'Attendance records fetched successfully', records: attendanceRecords });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const deleteAttendanceRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        // Find the attendance record
        const attendanceRecord = await AttendanceRecord.findById(recordId);
        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Remove reference from User's attendanceRecords array
        await User.findByIdAndUpdate(attendanceRecord.userId, {
            $pull: { attendanceRecords: recordId }
        });

        // Delete the record
        await AttendanceRecord.findByIdAndDelete(recordId);

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {clockIn, clockOut, getUserAttendance}