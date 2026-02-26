const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SwapRequest = require('../models/SwapRequest');

// Create a new swap request
router.post('/create', auth, async (req, res) => {
  const { offeredSkill, requestedSkill, toUser } = req.body;
  try {
    const swap = new SwapRequest({
      fromUser: req.user.id,
      toUser,
      offeredSkill,
      requestedSkill
    });
    const savedSwap = await swap.save();
    res.status(201).json(savedSwap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get swaps sent by logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ fromUser: req.user.id })
      .populate('fromUser', 'username email')
      .populate('toUser', 'username email')
      .populate('offeredSkill requestedSkill');
    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get swaps received by logged-in user
router.get('/received', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({ toUser: req.user.id })
      .populate('fromUser', 'username email')
      .populate('toUser', 'username email')
      .populate('offeredSkill requestedSkill');
    res.json(swaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update swap status (accept/reject)
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });
    if (swap.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this swap' });
    }

    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
