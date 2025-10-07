const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 60 // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['individual', 'group', 'emergency', 'follow-up'],
    default: 'individual'
  },
  mode: {
    type: String,
    enum: ['in-person', 'online', 'phone'],
    default: 'in-person'
  },
  location: {
    type: String
  },
  meetingLink: {
    type: String
  },
  reason: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  notes: {
    type: String
  },
  studentNotes: {
    type: String
  },
  counselorNotes: {
    type: String
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  reminders: [{
    sentAt: Date,
    type: String
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);

