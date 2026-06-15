const mongoose = require("mongoose");

const adminLogSchema =
new mongoose.Schema({

  action: {
    type: String,
    required: true
  },

  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  details: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  "AdminLog",
  adminLogSchema
);