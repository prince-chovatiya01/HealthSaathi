import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['prescription', 'labReport', 'vaccination', 'general'],
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
    required: true
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