const ApplyLeaves = require('../Models/ApplyLeave');
const User = require('../Models/User');

const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    console.log(employeeId, leaveType, startDate, endDate);

    if (!employeeId || !leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    const newLeave = new ApplyLeaves({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    employee.appliedLeaves.push(newLeave._id);
    await employee.save();

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest: newLeave,
    });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { id, status, approvedBy } = req.body;

    const approver = await User.findById(id);
    if (!approver) {
      return res.status(404).json({ message: 'Approver not found' });
    }
    if (approver.role !== 'HR') {
      return res.status(403).json({ message: 'Access denied. Only Admins can approve or reject Leaves' });
    }

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Status must be "Approved" or "Rejected"' });
    }

    const leaveRequest = await ApplyLeaves.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leaveRequest.status = status;
    leaveRequest.approvedBy = approvedBy || leaveRequest.approvedBy;

    await leaveRequest.save();

    res.status(200).json({
      message: `Leave request ${status} successfully`,
      leaveRequest,
    });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getLeavesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    const leaves = await ApplyLeaves.find({ employeeId }).populate('approvedBy', ' personalDetails role email name');

    if (leaves.length === 0) {
      return res.status(404).json({ message: 'No leave records found for this employee' });
    }

    res.status(200).json({
      message: 'Leave records fetched successfully',
      leaves,
    });
  } catch (error) {
    console.error('Error fetching leave records:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = { applyLeave, updateLeaveStatus, getLeavesByEmployee };
