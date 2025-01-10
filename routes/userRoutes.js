const express = require('express');
const upload = require('../config/Multer.config');
const { createUser, uploadDocuments } = require('../controller/userController');

const router = express.Router();
/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Create a new user
 *     description: This endpoint is used to create a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: admin
 *               personalDetails:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   age:
 *                     type: integer
 *                     example: 30
 *               jobDetails:
 *                 type: object
 *                 properties:
 *                   designation:
 *                     type: string
 *                     example: Software Engineer
 *                   department:
 *                     type: string
 *                     example: IT
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60f7c40343d24b0015e761a2
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Bad Request (e.g., User already exists)
 *       500:
 *         description: Internal Server Error
 */
router.post('/create-user', createUser);
/**
 * @swagger
 * /upload-documents/{id}:
 *   post:
 *     summary: Upload documents for a user
 *     description: This endpoint allows users to upload multiple documents (max 10) to the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user for whom the documents are being uploaded.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 example: HRMS/12345/Documents
 *               filename:
 *                 type: string
 *                 example: resume.pdf
 *     responses:
 *       200:
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documents uploaded successfully
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       doctype:
 *                         type: string
 *                         example: application/pdf
 *                       url:
 *                         type: string
 *                         example: https://res.cloudinary.com/your-cloud/image/upload/sample.pdf
 *                       filename:
 *                         type: string
 *                         example: resume.pdf
 *       400:
 *         description: No files uploaded or bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/upload-documents/:id', upload.array('documents', 10), uploadDocuments);

module.exports = router;
