import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import protect from '../middleware/protect.js';
import Rating from '../models/Rating.js';

const router = express.Router();

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, language } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (language) query.languages = { $in: [language] };

    const doctors = await Doctor.find(query).lean();

    // Simply add placeholders for rating and reviews
    const simplifiedDoctors = doctors.map((doc) => ({
      ...doc,
      rating: 0,
      reviews: []
    }));

    res.json(simplifiedDoctors);
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

  const doctor = await Doctor.findById(id).lean();
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  const ratings = await Rating.find({ doctor: id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  const avgRating = ratings.length
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  doctor.rating = parseFloat(avgRating.toFixed(1));
  doctor.reviews = ratings.map(r => ({
    user: r.user,
    rating: r.rating,
    comment: r.review,
    date: r.createdAt
  }));

  res.json(doctor);
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
