const MembershipRequest =
require("../models/MembershipRequest");

const User =
require("../models/User");

const Notification = 
require("../models/Notification");

const sendEmail = 
require("../utils/sendEmail");

const AdminLog = 
require("../models/AdminLog");


exports.createRequest =
async (req, res) => {

  try {

    const userId =
      req.user.id;

    const { plan } =
      req.body;

    const plans = {

      Bronze: 25000,

      Silver: 50000,

      Gold: 75000,

      Premium: 100000

    };

    if (!plans[plan]) {

      return res.status(400).json({
        message: "Invalid plan"
      });

    }

    const existing =
      await MembershipRequest.findOne({

        user: userId,

        status: "pending"

      });

    if (existing) {

      return res.status(400).json({

        message:
          "You already have a pending membership request"

      });

    }

    const request =
      await MembershipRequest.create({

        user: userId,

        plan,

        amount: plans[plan]

      });

      const io = req.app.get("io");

io.to(user._id.toString())
  .emit("membershipUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

    res.status(201).json({
      message:
        "Membership request submitted",
      request
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.getRequests =
async (req, res) => {

  try {

    const requests =
      await MembershipRequest
        .find()
        .populate(
          "user",
          "fullName email membershipTier"
        )
        .sort({
          createdAt: -1
        });

    const io = req.app.get("io");

io.emit("membershipUpdated");

io.emit("userUpdated");

    res.json(requests);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.approveRequest =
async (req, res) => {

  try {

    const request =
      await MembershipRequest.findById(
        req.params.id
      );

    if (!request) {

      return res.status(404).json({
        message: "Request not found"
      });

    }

    const user =
      await User.findById(
        request.user
      );

    user.membershipTier =
      request.plan;

    user.membershipActivatedAt =
      new Date();

    user.membershipActive =
      true;

    user.activationStatus =
      "active";

    const amounts = {

      Bronze: 25000,

      Silver: 50000,

      Gold: 75000,

      Premium: 100000

    };

    user.tierAmount =
      amounts[request.plan];

    await user.save();

    request.status =
      "approved";

    await request.save();

    await Notification.create({

    title:
    "Membership Status",

    message:
    `Hello, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}. We are pleased to inform you that your Affilora account has been upgraded. Enjoy access to greater benefits!`,

    targetUser:
    user._id,

    senderType:
    "system"

    });

    if (user.emailNotifications) {

await sendEmail(

  user.email,

  "Membership Approved",

  `
  <h2>Affilora</h2>

  <p>Hello ${user.fullName.split(" ")[0]},</p>

  <p>We are pleased to inform you that your Affilora account has been upgraded to ${request.plan}. </p>

  <p>
    Enjoy access to greater benefits!<br>
  </p>

  <p>Yours Faithfully,<br>
   Affilora.</p>
  `
);

}

await AdminLog.create({

  action:
    "Membership Approved",

  targetUser:
    user._id,

  details:
    user.membershipTier

});

const io = req.app.get("io");


io.to(user._id.toString())
  .emit("notificationUpdated");

io.emit("membershipUpdated",
    approvedUser._id);

io.to(user._id.toString())
  .emit("userUpdated");

io.emit("adminLogUpdated");


    res.json({
      message:
        "Membership approved"
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.rejectRequest =
async (req, res) => {

  try {

    const request =
      await MembershipRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.status = "rejected";

    await request.save();

    const user =
      await User.findById(
        request.user
      );

    await Notification.create({

    title:
    "Membership Status",

    message:
    `Hello, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}. We are sorry to inform you that your Affilora account could not be upgraded at this time. Earn securely with Affilora.`,

    targetUser:
    user._id,

    senderType:
    "system"

    });

if (user.emailNotifications) {

await sendEmail(

  user.email,

  "Membership Rejected",

  `
  <h2>Affilora</h2>

  <p>Hello ${user.fullName.split(" ")[0]},</p>

  <p>We are sorry to inform you that your Affilora account could not be upgraded to ${request.plan}. </p>

  <p>
    Thank you for using Affilora.<br>
  </p>

  <p>Yours Faithfully,<br>
   Affilora.</p>
  `
);

}

await AdminLog.create({

  action:
    "Membership Rejected",

  targetUser:
    user._id

});

const io = req.app.get("io");


io.to(user._id.toString())
  .emit("notificationUpdated");

io.emit("membershipUpdated");

io.to(user._id.toString())
  .emit("userUpdated");

io.emit("adminLogUpdated");


    res.json({
      message:
        "Membership request rejected"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};