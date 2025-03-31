const express = require('express');
const { getUserAttendance, clockOut, clockIn } = require('../controller/AttendanceRecordController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.post('/clock-in', authMiddleware, clockIn);
router.post('/clock-out', authMiddleware, clockOut);
router.get('/user/:userId', authMiddleware, getUserAttendance);
// router.delete('/:recordId', authMiddleware, deleteAttendanceRecord);

module.exports = router;
