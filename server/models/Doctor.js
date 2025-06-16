import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  }
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  slots: {
    type: [SlotSchema],
    required: true
  }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  languages: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: 'At least one language must be specified.'
    }
  },
  availability: {
    type: [AvailabilitySchema],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  fees: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [ReviewSchema]
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);
