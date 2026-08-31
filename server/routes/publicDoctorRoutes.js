import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import protect from '../middleware/protect.js';
import Rating from '../models/Rating.js';

const router = express.Router();

// GET /api/doctors — list all doctors with real computed ratings
router.get('/', async (req, res) => {
  try {
    const { specialization, language } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (language) query.languages = { $in: [language] };

    const doctors = await Doctor.find(query).lean();

    // Compute real average rating for each doctor using aggregation
    const doctorIds = doctors.map(d => d._id);

    const ratingAggregates = await Rating.aggregate([
      { $match: { doctor: { $in: doctorIds } } },
      {
        $group: {
          _id: '$doctor',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Build a lookup map by doctorId string
    const ratingMap = {};
    ratingAggregates.forEach(r => {
      ratingMap[r._id.toString()] = {
        rating: parseFloat(r.avgRating.toFixed(1)),
        reviewCount: r.count
      };
    });

    const enrichedDoctors = doctors.map(doc => ({
      ...doc,
      rating: ratingMap[doc._id.toString()]?.rating || 0,
      reviewCount: ratingMap[doc._id.toString()]?.reviewCount || 0,
      reviews: [] // Full reviews available on GET /:id
    }));

    res.json(enrichedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
});

// GET /api/doctors/:id — single doctor with full ratings
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
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
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error while fetching doctor' });
  }
});

export default router;
