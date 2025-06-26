import Rating from '../models/Rating.js';
import Appointment from '../models/Appointment.js'; // You must have this model
import mongoose from 'mongoose';

class RatingController {
  static async submitRating(req, res) {
    try {
      const { doctor_id, appointment_id, rating, review } = req.body;
      const user_id = req.user.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Check if appointment exists and is completed
      const appointment = await Appointment.findOne({
        _id: appointment_id,
        userId: user_id,
        doctorId: doctor_id,
        status: 'completed'
      });


      if (!appointment) {
        return res.status(400).json({
          success: false,
          message: 'Can only rate after completed appointment'
        });
      }

      // Check if already rated
      const existing = await Rating.findOne({
        user: user_id,
        doctor: doctor_id,
        appointment: appointment_id
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Already rated this appointment',
          existingRating: existing
        });
      }

      const newRating = await Rating.create({
        user: user_id,
        doctor: doctor_id,
        appointment: appointment_id,
        rating: parseInt(rating),
        review: review || ''
      });

      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        ratingId: newRating._id
      });

    } catch (error) {
      console.error('Rating submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting rating'
      });
    }
  }

  static async updateRating(req, res) {
    try {
      const { ratingId } = req.params;
      const { rating, review } = req.body;
      const user_id = req.user.id;

      const existingRating = await Rating.findOne({
        _id: ratingId,
        user: user_id
      });

      if (!existingRating) {
        return res.status(404).json({
          success: false,
          message: 'Rating not found'
        });
      }

      existingRating.rating = parseInt(rating);
      existingRating.review = review;
      await existingRating.save();

      res.json({
        success: true,
        message: 'Rating updated successfully'
      });

    } catch (error) {
      console.error('Rating update error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating rating'
      });
    }
  }

  static async getDoctorRatings(req, res) {
    try {
      const { doctorId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const ratings = await Rating.find({ doctor: doctorId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Rating.countDocuments({ doctor: doctorId });

      res.json({
        success: true,
        ratings,
        pagination: {
          page,
          limit,
          hasMore: skip + ratings.length < totalCount
        }
      });

    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching ratings'
      });
    }
  }

  static async getUserRatingForDoctor(req, res) {
    try {
      const { doctorId, appointmentId } = req.params;
      const user_id = req.user.id;

      const rating = await Rating.findOne({
        user: user_id,
        doctor: doctorId,
        appointment: appointmentId
      });

      res.json({
        success: true,
        rating
      });

    } catch (error) {
      console.error('Get user rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user rating'
      });
    }
  }
}

export default RatingController;
