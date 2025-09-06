const { default: mongoose } = require("mongoose");
const Reimbursement = require("../Models/Reimbursement");
const User = require("../Models/User");
const cloudinary = require('../config/cloudinary');

const applyReimbursement = async (req, res) => {
    try {
        const { category, amount, description } = req.body;
        const employeeId = req.user.User._id;
        const folder = `HRMS/${employeeId}/Reimbursements/`;

        if (!category || !amount) {
            return res.status(400).json({ message: 'Category and amount are required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        if (!employeeId) {
            return res.status(400).json({ message: 'No Employee ID Found' });
        }

        const uploadedFiles = await Promise.all(req.files.map(async (file) => {
            const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                folder: folder,
                resource_type: 'auto',
            });

            return {
                doctype: file.mimetype,
                url: cloudinaryResponse.secure_url,
                filename: file.originalname,
                folder,
                uploadedAt: new Date(),
            };
        }));

        const newReimbursement = new Reimbursement({
            employeeId,
            category,
            amount,
            description,
            documents: uploadedFiles,
        });

        await newReimbursement.save();

        await User.findByIdAndUpdate(employeeId, {
            $push: { reimbursements: newReimbursement._id },
        });

        res.status(201).json({
            message: 'Reimbursement request submitted successfully',
            reimbursement: newReimbursement,
        });
    } catch (error) {
        console.error('Error submitting reimbursement request:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updateReimbursementStatus = async (req, res) => {
    try {
        const { reimbursementId, status } = req.body;
        const approverId = req.user.userId;

        const approver = await User.findById(approverId);
        if (!approver) {
            return res.status(404).json({ message: 'Approver not found' });
        }
        if (approver.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only Admins can approve or reject reimbursements' });
        }
        if (!reimbursementId || !status) {
            return res.status(400).json({ message: 'Reimbursement ID and status are required' });
        }
        const allowedStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values: Pending, Approved, Rejected' });
        }
        const reimbursement = await Reimbursement.findById(reimbursementId);

        if (!reimbursement) {
            return res.status(404).json({ message: 'Reimbursement request not found' });
        }
        reimbursement.status = status;
        reimbursement.approvedBy = approverId;
        await reimbursement.save();
        res.status(200).json({
            message: `Reimbursement status updated to '${status}'`,
            reimbursement,
        });
    } catch (error) {
        console.error('Error updating reimbursement status:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// const getReimbursementsByEmployeeId = async (req, res) => {
//     try {
//         const employeeId = req.user.userId; 
//         // console.log("EMP ID >>", employeeId)
//         console.log("Type of EMP ID:", typeof employeeId);

//         const reimbursements = await Reimbursement.find({ employeeId })
//             .populate('approvedBy', 'name email') 
//             .sort({ submittedAt: -1 }); 

//         if (!reimbursements || reimbursements.length === 0) {
//             return res.status(404).json({ message: 'No reimbursements found for this employee' });
//         }

//         res.status(200).json({
//             message: 'Reimbursements fetched successfully',
//             reimbursements,
//         });
//     } catch (error) {
//         console.error('Error fetching reimbursements:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };


const getReimbursementsByEmployeeId = async (req, res) => {
    try {
        const employeeId = req.user.User._id;
        console.log("EMP ID from Token >>>", employeeId);

        if (!employeeId) {
            return res.status(401).json({ message: 'No USER ID FOUND' });
        }

        const reimbursements = await Reimbursement.find({ employeeId })
            .populate('approvedBy', 'name email')
            .sort({ submittedAt: -1 });

        if (!reimbursements || reimbursements.length === 0) {
            return res.status(404).json({ message: 'No reimbursements found for this employee' });
        }

        res.status(200).json({
            message: 'Reimbursements fetched successfully',
            reimbursements,
        });
    } catch (error) {
        console.error('Error fetching reimbursements:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


const getAllReimbursements = async (req, res) => {
    try {
        const userRole = req.user.role;
        if (userRole !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admin can view all reimbursements.' });
        }
        const reimbursements = await Reimbursement.find()
            .populate('employeeId', 'name email')
            .populate('approvedBy', 'name email')
            .sort({ submittedAt: -1 });

        if (!reimbursements || reimbursements.length === 0) {
            return res.status(404).json({ message: 'No reimbursements found in the system' });
        }

        res.status(200).json({
            message: 'All reimbursements fetched successfully',
            reimbursements,
        });
    } catch (error) {
        console.error('Error fetching reimbursements:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};





module.exports = { applyReimbursement, updateReimbursementStatus, getReimbursementsByEmployeeId, getAllReimbursements }