const Support =
require("../models/Support");

const User =
require("../models/User");

const Notification = 
require("../models/Notification");




exports.createTicket =
async (req, res) => {

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

    const { message } =
      req.body;

    if (!message) {

      return res.status(400).json({
        message:
          "Message is required"
      });

    }

    const ticket =
      await Support.create({

        user: user._id,

        fullName:
          user.fullName,

        email:
          user.email,

        membershipTier:
          user.membershipTier,

        message

      });

      const io = req.app.get("io");

      io.emit("ticketUpdated");
      io.emit("userUpdated");

    res.status(201).json({

      message:
        "Support ticket submitted successfully",

      ticket

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getAllTickets =
async (req, res) => {

  try {

    const tickets =
      await Support.find()
      .populate(
        "user",
        "fullName email"
      )
      .sort({
        createdAt: -1
      });

    const io = req.app.get("io");
      io.emit("ticketupdated");
      io.emit("UserUpdated")
    
    res.json(tickets);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


exports.resolveTicket =
async (req, res) => {

  try {

    const ticket =
      await Support.findById(
        req.params.id
      );

    if (!ticket) {

      return res.status(404).json({
        message:
          "Ticket not found"
      });

    }

    const user =
  await User.findById(
    ticket.user
  );

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

    ticket.status =
      "resolved";

    await ticket.save();

    await Notification.create({
    
    title:
    "Support",
    
    message:
    `Hello, ${user?.fullName ? user.fullName.split(" ")[0] : "Member"}. Thank you for reaching out to our support team. Earn securely with Affilora!`,
    
    targetUser:
    user._id,

    senderType:
    "system"
    
    });

    const io = req.app.get("io");


    io.emit("notificationUpdated");

    io.emit("ticketUpdated");

    io.emit("userUpdated");

    res.json({
      message:
        "Ticket resolved"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};