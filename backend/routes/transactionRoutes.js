const express =
require("express");

const router =
express.Router();

const Transaction =
require("../models/Transaction");

const authMiddleware =
require("../middleware/authMiddleware");

const {

  getUserTransactions,
  exportTransactionsPDF

} = require(
  "../controllers/transactionController"
);


router.get(
  "/export",
  authMiddleware,
  exportTransactionsPDF
);

router.get(
  "/:userId",
  getUserTransactions
);

module.exports = router;