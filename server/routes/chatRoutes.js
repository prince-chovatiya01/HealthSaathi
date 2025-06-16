import express from 'express';
import protect from '../middleware/protect.js';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:doctorId', auth, getChatHistory);
router.post('/', auth, sendMessage);

export default router;
