
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET


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
            password:hashedPassword,
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

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Convert email to lowercase to avoid case sensitivity issues
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found. Please register first.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


module.exports = {
    createUser, uploadDocuments,loginUser
};
