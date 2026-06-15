const mongoose = require("mongoose");

const walletAdjustmentSchema =
new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  action: {
    type: String,
    enum: ["add", "remove"]
  },

  amount: Number,

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "WalletAdjustment",
  walletAdjustmentSchema
);