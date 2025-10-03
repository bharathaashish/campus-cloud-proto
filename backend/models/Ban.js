const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bannedAt: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
  },
});

module.exports = mongoose.model('Ban', banSchema);
