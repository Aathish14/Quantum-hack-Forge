const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "trustedContact", "verifiedHelper", "admin"],
    default: "user"
  },

  trustedContacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  location: {
    lat: Number,
    lng: Number
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);