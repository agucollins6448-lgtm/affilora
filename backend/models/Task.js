const mongoose =
require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  reward: Number,
  status: {
    type: String,
    default: "pending"
  },
  transaction_id: String
}, { timestamps: true });

module.exports =
mongoose.model(
  "Task",
  taskSchema
);