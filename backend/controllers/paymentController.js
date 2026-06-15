const Transaction =
require("../models/Transaction");

const PaymentProof =
require("../models/PaymentProof");

const User =
require("../models/User");

exports.uploadProof =
async (req, res) => {

  try {

    const payment =
      await PaymentProof.create({

        user: req.body.user,

        vendor: req.body.vendor,

        amount: req.body.amount,

        screenshot: req.file.path

      });

    res.status(201).json({

      message:
        "Payment proof uploaded",

      payment

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.getPayments =
async (req, res) => {

  try {

    const payments =
      await PaymentProof.find()
      .populate("user")
      .populate("vendor");

    res.json(payments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.approvePayment =
async (req, res) => {

  try {

    const payment =
      await PaymentProof.findById(
        req.params.id
      );

    if (!payment) {

      return res.status(404).json({
        message: "Payment not found"
      });

    }

    payment.status = "approved";

    await payment.save();

    const activatedUser =
await User.findById(
  payment.user
);

if (activatedUser.referredBy) {

  const referrer =
    await User.findOne({

      referralCode:
        activatedUser.referredBy

    });

  if (referrer) {

    referrer.referralEarnings += 800;

    referrer.walletBalance += 800;

    referrer.totalReferrals += 1;

    await referrer.save();

    await Transaction.create({

  user: referrer._id,

  type: "referral",

  amount: 800,

  status: "success",

  description:
    "Referral commission earned"

});

  }

}

    await User.findByIdAndUpdate(

      payment.user,

      {

        isActivated: true,

        activationStatus:
          "active"

      }

    );

    res.json({

      message:
        "Payment approved and user activated"

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};