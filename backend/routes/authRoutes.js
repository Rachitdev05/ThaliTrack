import express from 'express';
import { signupUser, verifyOtp, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/verify', verifyOtp);
router.post('/login', loginUser);

export default router;