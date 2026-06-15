const mongoose =
require("mongoose");

const activationCodeSchema =
new mongoose.Schema({

  code: {
    type: String,
    required: true,
    unique: true
  },

  paymentConfirmed: {
    type: Boolean,
    default: false
  },

  used: {
    type: Boolean,
    default: false
  },

  usedBy: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  "ActivationCode",
  activationCodeSchema
);