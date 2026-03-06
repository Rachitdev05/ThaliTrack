import Feedback from '../models/feedbackModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit new feedback
// @route   POST /api/feedback
export const createFeedback = async (req, res) => {
    try {
        const { type, message } = req.body;

        if (!type || !message) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // 1. Save to Database
        const feedback = await Feedback.create({
            user: req.user._id,
            email: req.user.email, // Auto-filled from logged in user
            type,
            message
        });

        // 2. Notify Admin via Email
        const emailMessage = `
            <h1>New Feedback Received 📝</h1>
            <p><strong>User:</strong> ${req.user.name} (${req.user.email})</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid orange;">${message}</blockquote>
            <p>Check your database or admin panel to reply.</p>
        `;

        try {
            await sendEmail({
                email: process.env.EMAIL_USER, // Send TO yourself (The Admin)
                subject: `ThaliTrack Feedback: ${type}`,
                message: emailMessage
            });
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my feedback history
// @route   GET /api/feedback/my
export const getMyFeedback = async (req, res) => {
    try {
        const history = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ALL feedback (For Admin Dashboard)
// @route   GET /api/feedback/admin
export const getAllFeedback = async (req, res) => {
    try {
        // Ideally, check here if req.user.isAdmin === true
        const allFeedback = await Feedback.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.json(allFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Feedback Status
// @route   PUT /api/feedback/:id
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            feedback.status = status;
            await feedback.save();
            res.json(feedback);
        } else {
            res.status(404).json({ message: "Feedback not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};