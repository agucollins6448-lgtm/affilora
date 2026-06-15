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
      .sort({ createdAt: -1 });

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


io.emit(
  "walletHistoryUpdated"
);

io.emit(
  "userUpdated"
);
  
io.emit(
  "transactionUpdated"
);

io.emit(
  "notificationUpdated"
);

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

exports.generateUsersReport =
async (req, res) => {

  const users = await User.find();

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=users-report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(20)
    .text("Affilora Users Report");

  doc.moveDown();

  users.forEach((user) => {

    doc.text(
      `${user.fullName} | ${user.email} | ${user.membershipTier} | ₦${user.walletBalance}`
    );

  });

  doc.end();

};

exports.generateTransactionsReport =
async (req, res) => {

  const transactions =
    await Transaction.find()
    .populate("user")
    .sort({ createdAt: -1 });

  const doc =
    new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=transactions-report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .text(
      "AFFILORA TRANSACTIONS REPORT"
    );

  doc.moveDown();

  transactions.forEach((t) => {

    doc.text(
      `${t.user?.fullName || "Unknown"} | ${t.type} | ₦${t.amount} | ${t.status}`
    );

  });

  doc.end();

};

exports.generateWithdrawalsReport =
async (req, res) => {

  const withdrawals =
    await Withdrawal.find()
    .populate("user")
    .sort({ createdAt: -1 });

  const doc =
    new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=withdrawals-report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .text(
      "AFFILORA WITHDRAWALS REPORT"
    );

  doc.moveDown();

  withdrawals.forEach((w) => {

    doc.text(
      `${w.user?.fullName || "Unknown"} | ₦${w.amount} | ${w.status}`
    );

  });

  doc.end();

};

exports.generateMembershipReport =
async (req, res) => {

  const users =
    await User.find()
    .sort({ membershipTier: 1 });

  const doc =
    new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=membership-report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .text(
      "AFFILORA MEMBERSHIP REPORT"
    );

  doc.moveDown();

  users.forEach((u) => {

    doc.text(
      `${u.fullName} | ${u.membershipTier} | Active: ${u.membershipActive}`
    );

  });

  doc.end();

};

exports.generateFinancialReport =
async (req, res) => {

  const users =
    await User.find();

  const withdrawals =
    await Withdrawal.find({
      status: "success"
    });

  const transactions =
    await Transaction.find();

  const totalUsers =
    users.length;

  const totalEarned =
    users.reduce(
      (sum, u) =>
        sum + (u.totalEarned || 0),
      0
    );

  const totalWithdrawn =
    withdrawals.reduce(
      (sum, w) =>
        sum + w.amount,
      0
    );

  const totalReferrals =
    transactions
      .filter(
        t =>
          t.type === "referral"
      )
      .reduce(
        (sum, t) =>
          sum + t.amount,
        0
      );

  const totalAds =
    transactions
      .filter(
        t =>
          t.type === "ads"
      )
      .reduce(
        (sum, t) =>
          sum + t.amount,
        0
      );

  const totalSurveys =
    transactions
      .filter(
        t =>
          t.type === "survey"
      )
      .reduce(
        (sum, t) =>
          sum + t.amount,
        0
      );

  const doc =
    new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=financial-report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .text(
      "AFFILORA FINANCIAL REPORT"
    );

  doc.moveDown();

  doc.text(
    `Total Users: ${totalUsers}`
  );

  doc.text(
    `Total Earnings: ₦${totalEarned.toLocaleString()}`
  );

  doc.text(
    `Total Withdrawals: ₦${totalWithdrawn.toLocaleString()}`
  );

  doc.text(
    `Referral Bonuses: ₦${totalReferrals.toLocaleString()}`
  );

  doc.text(
    `Ad Rewards: ₦${totalAds.toLocaleString()}`
  );

  doc.text(
    `Survey Rewards: ₦${totalSurveys.toLocaleString()}`
  );

  doc.moveDown();

  doc.text(
    `Generated: ${new Date().toLocaleString()}`
  );

  doc.end();

};

exports.generateUserPdf =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    const transactions =
      await Transaction.find({
        user: user._id
      });

    const totalEarned =
      transactions
        .filter(t =>
          [
            "task",
            "ads",
            "survey",
            "referral"
          ].includes(t.type)
        )
        .reduce(
          (sum, t) =>
            sum + Number(t.amount || 0),
          0
        );

    const totalWithdrawn =
      transactions
        .filter(
          t =>
            t.type === "withdrawal"
        )
        .reduce(
          (sum, t) =>
            sum + Number(t.amount || 0),
          0
        );

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.username}-profile.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text(
        "AFFILORA USER REPORT"
      );

    doc.moveDown();

    doc.fontSize(14);

    doc.text(
      `Name: ${user.fullName}`
    );

    doc.text(
      `Username: ${user.username}`
    );

    doc.text(
      `Email: ${user.email}`
    );

    doc.text(
      `Phone: ${user.phone}`
    );

    doc.text(
      `Tier: ${user.membershipTier}`
    );

    doc.text(
      `Wallet Balance: ₦${user.walletBalance}`
    );

    doc.text(
      `Total Earned: ₦${totalEarned}`
    );

    doc.text(
      `Total Withdrawn: ₦${totalWithdrawn}`
    );

    doc.text(
      `Referrals: ${user.referralsCount || 0}`
    );

    doc.text(
      `Referral Earnings: ₦${user.referralEarnings || 0}`
    );

    doc.moveDown();

    doc.text("BANK DETAILS");

    doc.text(
      `Bank: ${user.bank?.name || "N/A"}`
    );

    doc.text(
      `Account Name: ${user.bank?.accountName || "N/A"}`
    );

    doc.text(
      `Account Number: ${user.bank?.accountNumber || "N/A"}`
    );

    doc.text(
      `Currency: ${user.bank?.currency || "NGN"}`
    );

    doc.moveDown();

    doc.text(
      `Generated: ${new Date().toLocaleString()}`
    );

    doc.end();

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};