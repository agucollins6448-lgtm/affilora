const Notification = require("../models/Notification");
const User = require("../models/User");

// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

const notifications = await Notification.find({
  createdAt: {
    $gte: user.notificationsStartDate || user.createdAt
  },
  $or: [
    { targetUser: user._id },
    { sendToAll: true },
    { targetTier: user.membershipTier }
  ]
}).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// MARK ALL AS READ
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      {
        $or: [
          { targetUser: userId },
          { sendToAll: true }
        ]
      },
      { read: true }
    );

    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

