const mongoose = require("mongoose");

const vendorSchema =
new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: String,

  bankName: {
    type: String,
    required: true
  },

  accountName: {
    type: String,
    required: true
  },

  accountNumber: {
    type: String,
    required: true
  },

  totalUsersActivated: {
    type: Number,
    default: 0
  },

  totalRevenue: {
    type: Number,
    default: 0
  },

  verified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports =
mongoose.model(
  "Vendor",
  vendorSchema
);