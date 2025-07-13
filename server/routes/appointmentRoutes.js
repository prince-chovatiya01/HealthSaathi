import express from 'express';
import Appointment from '../models/Appointment.js';
import Rating from '../models/Rating.js';
import protect from '../middleware/protect.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// ------------------- GET: All Appointments (Admin Only) -------------------
router.get('/all', protect, admin, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name')
      .populate('doctorId', 'name specialization')
      .sort({ date: -1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Failed to fetch all appointments:', error);
    res.status(500).json({ message: 'Failed to fetch all appointments' });
  }
});

// ------------------- GET: Completed Appointments for Rating -------------------
router.get('/completed', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user._id,
      status: 'completed'
    })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1, time: 1 });

    const ratedAppointments = await Rating.find({ user: req.user._id });

    const response = appointments.map((apt) => {
      const rated = ratedAppointments.find(
        (r) => r.appointment.toString() === apt._id.toString()
      );

      return {
        _id: apt._id,
        doctorId: apt.doctorId._id,
        doctorName: apt.doctorId.name,
        doctorSpecialization: apt.doctorId.specialization,
        date: apt.date,
        time: apt.time,
        hasRated: !!rated,
        userRating: rated?.rating || 0,
        userReview: rated?.review || ''
      };
    });

    res.json({ appointments: response });
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
    res.status(500).json({ message: 'Failed to fetch completed appointments' });
  }
});

// ------------------- GET: User's Appointments -------------------
router.get('/', protect, async (req, res) => {
  const { doctor, date } = req.query;

  try {
    if (doctor && date) {
      const appointments = await Appointment.find({
        doctorId: doctor,
        date: new Date(date).toISOString().split('T')[0],
      });
      return res.json(appointments);
    }

    const appointments = await Appointment.find({ userId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// ------------------- POST: Book Appointment -------------------
router.post('/', protect, async (req, res) => {
  const { doctorId, date, time, notes } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: 'Doctor, date, and time are required.' });
  }

  try {
    const isoDate = new Date(date).toISOString().split('T')[0];

    const doctorConflict = await Appointment.findOne({
      doctorId,
      date: isoDate,
      time,
    });

    if (doctorConflict) {
      return res.status(409).json({ message: 'This time slot is already booked for the doctor.' });
    }

    const userConflict = await Appointment.findOne({
      userId: req.user._id,
      date: isoDate,
      time,
    });

    if (userConflict) {
      return res.status(409).json({ message: 'You already have an appointment at this time.' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      date: isoDate,
      time,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Appointment creation error:', error.message);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
});

// ------------------- GET: Doctor's Appointments -------------------
router.get('/doctor/:doctorId', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('userId', 'name')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctor appointments' });
  }
});

// ------------------- PATCH: Update Appointment Status (Admin only) -------------------
router.patch('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  if (!['completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be "completed" or "cancelled".' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
});

export default router;
