const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const generateWithdrawalReceipt = require("../utils/generateWithdrawalReceipt");

const Transaction =
require("../models/Transaction");

const Withdrawal =
require("../models/Withdrawal");

const User =
require("../models/User");

const Notification = 
require("../models/Notification");

const sendEmail =
require("../utils/sendEmail");

const AdminLog =
require("../models/AdminLog");


exports.requestWithdrawal =
async (req, res) => {

  try {
const userId = req.user.id;

const { amount } = req.body;

const today = new Date();

const dayOfMonth =
  today.getDate();

const isSecondWeek =
  dayOfMonth >= 8 &&
  dayOfMonth <= 14;

const isFourthWeek =
  dayOfMonth >= 22;

if (!isSecondWeek && !isFourthWeek) {
  return res.status(400).json({
    message:
      "Withdrawals are only available during the 2nd and 4th week of the month"
  });
}

if (!amount || isNaN(amount)) {
  return res.status(400).json({
    message: "Invalid amount"
  });
}

if (Number(amount) < 1500) {
  return res.status(400).json({
    message:
      "Minimum withdrawal amount is ₦1,500"
  });
}

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    } 

    const previousSuccessfulWithdrawal =
  await Withdrawal.findOne({

    user: userId,

    status: "success"

  });

const isFirstWithdrawal =
  !previousSuccessfulWithdrawal;

if (
  isFirstWithdrawal &&
  amount < 15000
) {

  return res.status(400).json({

    message:
      "First withdrawal must be at least ₦15,000"

  });

}

if(
  isFirstWithdrawal &&
  amount > 15000
){
  return res.status(400).json({

    message:
      "Maximum withdrawal must not be more than ₦15,000"

  }); 
}

const limits = {

  Starter: {
    minBalance: 5000,
    minWithdrawalAmount: 1500,
    maxPerWithdrawal: 1500
  },

  Bronze: {
    minBalance: 7500,
    minWithdrawalAmount: 1500,
    maxPerWithdrawal: 4500
  },

  Silver: {
    minBalance: 10000,
    minWithdrawalAmount: 1500,
    maxPerWithdrawal: 5500
  },

  Gold: {
    minBalance: 12500,
    minWithdrawalAmount: 1500,
    maxPerWithdrawal: 6500
  },

  Premium: {
    minBalance: 15000,
    minWithdrawalAmount: 1500,
    maxPerWithdrawal: 10000
  }

};

const tier =
  user.membershipTier || "Starter";

const tierLimits =
  limits[tier];

    const bankName = user.bank?.name;
    const accountName = user.bank?.accountName;
    const accountNumber = user.bank?.accountNumber;

if(bankName && accountName && accountNumber === null){
  return res.status(400).json({

    message:
      "Fill out your account details before proceeding to withdraw"

  }); 
}
    
if (
  !isFirstWithdrawal &&
  amount < tierLimits.minWithdrawalAmount
) {
  return res.status(400).json({
    message:
      `Minimum withdrawal amount is ₦${tierLimits.minWithdrawalAmount.toLocaleString()}`
  });
}

    if (
      user.walletBalance < amount
    ) {

      return res.status(400).json({
        message:
          "Insufficient balance"
      });

    }

    if (
  !isFirstWithdrawal &&
  user.walletBalance <
    tierLimits.minBalance
) {

  return res.status(400).json({

    message:
      `You need at least ₦${tierLimits.minBalance.toLocaleString()} in your wallet before withdrawing`

  });

}

if (
  !isFirstWithdrawal && 
  amount >
  tierLimits.maxPerWithdrawal
) {

  return res.status(400).json({

    message:
      `Maximum withdrawal per request is ₦${tierLimits.maxPerWithdrawal.toLocaleString()}`

  });

}
    
    

let startOfWeek;
let endOfWeek;

if (dayOfMonth >= 8 && dayOfMonth <= 14) {

  startOfWeek =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      8
    );

  endOfWeek =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      14,
      23,59,59
    );

} else {

  startOfWeek =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      22
    );

  endOfWeek =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,59,59
    );

}

// check ANY withdrawal in that window
const existingRequest = await Withdrawal.findOne({
  user: userId,
  createdAt: { $gte: startOfWeek, $lte: endOfWeek }
});

if (existingRequest) {
  return res.status(400).json({
    message: "You can only make one withdrawal during the withdrawal week"
  });
}



const slipNumber =
  "WD" + Date.now();

  const withdrawal = await Withdrawal.create({
  user: userId,

  amount,

  bankName,

  accountName,

  accountNumber,

  slipNumber,

  status: "pending"
});

await Transaction.create({
  user: userId,

  withdrawalId: withdrawal._id,

  type: "withdrawal",

  amount,

  status: "pending",

  description: "Withdrawal request submitted"
});

const io = req.app.get("io");

io.to(user._id.toString())
  .emit("withdrawalUpdated");

io.to(user._id.toString())
  .emit("transactionUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

    res.status(201).json({

  message:
    "Withdrawal request submitted",

  slipNumber,

  

});

  } catch (error) {
  console.log(error);

  res.status(500).json({
    message: error.message
  });
}

};

exports.getWithdrawals =
async (req, res) => {

  try {

    const withdrawals =
      await Withdrawal.find()
      .populate("user");

    const io = req.app.get("io");

io.to(user._id.toString())
  .emit("withdrawalUpdated");

io.to(user._id.toString())
  .emit("transactionUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

    res.json(withdrawals);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.approveWithdrawal =
async (req, res) => {

  try {

const withdrawal =
  await Withdrawal.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate("user");

    if (!withdrawal) {

      return res.status(404).json({
        message:
          "Withdrawal not found"
      });

    }

const user = await User.findById(withdrawal.user);

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

const receiptsDir = path.join(__dirname, "../receipts");

if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir);
}

// now deduct wallet HERE
if (user.walletBalance < withdrawal.amount) {
  return res.status(400).json({
    message: "Insufficient balance"
  });
}

user.walletBalance -= withdrawal.amount;
await user.save();

withdrawal.status = "success";
await withdrawal.save();

const receiptPath = path.join(
  receiptsDir,
  `Affilora-Receipt-${withdrawal._id}.pdf`
);

await generateWithdrawalReceipt(
  withdrawal,
  receiptPath
);

const uploadResult =
  await cloudinary.uploader.upload(
    receiptPath,
    {
      resource_type: "raw",
      folder: "affilora-receipts"
    }
  );

withdrawal.receiptPath =
  uploadResult.secure_url;

withdrawal.receiptPublicId =
  uploadResult.public_id;

await withdrawal.save();

fs.unlinkSync(receiptPath);

await Transaction.findOneAndUpdate(
  {
    user: withdrawal.user,

    withdrawalId: withdrawal._id,

    type: "withdrawal",

    status: "pending"
  },
  {
    status: "success",
    description: "Withdrawal approved"
  }
);

await Notification.create({

title:
"Withdrawal Approved",

message:
`Hello, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}. Your withdrawal request has been approved. Earn securely with Affilora!`,

targetUser:
user._id,

senderType:
"system"

});

if (user.emailNotifications) {

await sendEmail(
  user.email,
  "Withdrawal Approved",
  `
    <h2>Affilora</h2>
    <p>Hello ${user.fullName.split(" ")[0]},</p>

    <p>Your withdrawal request of ₦${withdrawal.amount} has been approved.</p>

    <p>Your receipt is attached below.<br><br>
    Thank you for using Affilora.</p>
  `,
  [
    {
      filename: `Affilora-Receipt-${withdrawal._id}.pdf`,
      path: receiptPath
    }
  ]
);

}

await AdminLog.create({

  action:
    "Withdrawal Approved",

  targetUser:
    user._id,

  details:
    `₦${withdrawal.amount}`

});

const io = req.app.get("io");


io.to(user._id.toString())
  .emit("notificationUpdated");

io.emit("withdrawalUpdated");

io.to(user._id.toString())
  .emit("transactionUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

io.emit("adminLogUpdated");

res.json({
  message: "Withdrawal approved"
});


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.rejectWithdrawal =
async (req, res) => {

  try {

    const withdrawal =
      await Withdrawal.findById(
        req.params.id
      );

    if (!withdrawal) {
      return res.status(404).json({
        message: "Withdrawal not found"
      });
    }

    const user =
  await User.findById(
    withdrawal.user
  );

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

    withdrawal.status =
      "rejected";

    await withdrawal.save();

    await Transaction.findOneAndUpdate(
      {
        withdrawalId:
          withdrawal._id,

        type: "withdrawal"
      },
      {
        status: "rejected",
        description:
          "Withdrawal rejected"
      }
    );
    
    await Notification.create({
    
    title:
    "Withdrawal Rejected",
    
    message:
    `Hello, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}. Your withdrawal request could not be processed. Thank you for using Affilora.`,
    
    targetUser:
    user._id,

    senderType:
    "system"
    
    });

if (user.emailNotifications) {

await sendEmail(

  user.email,

  "Withdrawal Rejected",

  `
  <h2>Affilora</h2>

  <p>Hello ${user.fullName.split(" ")[0]},</p>

  <p>Your withdrawal request of ₦${withdrawal.amount.toLocaleString()} could not be processed.</p>

  <p>Thank you for using Affilora.</p>
  `
);

}

await AdminLog.create({

  action:
    "Withdrawal Rejected",

  targetUser:
    user._id,

  details:
    `₦${withdrawal.amount}`

});

const io = req.app.get("io");

io.to(user._id.toString())
  .emit("notificationUpdated");

io.emit("withdrawalUpdated");

io.to(user._id.toString())
  .emit("transactionUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

io.emit("adminLogUpdated");

    res.json({
      message:
        "Withdrawal rejected"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};