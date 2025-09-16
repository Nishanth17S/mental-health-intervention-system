const mongoose = require('mongoose');

const screeningResponseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  response: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
});

const screeningResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  screeningType: {
    type: String,
    enum: ['PHQ-9', 'GAD-7', 'GHQ-12', 'PSS', 'custom'],
    required: true
  },
  responses: [screeningResponseSchema],
  totalScore: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['minimal', 'mild', 'moderate', 'moderately-severe', 'severe'],
    required: true
  },
  interpretation: {
    type: String,
    required: true
  },
  recommendations: [String],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  counselorNotified: {
    type: Boolean,
    default: false
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// PHQ-9 Questions Schema
const phq9QuestionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    score: Number
  }]
});

// GAD-7 Questions Schema
const gad7QuestionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    score: Number
  }]
});

// GHQ-12 Questions Schema
const ghq12QuestionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    score: Number
  }]
});

module.exports = {
  ScreeningResult: mongoose.model('ScreeningResult', screeningResultSchema),
  PHQ9Question: mongoose.model('PHQ9Question', phq9QuestionsSchema),
  GAD7Question: mongoose.model('GAD7Question', gad7QuestionsSchema),
  GHQ12Question: mongoose.model('GHQ12Question', ghq12QuestionsSchema)
};

