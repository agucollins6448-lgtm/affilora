const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const crypto = require("crypto");
const ActivationCode = require("../models/ActivationCode");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const WalletAdjustment = require("../models/WalletAdjustment");

const {
  loginAdmin,
  getAllUsers,
  getAllCodes,
  createCode,
  confirmCodePayment,
  adjustWallet,
  changePassword,
  deleteAllLogs
} = require(
  "../controllers/adminController"
);

router.post(
  "/login",
  loginAdmin
);

router.get(
  "/users",
  adminMiddleware,
  getAllUsers
);

router.get(
  "/codes",
  adminMiddleware,
  getAllCodes
);

router.post(
  "/codes",
  adminMiddleware,
  createCode
);

router.put(
  "/codes/confirm/:id",
  adminMiddleware,
  confirmCodePayment
);

router.put(
  "/users/wallet/:id",
  adminMiddleware,
  adjustWallet
);

router.put(
  "/change-password",
  adminMiddleware,
  changePassword
);

router.delete(
  "/logs",
  adminMiddleware,
  deleteAllLogs
);

router.delete("/users/:id", adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.put("/users/toggle-membership/:id", adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);

  user.membershipActive = !user.membershipActive;

  await user.save();

    await AdminLog.create({

  action:
    user.membershipActive
      ? "User Active"
      : "User Inactive",

  targetUser:
    user._id,

  details:
    user.fullName

});

  const io = req.app.get("io");

  io.emit("userUpdated");

  io.emit("adminLogUpdated");

  res.json(user);
});

router.put("/users/membership-reset/:id", adminMiddleware, async (req, res) => {
    const user = await User.findById(req.params.id);

    user.membershipTier = "Starter";
    user.membershipActivatedAt = null;

    if(user.membershipTier === "Starter"){
      return;
    }

    await user.save();

        await AdminLog.create({

  action: "Membership Reset",

  targetUser:
    user._id,

  details:
    user.fullName

});

  const io = req.app.get("io");

  io.emit("userUpdated");

  io.emit("adminLogUpdated");

    res.json({
      success: true
    });
}
);

router.put("/users/ban/:id", adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);

  user.isBanned = !user.isBanned;

  await user.save();

  await AdminLog.create({

  action:
    user.isBanned
      ? "User Banned"
      : "User Unbanned",

  targetUser:
    user._id,

  details:
    user.fullName

});

const io = req.app.get("io");

io.emit("userUpdated");

io.emit("adminLogUpdated");

  res.json({
    message: "User Status Changed",
    user,
    
});
});

router.post("/generate-codes", adminMiddleware, async (req, res) => {
  const { count } = req.body;

  let codes = [];

  for (let i = 0; i < count; i++) {
    codes.push({
      code: crypto.randomBytes(5).toString("hex").toUpperCase(),
      used: false,
      paymentConfirmed: true
    });
  }

  const created = await ActivationCode.insertMany(codes);

  res.json({
    message: `${count} codes generated`,
    created
  });
});

router.get("/transactions", adminMiddleware, async (req, res) => {
  const transactions = await Transaction.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.json(transactions);
});

router.get("/analytics", adminMiddleware, async (req, res) => {
  const users = await User.countDocuments();

  const revenue = await Transaction.aggregate([
    { $match: { status: "success" } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);

  const withdrawals = await Transaction.find({
    type: "withdrawal"
  });

  res.json({
    totalUsers: users,
    revenue,
    totalWithdrawals: withdrawals.length
  });
});

router.get(
  "/notifications",
  adminMiddleware,
  async (req, res) => {

    const notifications =
await Notification.find()

.populate(
  "targetUser",
  "fullName email membershipTier"
)

.sort({
  createdAt: -1
});

const io = req.app.get("io");

io.emit("notificationUpdated");

    res.json(
      notifications
    );

  }
);

router.post(
  "/notifications",
  adminMiddleware,
  async (req, res) => {

    try {

      const {

        title,
        message,

        sendToAll,

        targetTier,

        targetUser

      } = req.body;

      const notification =
        await Notification.create({

          title,

          message,

          sendToAll:
            sendToAll || false,

          targetTier:
            targetTier || null,

          targetUser:
            targetUser || null,

          senderType:
            "admin"

        });

        let usersToEmail = [];

        if (sendToAll) {

  usersToEmail =
    await User.find({
      emailNotifications: true
    });

}
else if (targetTier) {

  usersToEmail =
    await User.find({

      membershipTier:
        targetTier,

      emailNotifications:
        true

    });

}
else if (targetUser) {

  usersToEmail =
    await User.find({

      _id:
        targetUser,

      emailNotifications:
        true

    });

}

for (const user of usersToEmail) {

  await sendEmail(

    user.email,

    title,

    message

  );

}

await AdminLog.create({

  action:
    "Notification Sent",

  details:
    title

});

const io = req.app.get("io");


io.emit(
  "notificationUpdated"
);

io.emit(
  "adminLogUpdated"
)

      res.json(notification);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

router.delete(
  "/notifications/:id",
  adminMiddleware,
  async (req,res) => {

    await Notification.findByIdAndDelete(
      req.params.id
    );

    await AdminLog.create({

  action:
    "Notification Deleted",

  details:
    title

});

const io = req.app.get("io");


    io.emit("notificationUpdated")

    io.emit("adminLogUpdated")

    res.json({
      message:"Deleted"
    });

  }
);

router.get(
  "/logs",
  adminMiddleware,
  async (req, res) => {

    const logs =
      await AdminLog.find()
      .populate("targetUser")
      .sort({
        createdAt: -1
      });

      const io = req.app.get("io");

      io.emit("adminLogUpdated")

    res.json(logs);

  }
);

router.get(
  "/wallet-history",
  adminMiddleware,
  async (req, res) => {

    try {

      const history =
        await WalletAdjustment.find()
        .populate("user")
        .sort({
          createdAt: -1
        });

      res.json(history);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);

module.exports = router;