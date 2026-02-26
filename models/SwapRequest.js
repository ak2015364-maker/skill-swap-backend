const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  requestedSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
