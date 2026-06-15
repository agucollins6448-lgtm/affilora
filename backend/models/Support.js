const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fullName: String,

    email: String,

    membershipTier: String,

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Support",
    supportSchema
  );