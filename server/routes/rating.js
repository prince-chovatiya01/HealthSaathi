import express from 'express';
import RatingController from '../controllers/ratingController.js';
import authMiddleware from '../middleware/protect.js';

const router = express.Router();

// Submit new rating
router.post('/submit', authMiddleware, RatingController.submitRating);

// Update existing rating
router.put('/:ratingId', authMiddleware, RatingController.updateRating);

// Get all ratings for a doctor
router.get('/doctor/:doctorId', RatingController.getDoctorRatings);

// Get user's rating for specific doctor/appointment
router.get('/user/:doctorId/:appointmentId', authMiddleware, RatingController.getUserRatingForDoctor);

export default router;
