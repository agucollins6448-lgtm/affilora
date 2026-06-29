const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

  title: String,

  message: String,

  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  targetTier: {
    type: String,
    default: null
  },

  sendToAll: {
    type: Boolean,
    default: false
  },

  senderType: {
    type: String,
    enum: [
      "system",
      "admin",
      "user"
    ],
    default: "system"
  },

  read: {
    type: Boolean,
    default: false
  },

  expiresAt: {
    type: Date,
    default: () =>
      new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    expires: 0
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model("Notification", notificationSchema);