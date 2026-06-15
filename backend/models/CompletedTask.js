const mongoose =
require("mongoose");

const completedTaskSchema =
new mongoose.Schema({

  user: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"

  },

  task: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "Task"

  },

  earnedAmount: Number

}, { timestamps: true });

module.exports =
mongoose.model(
  "CompletedTask",
  completedTaskSchema
);