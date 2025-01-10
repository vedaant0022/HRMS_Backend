
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');


const createUser = async (req, res) => {
    try {
        const { email, password, role, personalDetails, jobDetails } = req.body;

        const passwordToUse = password ? password : '123456';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(passwordToUse, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            personalDetails,
            jobDetails,
        });

        await newUser.save();
        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                personalDetails: newUser.personalDetails,
                jobDetails: newUser.jobDetails,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.id;
        const folder = req.body.folder || `HRMS/${userId}/Documents`;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = [];

        for (let file of req.files) {
            const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                folder: folder,
                resource_type: 'auto',
            });

            const filename = req.body.filename || file.originalname;

            uploadedFiles.push({
                doctype: file.mimetype,
                url: cloudinaryResponse.secure_url,
                filename: filename,
                folder: folder,
                uploadedAt: new Date(),
            });
        }

        user.documents.push(...uploadedFiles);

        await user.save();

        res.status(200).json({
            message: 'Documents uploaded successfully',
            documents: uploadedFiles,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    createUser, uploadDocuments
};
