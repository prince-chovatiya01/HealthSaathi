import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  time: {
    type: String, // Format: HH:MM (24hr)
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
