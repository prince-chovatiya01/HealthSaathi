import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { name, phoneNumber, password, village, district, state } = req.body;

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, phoneNumber, password, village, district, state });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

export default router;
