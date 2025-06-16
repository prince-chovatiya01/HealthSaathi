import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, language } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (language) query.languages = { $in: [language] };

    const doctors = await Doctor.find(query).populate('reviews.user', 'name');
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(id).populate('reviews.user', 'name');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error while fetching doctor' });
  }
});

// POST /api/doctors/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const alreadyReviewed = doctor.reviews.find(
      (r) => r.user.toString() === req.user?.userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this doctor' });
    }

    const review = {
      user: req.user?.userId,
      rating,
      comment,
      date: new Date(),
    };

    doctor.reviews.push(review);
    const total = doctor.reviews.reduce((acc, r) => acc + r.rating, 0);
    doctor.rating = Number((total / doctor.reviews.length).toFixed(1));

    await doctor.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
});

export default router;
