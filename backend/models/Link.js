const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

  text: { type: String },

  fileUrl: { type: String },

  expiresAt: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },

  //  Password Protection
  password: {
    type: String,
    default: null
  },

  //  View Count
  viewCount: {
    type: Number,
    default: 0
  },

  maxViews: {
    type: Number,
    default: null
  },

});

module.exports = mongoose.model("Link", linkSchema);
