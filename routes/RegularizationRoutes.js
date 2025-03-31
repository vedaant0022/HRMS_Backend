const express = require('express');
const { applyRegularization, getRegularizationRequests, updateRegularizationStatus, getUserRegularizationRequests } = require('../controller/RegularizationController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');


router.post('/apply', authMiddleware, applyRegularization);
router.get('/requests', authMiddleware, getRegularizationRequests);
router.patch('/update/:id', authMiddleware, updateRegularizationStatus);
router.post('/my-requests', authMiddleware, getUserRegularizationRequests);

module.exports = router;
