const express =
require("express");

const router =
express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {

  requestWithdrawal,

  getWithdrawals,

  approveWithdrawal,

  rejectWithdrawal

} = require(
  "../controllers/withdrawalController"
);

const {
  generateWithdrawalReceipt,
} = require("../controllers/receiptController");

router.post(
  "/request",
  authMiddleware,
  requestWithdrawal
);

router.get(
  "/all",
  adminMiddleware,
  getWithdrawals
);

router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  approveWithdrawal
);

router.put(
  "/reject/:id",
  adminMiddleware,
  rejectWithdrawal
);

router.get("/receipt/:id", generateWithdrawalReceipt);

module.exports = router;