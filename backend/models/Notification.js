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
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model("Notification", notificationSchema);