const mongoose = require("mongoose");

const membershipRequestSchema =
new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: String,
    enum: [
      "Bronze",
      "Silver",
      "Gold",
      "Premium"
    ],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "approved",
      "rejected"
    ],
    default: "pending"
  }
},
{
  timestamps: true
}
);

module.exports =
mongoose.model(
  "MembershipRequest",
  membershipRequestSchema
);