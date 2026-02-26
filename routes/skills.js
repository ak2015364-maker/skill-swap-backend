const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth'); // JWT middleware

// Add a new skill
router.post('/add', auth, async (req, res) => {
  try {
    const { title, description, category, type, experienceYears, employed, employedYears, employer } = req.body;
    const skill = new Skill({
      user: req.user.id,
      title,
      description,
      category,
      type,
      experienceYears,
      employed,
      employedYears,
      employer
    });
    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    console.error('POST /api/skills/add error:', err.stack || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all skills (optional filter by type)
router.get('/', async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  try {
    const skills = await Skill.find(filter).populate('user', 'username email');
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in user's skills
router.get('/my', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    res.json(skills);
  } catch (err) {
    console.error('GET /api/skills/my error:', err.stack || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a skill (withdraw) - only owner
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    // Debug: log owner vs requester
    console.log(`Attempting delete: skill=${skill._id} owner=${skill.user.toString()} requester=${req.user.id}`);
    if (skill.user.toString() !== req.user.id) {
      console.warn(`Unauthorized delete attempt: skill=${skill._id} owner=${skill.user.toString()} requester=${req.user.id}`);
      return res.status(403).json({ message: 'Not authorized to delete this skill', owner: skill.user.toString(), requester: req.user.id });
    }
    // Remove the skill
    await skill.remove();

    // Remove any swap requests that reference this skill (either offered or requested)
    try {
      const resDel = await SwapRequest.deleteMany({
        $or: [ { offeredSkill: skill._id }, { requestedSkill: skill._id } ]
      });
      console.log(`Removed ${resDel.deletedCount} swap requests referencing skill ${skill._id}`);
    } catch (e) {
      console.error('Error removing related swap requests:', e);
    }

    res.json({ message: 'Skill removed' });
  } catch (err) {
    console.error('DELETE /api/skills/:id error:', err.stack || err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
