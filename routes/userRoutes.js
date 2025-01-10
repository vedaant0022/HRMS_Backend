const express = require('express');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/Multer.config');
const { createUser, uploadDocuments } = require('../controller/userController');

const router = express.Router();

router.post('/create-user', createUser);
router.post('/upload-documents/:id', upload.array('documents', 10), uploadDocuments);

module.exports = router;
