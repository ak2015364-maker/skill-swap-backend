const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: { // who owns this skill
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { 
    type: String,
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  type: { // offer or want
    type: String,
    enum: ['offer', 'want'],
    required: true
  },
  category: { 
    type: String,
    trim: true
  },
  experienceYears: { type: Number },
  employed: { type: Boolean, default: false },
  employedYears: { type: Number },
  employer: { type: String },
  createdAt: { 
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', skillSchema);
