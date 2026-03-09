const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema({

  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Incident",
    required: true
  },

  mediaType: {
    type: String,
    enum: ["video", "audio", "image"]
  },

  url: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Evidence", evidenceSchema);