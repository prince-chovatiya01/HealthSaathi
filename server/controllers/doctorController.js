import mongoose from 'mongoose';
import Doctor from '../models/Doctors.js';
import Rating from '../models/Rating.js';

// Get all doctors with optional filters
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, language } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (language) query.languages = { $in: [language] };

    const doctors = await Doctor.find(query);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};

// Get doctor by ID (with ratings and reviews)
export const getDoctorById = async (req, res) => {
  const doctorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    // Fetch doctor as a plain JS object
    const doctor = await Doctor.findById(doctorId).lean();

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Fetch ratings from Rating model
    const ratings = await Rating.find({ doctor: doctorId })
      .populate('user', 'name') // populate user name
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Add computed fields to the plain doctor object
    doctor.rating = parseFloat(avgRating.toFixed(1));
    doctor.reviews = ratings.map(r => ({
      user: r.user,
      rating: r.rating,
      comment: r.review,
      date: r.createdAt
    }));

    // Send updated doctor object with reviews
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error while fetching doctor' });
  }
};

// Add new doctor
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      languages,
      availability,
      imageUrl,
      fees
    } = req.body;

    if (!name || !specialization || !experience || !languages || !availability || !fees) {
      return res.status(400).json({ message: 'Missing required fields' });
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

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error while adding doctor' });
  }
};

// Add a review (via Rating model)
export const addDoctorReview = async (req, res) => {
  const doctorId = req.params.id;
  const { rating, comment, appointmentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const existing = await Rating.findOne({
      user: req.user.userId,
      doctor: doctorId,
      appointment: appointmentId
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this appointment' });
    }

    const newRating = new Rating({
      user: req.user.userId,
      doctor: doctorId,
      appointment: appointmentId,
      rating,
      review: comment
    });

    await newRating.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
};
