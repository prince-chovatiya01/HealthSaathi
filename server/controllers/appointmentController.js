import Appointment from '../models/Appointment.js';

// ------------------- GET: User's Appointments -------------------
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }) // ✅ Use userId
      .populate('doctorId', 'name specialization') // ✅ Populate doctor fields
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------- POST: Book Appointment -------------------
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Doctor, date, and time are required.' });
    }

    // Check for existing doctor appointment
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      time
    });

    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked for the doctor.' });
    }

    // Optional: prevent same-time user booking with other doctors
    const userConflict = await Appointment.findOne({
      userId: req.user._id,
      date,
      time
    });

    if (userConflict) {
      return res.status(409).json({ message: 'You already have an appointment at this time.' });
    }

    const newAppointment = new Appointment({
      doctorId,
      userId: req.user._id,
      date,
      time,
      notes
    });

    await newAppointment.save();
    const populated = await newAppointment.populate('doctorId', 'name specialization');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------- PATCH: Update Appointment Status -------------------
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
