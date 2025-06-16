import mongoose from 'mongoose';
import Doctor from '../models/Doctors.js';

// Get all doctors with optional filters
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, language } = req.query;
    const query = {};

    if (specialization) query.specialization = specialization;
    if (language) query.languages = { $in: [language] };

    const doctors = await Doctor.find(query).populate('reviews.user', 'name');
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  const doctorId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: 'Invalid doctor ID format' });
  }

  try {
    const doctor = await Doctor.findById(doctorId).populate('reviews.user', 'name');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

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

    // Basic validation
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
      fees,
      rating: 0,
      reviews: []
    });

    await newDoctor.save();

    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Server error while adding doctor' });
  }
};

// Add a review for a doctor
export const addDoctorReview = async (req, res) => {
  const doctorId = req.params.id;
  const { rating, comment } = req.body;

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

    const review = {
      user: req.user?.userId, // Optional chaining in case `req.user` is undefined
      rating,
      comment,
    };

    doctor.reviews.push(review);

    // Update average rating
    const totalRating = doctor.reviews.reduce((sum, r) => sum + r.rating, 0);
    doctor.rating = (totalRating / doctor.reviews.length).toFixed(1);

    await doctor.save();

    res.status(201).json({ message: 'Review added', doctor });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};
