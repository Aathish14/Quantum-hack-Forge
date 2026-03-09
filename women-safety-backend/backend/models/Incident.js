const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  location: {
    lat: Number,
    lng: Number
  },

  status: {
    type: String,
    enum: ["ACTIVE", "RESOLVED"],
    default: "ACTIVE"
  },

  responders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Incident", incidentSchema);