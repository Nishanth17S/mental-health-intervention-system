const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'article', 'guide', 'exercise', 'meditation', 'worksheet'],
    required: true
  },
  category: {
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'sleep', 'relationships', 'academic', 'general'],
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  content: {
    url: String,
    filePath: String,
    text: String,
    duration: Number // for audio/video in minutes
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'counselors', 'peer_volunteers'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  metadata: {
    fileSize: Number,
    format: String,
    thumbnail: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);

