const ApplyLeaves = require('../models/ApplyLeaves');
const User = require('../models/User');

const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

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

    // const User = await User.findById(employeeId);

    const newLeave = new ApplyLeaves({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    // await User.appliedLeaves;

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
      const { status, approvedBy } = req.body;
  
      // Validate the status
      if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Status must be "Approved" or "Rejected"' });
      }
  
      // Find the leave request by ID
      const leaveRequest = await ApplyLeaves.findById(leaveId);
      if (!leaveRequest) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      // Update the leave status and the person who approved it
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

module.exports = { applyLeave, updateLeaveStatus };
