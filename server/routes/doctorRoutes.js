import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import Rating from '../models/Rating.js';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// @desc    Create a new doctor
// @route   POST /api/admin/add-doctor
// @access  Admin only
router.post('/add-doctor', protect, admin, async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      languages = [],
      availability = [],
      imageUrl = '',
      fees,
    } = req.body;

    if (!name || !specialization || !experience || !fees) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const newDoctor = new Doctor({
      name,
      specialization,
      experience,
      languages,
      availability,
      imageUrl,
      fees
    });

    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error while creating doctor' });
  }
});

// @desc    Update a doctor by ID
// @route   PUT /api/admin/:id
// @access  Admin only
router.put('/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const fieldsToUpdate = [
      'name', 'specialization', 'experience',
      'languages', 'availability', 'imageUrl', 'fees',
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error while updating doctor' });
  }
});

// @desc    Delete a doctor by ID
// @route   DELETE /api/admin/:id
// @access  Admin only
router.delete('/:id', protect, admin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await Doctor.deleteOne({ _id: id });
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error while deleting doctor' });
  }
});

// @desc    Submit a review (uses Rating model)
// @route   POST /api/admin/:id/reviews
// @access  Authenticated users
router.post('/:id/reviews', protect, async (req, res) => {
  const { id: doctorId } = req.params;
  const { rating, comment, appointmentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: 'Invalid or missing appointment ID' });
  }

  try {
    // Check if user already submitted review for this appointment
    const existing = await Rating.findOne({
      doctor: doctorId,
      appointment: appointmentId,
      user: req.user.userId
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this appointment.' });
    }

    const newRating = new Rating({
      doctor: doctorId,
      appointment: appointmentId,
      user: req.user.userId,
      rating,
      review: comment
    });

    await newRating.save();
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
});

export default router;
