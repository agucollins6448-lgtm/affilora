const express =
require("express");

const router =
express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createTicket,
  getAllTickets,
  resolveTicket
} =
require("../controllers/supportController");

router.post(
  "/create",
  authMiddleware,
  createTicket
);

router.get(
  "/all",
  adminMiddleware,
  getAllTickets
);

router.put(
  "/resolve/:id",
  adminMiddleware,
  resolveTicket
);

module.exports =
router;