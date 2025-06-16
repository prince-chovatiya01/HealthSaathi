// import express from 'express';
// import auth from '../middleware/protect.js';
// import {
//   getUserAppointments,
//   bookAppointment,
//   updateAppointmentStatus
// } from '../controllers/appointmentController.js';

// const router = express.Router();

// router.get('/', auth, getUserAppointments);
// router.post('/', auth, bookAppointment);
// router.patch('/:id', auth, updateAppointmentStatus);

// export default router;


import express from 'express';
import Appointment from '../models/Appointment.js';
import protect from '../middleware/protect.js';

const router = express.Router();

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

    // fallback: get current user’s appointments
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

    // Check for existing appointment for doctor
    const doctorConflict = await Appointment.findOne({
      doctorId,
      date: isoDate,
      time,
    });

    if (doctorConflict) {
      return res.status(409).json({ message: 'This time slot is already booked for the doctor.' });
    }

    // Check if user already booked something at the same time
    const userConflict = await Appointment.findOne({
      userId: req.user._id,
      date: isoDate,
      time,
    });

    if (userConflict) {
      return res.status(409).json({ message: 'You already have an appointment at this time.' });
    }

    // Create appointment
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

export default router;
