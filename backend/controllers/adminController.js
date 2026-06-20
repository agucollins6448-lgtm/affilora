const Admin = require("../models/Admin");
const AdminLog = require("../models/AdminLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");
const ActivationCode = require("../models/ActivationCode");
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const WalletAdjustment = require("../models/WalletAdjustment");


exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Username:", username);

    const admin = await Admin.findOne({ username });
console.log("Admin found:", admin);

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );
console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getAllUsers =
async (req, res) => {

  try {

    const users =
      await User.find()
      .populate(
        "referredBy",
        "fullName username"
      )
      .sort({
        createdAt: -1
      });

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.getAllCodes =
async (req, res) => {

  try {

    const codes =
      await ActivationCode.find()
      .sort({ createdAt: -1 });

    res.json(codes);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.createCode =
async (req, res) => {

  try {

    const { code } = req.body;

    const existing =
      await ActivationCode.findOne({
        code
      });

    if (existing) {

      return res.status(400).json({
        message:
          "Code already exists"
      });

    }

    const newCode =
      await ActivationCode.create({

        code,

        used: false,

        paymentConfirmed: false

      });

    res.status(201).json(
      newCode
    );

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.confirmCodePayment = async (req, res) => {

  try {

    const { id } = req.params;

    const code = await ActivationCode.findById(id);

    if (!code) {
      return res.status(404).json({
        message: "Code not found"
      });
    }

    code.paymentConfirmed = true;

    await code.save();

    res.json({
      message: "Payment confirmed",
      code
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.adjustWallet =
async (req, res) => {

  try {

    const {
      amount,
      action
    } = req.body;

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    if (action === "add") {

      user.walletBalance += amount;

    } else {

      if (
        user.walletBalance < amount
      ) {

        return res.status(400).json({
          message:
            "Insufficient balance"
        });

      }

      user.walletBalance -= amount;

    }

    await user.save();

    await WalletAdjustment.create({

  user: user._id,

  action,

  amount,

  admin: req.admin?.id || null

});

    await Transaction.create({

  user: user._id,

  type: "admin",

  amount,

  status: "success",

  description:
    action === "add"
      ? "Admin wallet credit"
      : "Admin wallet debit"

});

await Notification.create({

  title:
    "Wallet Adjustment",

  message:
    action === "add"
      ? `₦${amount} has been added to your wallet.`
      : `₦${amount} has been deducted from your wallet.`,

  targetUser:
    user._id,

  senderType:
    "system"

});

await AdminLog.create({

  action:
    action === "add"
      ? "Wallet Credited"
      : "Wallet Debited",

  targetUser:
    user._id,

  details:
    `₦${amount}`

});

const io = req.app.get("io");

io.to(user._id.toString())
  .emit("notificationUpdated");

io.to(user._id.toString())
  .emit("transactionUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

io.emit("adminLogUpdated");


    res.json({
      message:
        "Wallet updated"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword
    } = req.body;

    const admin = req.admin;

    const match =
      await bcrypt.compare(
        currentPassword,
        admin.password
      );

    if (!match) {
      return res.status(400).json({
        message:
          "Current password is incorrect"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters"
      });
    }

    admin.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await admin.save();

    res.json({
      message:
        "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.deleteAllLogs =
async (req, res) => {

  try {

    await AdminLog.deleteMany({});

    res.json({
      message:
        "All activity logs deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};