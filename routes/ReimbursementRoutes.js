const express = require('express');
const { applyReimbursement, updateReimbursementStatus, getReimbursementsByEmployeeId, getAllReimbursements } = require('../controller/ReimbursementController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/Multer.config');

const router = express.Router();

router.post('/apply', authMiddleware, upload.array('documents', 10), applyReimbursement);
router.post('/updatestatus', authMiddleware, updateReimbursementStatus);
router.get('/listreimbursement', authMiddleware, getReimbursementsByEmployeeId);
router.get('/adminlist', authMiddleware, getAllReimbursements);

module.exports = router;