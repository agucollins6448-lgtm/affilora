const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    bankName: String,

    accountNumber: String,

    accountName: String,

    slipNumber: {
  type: String,
  unique: true
},

    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      default: "pending"
    },

receiptPath: String,
receiptPublicId: String,


    reference: String
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Withdrawal",
    withdrawalSchema
  );