const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  text: { type: String },
  fileUrl: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },

  password: {
    type: String,
    default: null
  },

  viewCount: {
    type: Number,
    default: 0
  },

  maxViews: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model("Link", linkSchema);

