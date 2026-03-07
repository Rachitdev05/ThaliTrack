import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register User & Send OTP
// @route   POST /api/auth/signup
export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user exists
        const userExists = await User.findOne({ email });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        if (userExists) {
            // CASE A: User exists AND is verified -> STOP
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists. Please login.' });
            }

            // CASE B: User exists but NOT verified -> UPDATE OTP & RESEND
            // We update the existing record instead of creating a new one
            const salt = await bcrypt.genSalt(10);
            userExists.password = await bcrypt.hash(password, salt); // Update password in case they changed it
            userExists.name = name; // Update name
            userExists.otp = otp;
            userExists.otpExpires = otpExpires;
            
            await userExists.save();

            // Send Email
            const message = `<h1>Welcome Back to ThaliTrack!</h1><p>Your new verification OTP is: <b>${otp}</b></p>`;
            try {
                await sendEmail({ email, subject: 'Verify Your Email (Resend)', message });
                return res.status(200).json({ message: 'Previous account unverified. New OTP sent to email.' });
            } catch (emailError) {
                userExists.otp = undefined;
                userExists.otpExpires = undefined;
                await userExists.save();
                return res.status(500).json({ message: 'Email could not be sent. Check email settings.' });
            }
        }

        // CASE C: New User -> CREATE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password: hashedPassword, otp, otpExpires
        });

        // Send Email
        const message = `<h1>Welcome to ThaliTrack!</h1><p>Your OTP is: <b>${otp}</b></p>`;
        try {
            await sendEmail({ email, subject: 'Verify Your Email', message });
            res.status(201).json({ message: 'OTP sent to email. Please verify.' });
        } catch (emailError) {
            // If email fails, delete the user so they can try again easily
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Verify OTP
// @route   POST /api/auth/verify
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (user && user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
                message: 'Email verified! Logging you in...'
            });
        } else {
            res.status(400).json({ message: 'Invalid or Expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

         if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) return res.status(401).json({ message: 'Please verify email first' });

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin, // <--- SEND THIS TO FRONTEND
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send Email
        const message = `<h1>Reset Password</h1><p>Your OTP to reset password is: <b>${otp}</b></p>`;
        await sendEmail({ email, subject: 'Password Reset OTP', message });

        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (user && user.otp === otp && user.otpExpires > Date.now()) {
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            
            // Clear OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({ message: "Password reset successful! Please login." });
        } else {
            res.status(400).json({ message: "Invalid or Expired OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const message = `<h1>ThaliTrack OTP</h1><p>Your new code is: <b>${otp}</b></p>`;
        await sendEmail({ email, subject: 'Resend Verification', message });

        res.json({ message: "OTP Resent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};