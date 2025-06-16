// import express from 'express';
// import Doctor from '../models/Doctor.js';
// import auth from '../middleware/protect.js';

// const router = express.Router();

// // Get all doctors
// router.get('/', async (req, res) => {
//   try {
//     const { specialization, language } = req.query;
//     let query = {};
    
//     if (specialization) {
//       query.specialization = specialization;
//     }
//     if (language) {
//       query.languages = language;
//     }

//     const doctors = await Doctor.find(query).populate('reviews.user', 'name');
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get doctor by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id)
//       .populate('reviews.user', 'name');
    
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
    
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Add review for doctor
// router.post('/:id/reviews', auth, async (req, res) => {
//   try {
//     const { rating, comment } = req.body;
//     const doctor = await Doctor.findById(req.params.id);
    
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }

//     const review = {
//       user: req.user.userId,
//       rating,
//       comment
//     };

//     doctor.reviews.push(review);
    
//     // Update average rating
//     const totalRating = doctor.reviews.reduce((sum, item) => sum + item.rating, 0);
//     doctor.rating = totalRating / doctor.reviews.length;

//     await doctor.save();
//     res.status(201).json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


import express from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
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
      fees,
      rating: 0,
      reviews: [],
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

// @desc    Add a review to a doctor
// @route   POST /api/admin/:id/reviews
// @access  Authenticated users
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
