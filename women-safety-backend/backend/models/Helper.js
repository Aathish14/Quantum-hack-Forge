const mongoose = require("mongoose");

const helperSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  verified: {
    type: Boolean,
    default: false
  },

  location: {
    lat: Number,
    lng: Number
  }

});

module.exports = mongoose.model("Helper", helperSchema);