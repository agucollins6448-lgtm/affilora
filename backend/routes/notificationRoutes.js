const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getNotifications,
  markAllAsRead
} = require("../controllers/notificationController");

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.put(
  "/read",
  authMiddleware,
  markAllAsRead
);

module.exports = router;