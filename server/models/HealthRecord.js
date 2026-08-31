import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    // Accept both legacy enum values and new free-text values from frontend
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  doctorName: String,
  hospitalName: String,
  details: {
    type: String,
    default: ''
  },
  attachments: [{
    filename: String,
    url: String,
    contentType: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('HealthRecord', healthRecordSchema);