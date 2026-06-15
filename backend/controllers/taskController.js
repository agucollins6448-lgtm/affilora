const Notification =
require("../models/Notification");

const Transaction =
require("../models/Transaction");

const Task =
require("../models/Task");

const User =
require("../models/User");

const CompletedTask =
require("../models/CompletedTask");


const MEMBERSHIP_BENEFITS = {
  Starter: {
    adReward: 40,
    surveys: true
  },

  Bronze: {
    adReward: 80,
    surveys: true
  },

  Silver: {
    adReward: 120,
    surveys: true
  },

  Gold: {
    adReward: 160,
    surveys: true
  },

  Premium: {    
    adReward: 220,
    surveys: true
  }
};

const SURVEY_REWARDS = {
  Starter: 50,
  Bronze: 100,
  Silver: 150,
  Gold: 200,
  Premium: 250
};

exports.createTask =
async (req, res) => {

  try {

    const {

      userId,

      type

    } = req.body;

    // Prevent duplicate daily ad rewards
    if (type === "ads") {

      const todayAds =
  await Task.countDocuments({

    userId,

    type: "ads",

    createdAt: {

      $gte: new Date(
        new Date().setHours(
          0,0,0,0
        )
      )

    }

  });

if (todayAds >= 3) {

  return res.status(400).json({

    message:
      "Daily ad limit reached"

  });

}
    }

    const task =
      await Task.create(req.body);

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

exports.getTasks = async (req, res) => {

  try {

    const { userId } = req.query;

    const tasks =
      await Task.find({

        userId

      }).sort({

        createdAt: -1

      });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.completeTask =
async (req, res) => {

  try {

    const {
      userId,
      taskId
    } = req.body;

    const task =
      await Task.findById(taskId);

    const user =
      await User.findById(userId);

    if (!task || !user) {

      return res.status(404).json({
        message:
          "Task or user not found"
      });

    }

    const existing =
      await CompletedTask.findOne({

        user: userId,

        task: taskId

      });

    if (existing) {

      return res.status(400).json({
        message:
          "Task already completed"
      });

    }

    await CompletedTask.create({

      user: userId,

      task: taskId,

      earnedAmount:
        task.reward

    });

    user.walletBalance += task.reward;
    user.totalEarned += task.reward;

    await user.save();

    await Notification.create({

  title:
    "Task Reward Earned",

  message:
    `You earned ₦${task.reward} from completing ${task.title}`,

  targetUser: userId,

  senderType:
  "system"

});

    await Transaction.create({

  user: userId,

  type: "task",

  amount: task.reward,

  status: "success",

  description:
    `Earned from task: ${task.title}`

});

const io = req.app.get("io");

io.emit("userUpdated")

io.emit("notificationUpdated");

io.emit("transactionUpdated");

    res.json({

      message:
        "Task completed successfully",

      earned:
        task.reward

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.watchAdReward = async (req, res) => {

  try {

    const { userId } = req.body;

    const user =
      await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // START OF TODAY
    const today =
      new Date();

    today.setHours(0,0,0,0);

    // COUNT TODAY'S ADS
    const adsToday =
      await Task.countDocuments({

        userId,

        type: "ads",

        createdAt: {
          $gte: today
        }

      });

    // DAILY LIMIT
    const tier =
    user.membershipTier || "Starter";

    const benefits =
    MEMBERSHIP_BENEFITS[tier];

    if (adsToday >= 3) {

      return res.status(400).json({
        message:
          "Daily ad limit reached"
      });

    }

    // CREATE TASK RECORD
    const task =
      await Task.create({

        userId,

        type: "ads",

        reward: benefits.adReward,

        status: "completed"

      });

    // UPDATE WALLET
user.walletBalance += benefits.adReward;
user.totalEarned += benefits.adReward;
    await user.save();

    // CREATE TRANSACTION
    await Transaction.create({
  user: userId,
  type: "ads",
  amount: benefits.adReward,
  status: "success",
  description: "Ad reward"
});

    // CREATE NOTIFICATION
    await Notification.create({

      title: "Ad Reward Earned",

      message:
        `You earned ₦${benefits.adReward} from watching an ad`,

      targetUser: userId,

      senderType:
      "system"

    });

    const io = req.app.get("io");

    io.emit("userUpdated")

    io.emit("notificationUpdated");

    io.emit("transactionUpdated");

    res.json({

      message:
        "Ad reward granted",

      task

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.surveyReward = async (req, res) => {
  try {

    const { userId } = req.body;

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const surveysToday =
      await Task.countDocuments({

        userId,

        type: "survey",

        createdAt: {
          $gte: today
        }

      });

    if (surveysToday >= 2) {
      return res.status(400).json({
        message:
          "Daily survey limit reached"
      });
    }

    const reward =
      SURVEY_REWARDS[
        user.membershipTier || "Starter"
      ];

    const task =
      await Task.create({

        userId,

        type: "survey",

        reward,

        status: "completed"

      });

user.walletBalance += reward;
user.totalEarned += reward;
    await user.save();

    await Transaction.create({

      user: userId,

      type: "survey",

      amount: reward,

      status: "success",

      description:
        "Survey reward"

    });

    await Notification.create({


      title: "Survey Reward Earned",

      message:
        `You earned ₦${reward} from a survey`,

      targetUser: userId,

      senderType:
      "system"

    });

    const io = req.app.get("io");

    io.emit("userUpdated")

    io.emit("notificationUpdated");

    io.emit("transactionUpdated");

    res.json({

      message:
        "Survey reward granted",

      reward,

      task

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};