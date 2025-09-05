const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addFeedback, getFeedback } = require("../controller/FeedBackController");


router.post("/addfeedback", authMiddleware, addFeedback);
router.get("/getfeedback", authMiddleware, getFeedback);

module.exports = router;