const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Post = require('../models/Post');
const { auth } = require('./auth');

const router = express.Router();

// Get all reports (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const reports = await Report.find().populate('postId').sort({ reportedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create report
router.post('/', auth, [
  body('postId').isMongoId(),
  body('reason').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { postId, reason } = req.body;

  try {
    // Check if already reported
    const existing = await Report.findOne({ postId, reporter: req.user.email });
    if (existing) return res.status(400).json({ message: 'You have already reported this post.' });

    const report = new Report({
      postId,
      reason,
      reporter: req.user.email,
    });
    await report.save();
    const populatedReport = await Report.findById(report._id).populate('postId');
    res.status(201).json(populatedReport);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete report (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
