const mongoose =
require("mongoose");

const transactionSchema =
new mongoose.Schema({

  user: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"

  },

  withdrawalId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "Withdrawal"

},

  type: {

    type: String,

    enum: [

      "task",

      "referral",

      "ads",

      "survey",

      "withdrawal",

      "activation",

      "bonus",

      "admin"

    ]

  },

  amount: Number,

  status: {

    type: String,

    enum: [
      "success",
      "pending",
      "failed"
    ],

    default: "success"

  },

  description: String

}, { timestamps: true });

module.exports =
mongoose.model(
  "Transaction",
  transactionSchema
);