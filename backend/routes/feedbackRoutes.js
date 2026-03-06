import express from 'express';
import { createFeedback, getMyFeedback, getAllFeedback,updateFeedbackStatus  } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Routes
router.post('/', protect, createFeedback);
router.get('/my', protect, getMyFeedback);

// Admin Route (Protected)
router.get('/admin', protect, getAllFeedback);
router.put('/:id', protect, updateFeedbackStatus);  

export default router;