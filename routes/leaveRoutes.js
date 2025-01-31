const express = require('express');
const { applyLeave, updateLeaveStatus, getLeavesByEmployee } = require('../controller/leaveController');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

/**
 * @swagger
 * /leaves/apply:
 *   post:
 *     summary: Submit a leave request
 *     description: Employees can apply for leaves by providing required details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "64b7e512f4a5e72c8f0e64a2"
 *               leaveType:
 *                 type: string
 *                 enum: ["Sick", "Causal", "Paid", "Other"]
 *                 example: "Sick"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-17"
 *               reason:
 *                 type: string
 *                 example: "Feeling unwell"
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 *       400:
 *         description: Missing required fields or invalid dates
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.post('/apply', authMiddleware, applyLeave);

/**
 * @swagger
 * /leaves/update-status/{leaveId}:
 *   post:
 *     summary: Update the status of a leave request
 *     description: Admin can approve or reject a leave request.
 *     parameters:
 *       - in: path
 *         name: leaveId
 *         required: true
 *         description: The leave request ID
 *         schema:
 *           type: string
 *           example: "64c12345f4a5e72c8f0e6789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Approved", "Rejected"]
 *                 example: "Approved"
 *               approvedBy:
 *                 type: string
 *                 example: "64b7e512f4a5e72c8f0e64a2"
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 *       400:
 *         description: Invalid status or missing fields
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal server error
 */
router.post('/update-status/:leaveId',authMiddleware, updateLeaveStatus);

router.post('/getleaves', authMiddleware, getLeavesByEmployee);

module.exports = router;
