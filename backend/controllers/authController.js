const crypto = require("crypto");
const mongoose = require("mongoose");
const ActivationCode = require("../models/ActivationCode");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const Withdrawal = require("../models/Withdrawal");
const sendEmail = require("../utils/sendEmail");
const {uploadToCloudinary} = require("../middleware/upload");


exports.registerUser = async (req, res) => {

  try {

    const {
      fullName,
      username,
      email,
      phone,
      password,
      referredBy,
      activationCode: activationCodeInput
    } = req.body;

    // 1. Check user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Validate activation code
    const activationCode = await ActivationCode.findOne({
      code: activationCodeInput
    });

    if (!activationCode) {
      return res.status(400).json({ message: "Invalid activation code" });
    }

    // ❌ MUST NOT allow unpaid codes
    if (!activationCode.paymentConfirmed) {
  return res.status(400).json({
    message: "This code is not yet activated. Payment required."});
    }

    if (activationCode.used) {
      return res.status(400).json({ message: "Activation code already used" });
    }

        if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create referral code
    const referralCode = crypto.randomBytes(4).toString("hex");

    let referrer = null;

if (referredBy) {

  referrer = await User.findOne({
    referralCode: referredBy.trim()
  });

}

    // 5. Create user
const user = await User.create({
  fullName,
  username,
  email,
  phone,
  password: hashedPassword,
  referralCode,

  referredBy: referrer
    ? referrer._id
    : null,

  membershipActive: true
});
await Notification.create({

title:
"Welcome Message",

message:
`Welcome to Affilora, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}! Complete tasks, refer friends and start earning today!`,

targetUser:
user._id,

senderType:
"system"

});

if (user.emailNotifications) {

await sendEmail(

  user.email,

  "Welcome Message",

  `
  <h2>Affilora</h2>

  <p>Hello ${user.fullName.split(" ")[0]},</p>

  <p>Welcome to Affilora! Complete tasks, refer friends, increase earning opportunities, and reach out to our support team if you have any issues, feedback, or suggestions.</p>

  <p>
    Earn securely with Affilora!
  </p>

  `
);

}
const io = req.app.get("io");


io.to(user._id.toString())
  .emit("notificationUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

    // 6. Process referral reward (FIXED)


  if (referrer) {

    // UPDATE REFERRAL STATS
    referrer.referralEarnings =
      (referrer.referralEarnings || 0) + 1500;

    referrer.referralsCount =
      (referrer.referralsCount || 0) + 1;

    // ADD MONEY TO WALLET
    referrer.walletBalance =
      (referrer.walletBalance || 0) + 1500;

      referrer.totalEarned =
  (referrer.totalEarned || 0) + 1500;

    await referrer.save();

await Transaction.create({
  user: referrer._id,
  type: "referral",
  amount: 1500,
  status: "success",
  description: "Referral bonus"
});

await Notification.create({

  title:
    "Referral Bonus",

  message:
    `You earned ₦1500 for referring a new member`,

  targetUser:
    referrer._id,

  relatedUser:
    referrer._id,

  senderType:
    "system"

});

const io = req.app.get("io");

io.to(referrer._id.toString())
  .emit("userUpdated");

io.to(referrer._id.toString())
  .emit("referralUpdated");

io.to(referrer._id.toString())
  .emit("notificationUpdated");

io.to(referrer._id.toString())
  .emit("transactionUpdated");


    console.log(
      "Referral reward added to:",
      referrer.username
    );

  } else {

    console.log(
      "NO REFERRER FOUND FOR CODE:",
      referredBy
    );

  }



    // 7. Mark activation code used
    activationCode.used = true;
    activationCode.usedBy = user._id;
    await activationCode.save();

    return res.status(201).json({
      message: "Registration successful",
      user
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
exports.loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (user.isBanned) {
  return res.status(403).json({
    message: "Your account has been banned"
  });
}

    const token = jwt.sign(

      {
        id: user._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    res.json({
  token,
  user: {
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    profileImage: user.profileImage,
  referralCode: user.referralCode,
  referralEarnings: user.referralEarnings,
  referralsCount: user.referralsCount,
  membershipActive: user.membershipActive
  }
});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.changePassword =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({

        message:
          "User not found"

      });

    }

    const {

      currentPassword,

      newPassword

    } = req.body;

    const isMatch =
      await bcrypt.compare(

        currentPassword,

        user.password

      );

    if (!isMatch) {

      return res.status(400).json({

        message:
          "Current password is incorrect"

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

await Notification.create({

title:
"Password Reset",

message:
`Your password has been reset successfully. Earn securely with Affilora.`,

targetUser:
user._id,

senderType:
"system"

});

if (user.emailNotifications) {

await sendEmail(

  user.email,

  "Password Reset",

  `
  <h2>Affilora</h2>

  <p>Hello ${user.fullName.split(" ")[0]},</p>

  <p>Your password has been reset successfully.</p>

  <p>
    Earn securely with Affilora.
  </p>

  `
);

}

const io = req.app.get("io");

io.to(user._id.toString())
  .emit("notificationUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

    res.json({

      message:
        "Password changed successfully"

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message

    });

  }

};

exports.uploadProfileImage =
async (req, res) => {

  console.log(req.file);

  try {

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

const result =
  await uploadToCloudinary(
    req.file.buffer
  );

user.profileImage =
  result.secure_url;

    await user.save();

    const io = req.app.get("io");

io.to(user._id.toString())
  .emit("userUpdated");

    res.json({
      message: "Profile image updated",
      image: result.secure_url
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id; // depends on your auth middleware

    const {
      fullName,
      email,
      phone,
      username,
      emailNotif,
      cardHolder,
      cardNumber,
      cardExpiry,
      bankName,
      accountNumber,
      accountName,
      currency
    } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName;
    user.email = email;
    user.phone = phone;
    user.username = username;
    user.emailNotifications = emailNotif;
   const cleanedNumber = (cardNumber || "").replace(/\s/g, "");

const maskedNumber =
  cleanedNumber.length >= 8
    ? cleanedNumber.slice(0, 4) +
      " **** **** " +
      cleanedNumber.slice(-4)
    : "";

user.card = {
  holder: cardHolder || "",
  number: cardNumber || "",
  expiry: cardExpiry || ""
};

    user.bank = {
      name: bankName || "",
      accountNumber: accountNumber || "",
      accountName: accountName || "",
      currency: currency || "NGN"
    };

    await user.save();

    const io = req.app.get("io");

io.to(user._id.toString())
.emit(
  "userUpdated",
  user
);

    res.json(user);

  } catch (err) {
    console.log("UPDATE SETTINGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {

const user = await User.findById(
  req.user.id
)
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
// TODAY EARNINGS
const toLagosDate = (date) =>
  new Date(
    new Date(date).toLocaleString(
      "en-US",
      { timeZone: "Africa/Lagos" }
    )
  );

const now = toLagosDate(new Date());

    // TOTAL EARNED
    const transactions =
  await Transaction.find({
    user: user._id
  })
  .sort({ createdAt: -1 });

// TOTAL EARNED
const totalEarned = user.totalEarned || 0;

// TASKS COMPLETED (ONLY TASK TYPE)
const taskTransactions = transactions.filter(
  t => t.type === "task" || t.type === "ads"
);

const tasksCompleted = taskTransactions.length;
taskTransactions.forEach(t => {
  const lagosDate = toLagosDate(t.createdAt);


});
const todayTaskRevenue = taskTransactions
  .filter(t =>
    toLagosDate(t.createdAt).toDateString() ===
    now.toDateString()
  )
  .reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

const firstDayOfWeek = new Date(now);

firstDayOfWeek.setHours(0, 0, 0, 0);

firstDayOfWeek.setDate(
  now.getDate() - now.getDay()
);

const weeklyTaskRevenue = taskTransactions
  .filter(
    t =>
      toLagosDate(t.createdAt) >=
      firstDayOfWeek
  )
  .reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

const monthlyTaskRevenue = taskTransactions
  .filter(t => {

    const date =
      toLagosDate(t.createdAt);

    return (
      date.getMonth() ===
        now.getMonth() &&
      date.getFullYear() ===
        now.getFullYear()
    );

  })
  .reduce(
    (sum, t) =>
      sum + Number(t.amount || 0),
    0
  );

const startOfToday = new Date(now);

startOfToday.setHours(
  0, 0, 0, 0
);

const tasksToday = taskTransactions
  .filter(
    t =>
      toLagosDate(t.createdAt) >=
      startOfToday
  )
  .length;


const todayEarnings = transactions
  .filter(
    t =>
      toLagosDate(t.createdAt) >=
      startOfToday
  )
  .filter(
    t =>
      ["task", "ads", "referral"]
        .includes(t.type)
  )
  .reduce(
    (sum, t) =>
      sum + Number(t.amount || 0),
    0
  );

// RECENT ACTIVITY
const recentActivity = transactions
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5)
  .map(t => {

    let text = "Activity";

    switch (t.type) {
      case "task":
        text = t.description || "Task Completed";
        break;

      case "ads":
        text = "Ad Reward";
        break;

      case "survey":
        text = "Survey Reward";
        break;

      case "referral":
        text = "Referral Earned";
        break;

      case "withdrawal":
        text = "Withdrawal";
        break;

      case "admin":
        text = "Wallet-Adjustment";
        break;
    }

    return {
  text,
  amount: Number(t.amount || 0),
  type: t.type === "withdrawal" ? "negative" : t.type === "admin" ? "none" : "positive", 
  createdAt: toLagosDate(t.createdAt)
};
  });

// REFERRALS THIS WEEK
  
const startOfWeek = new Date(now);
startOfWeek.setHours(0, 0, 0, 0);
startOfWeek.setDate(
  now.getDate() - now.getDay()
);

const referralTransactions =
  await Transaction.find({
    user: user._id,
    type: "referral",
    status: "success"
  });


const referralsThisWeek =
  referralTransactions.filter(t =>
    toLagosDate(t.createdAt) >= startOfWeek
  ).length;

const grouped = {};

transactions.forEach(t => {
  // ONLY income types
  if (!["task", "ads", "referral"].includes(t.type)) return;

  const lagosDate = toLagosDate(t.createdAt);

const day =
  lagosDate.getFullYear() +
  "-" +
  String(lagosDate.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(lagosDate.getDate()).padStart(2, "0");

  if (!grouped[day]) grouped[day] = 0;

  grouped[day] += Number(t.amount || 0);
});

const earningsHistory = Object.entries(grouped)
  .map(([date, amount]) => ({
    date,
    amount
  }))
  .sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  )
  .slice(-7);

  const totalWithdrawals = transactions
  .filter(t => t.type === "withdrawal" && t.status === "success")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const referralBonus =
  transactions
    .filter(
      t => t.type === "referral"
    )
    .reduce(
      (sum, t) =>
        sum + Number(t.amount || 0),
      0
    );

const taskRevenue =
  transactions
    .filter(
      t =>
        t.type === "task" ||
        t.type === "ads"  ||
        t.type === "survey"
    )
    .reduce(
      (sum, t) =>
        sum + Number(t.amount || 0),
      0
    );

    const day2 = now.getDate();

let startDate;
let endDate;

if (day2 >= 8 && day2 <= 14) {

  startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    8
  );

  endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    14,
    23,
    59,
    59
  );

} else if (day2 >= 22) {

  startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    22
  );

  endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

}

let alreadyWithdrawnThisPeriod = false;

if (startDate && endDate) {

  const withdrawal =
    await Withdrawal.findOne({

      user: user._id,

      status: {
        $in: ["pending", "success"]
      },

      createdAt: {
        $gte: startDate,
        $lte: endDate
      }

    });

  alreadyWithdrawnThisPeriod =
    !!withdrawal;

}

res.json({
  _id: user._id,
  
  fullName: user.fullName,

  email: user.email,

  phone: user.phone,

  username: user.username,

  profileImage: user.profileImage,

  emailNotifications: user.emailNotifications,

  walletBalance: user.walletBalance || 0,

  membershipTier: user.membershipTier || "starter",

  membershipActivatedAt: user.membershipActivatedAt,

  referralCode: user.referralCode,

  referralsCount: user.referralsCount || 0,
  
  referredBy: user.referredBy,

  card: user.card || null,

  bank: user.bank || null,

  totalEarned,

  tasksCompleted,

  tasksToday,

  todayEarnings,

  referralEarnings: user.referralEarnings,

  referralsThisWeek,

  earningsHistory,

  recentActivity,

  totalWithdrawals,

  referralBonus,

  taskRevenue,

  todayTaskRevenue,

  weeklyTaskRevenue,

  monthlyTaskRevenue,

  alreadyWithdrawnThisPeriod,

  transactions: transactions
  .sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
  .slice(0, 20)
});

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

exports.getMyReferrals = async (req, res) => {
  try {
    const referrals = await User.find({
      referredBy: req.user.id
    })

    res.json(referrals);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
