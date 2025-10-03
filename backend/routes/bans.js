const express = require('express');
const { body, validationResult } = require('express-validator');
const Ban = require('../models/Ban');
const User = require('../models/User');
const Post = require('../models/Post');
const Report = require('../models/Report');
const { auth } = require('./auth');

const router = express.Router();

// Get all bans (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const bans = await Ban.find().sort({ bannedAt: -1 });
    res.json(bans);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban user (admin only)
router.post('/', auth, [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, reason } = req.body;

  try {
    const existingBan = await Ban.findOne({ email });
    if (existingBan) return res.status(400).json({ message: 'User already banned' });

    const ban = new Ban({ email, reason });
    await ban.save();

    // Remove user's posts
    await Post.deleteMany({ authorEmail: email });
    // Remove related reports
    await Report.deleteMany({ reporter: email });

    res.status(201).json(ban);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unban user (admin only)
router.delete('/:email', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const ban = await Ban.findOneAndDelete({ email: req.params.email });
    if (!ban) return res.status(404).json({ message: 'Ban not found' });
    res.json({ message: 'User unbanned' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
