import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getChatHistory, saveMessage } from '../controllers/chatController.js';

const router = express.Router();

// Route to get chat history
router.get('/:bookingId', authMiddleware, getChatHistory);

// Route to save a new message
router.post('/:bookingId', authMiddleware, saveMessage);

export default router;
