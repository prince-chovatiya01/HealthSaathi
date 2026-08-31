import express from 'express';
import protect from '../middleware/protect.js';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:doctorId', protect, getChatHistory); // Fixed: was using undefined 'auth'
router.post('/', protect, sendMessage);             // Fixed: was using undefined 'auth'

export default router;
