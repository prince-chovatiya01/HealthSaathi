import express from 'express';
import protect from '../middleware/protect.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateHealthMetrics
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/health-metrics', protect, updateHealthMetrics);

export default router;
