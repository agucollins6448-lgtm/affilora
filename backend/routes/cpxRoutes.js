// routes/cpxRoutes.js
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const Transaction = require("../models/Transaction");


router.post("/postback", async (req, res) => {
  try {
    const {
      user_id,
      amount_local,
      amount_usd,
      status,
      trans_id,
      secure_hash
    } = req.body;

    if (status !== "1") {
      return res.status(200).send("ignored");
    }

    // 🔐 VERIFY HASH (IMPORTANT)
    const expectedHash = crypto
      .createHash("md5")
      .update(
        user_id +
        amount_local +
        status +
        trans_id +
        process.env.CPX_SECRET
      )
      .digest("hex");

    if (secure_hash !== expectedHash) {
      return res.status(403).send("invalid hash");
    }

    if (status === "2") {
  const user = await User.findById(user_id);
  
  const today =
  new Date().toISOString().split("T")[0];

if (!user.dailySurveyStats) {
  user.dailySurveyStats = {};
}

if (
  user.dailySurveyStats.date !== today
) {

  user.dailySurveyStats = {
    date: today,
    count: 0
  };

}

const membership =
  user.membership || "starter";

const surveyLimit =
  membership === "starter"
    ? 2
    : 999;

if (
  user.dailySurveyStats.count >=
  surveyLimit
) {

  return res.send(
    "daily limit reached"
  );

}

user.dailySurveyStats.count += 1;

  if (!user) return res.send("user not found");

  user.wallet = Math.max(0, user.wallet - Number(amount_local));

  await user.save();

  await Task.create({
    userId: user_id,
    type: "survey_reversal",
    reward: -amount_local,
    status: "reversed",
    transaction_id: trans_id
  });

  return res.send("reversed handled");
}

    const user = await User.findById(user_id);
    if (!user) return res.status(404).send("user not found");

    const exists = await Task.findOne({ trans_id });
    if (exists) return res.status(200).send("duplicate");

    await Task.create({
      userId: user_id,
      type: "survey",
      reward: amount_local,
      status: "completed",
      transaction_id: trans_id
    });

    const reward = Number(amount_local);

// WALLET
user.wallet = (user.wallet || 0) + reward;

// TOTAL EARNED
user.totalEarned =
  (user.totalEarned || 0) + reward;

// TASK COUNTER
user.tasksCompleted =
  (user.tasksCompleted || 0) + 1;

// SURVEY COUNTER
user.surveysCompleted =
  (user.surveysCompleted || 0) + 1;

// DAILY EARNINGS CHART
const today =
  new Date().toISOString().split("T")[0];

if (!user.earningsHistory) {
  user.earningsHistory = [];
}

const existingDay =
  user.earningsHistory.find(
    item => item.date === today
  );

if (existingDay) {

  existingDay.amount += reward;

} else {

  user.earningsHistory.push({
    date: today,
    amount: reward
  });

}

// RECENT ACTIVITY
await Transaction.create({

  userId: user._id,

  type: "survey",

  amount: reward,

  status: "completed",

  description:
    "CPX Survey Completed"

});

await user.save();

res.status(200).send("ok");

  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

module.exports = router;