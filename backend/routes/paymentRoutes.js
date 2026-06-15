const express =
require("express");

const router =
express.Router();

const upload =
require("../config/multer");

const {
  uploadProof,
  getPayments,
  approvePayment
} = require(
  "../controllers/paymentController"
);

router.post(
  "/upload",
  upload.single("screenshot"),
  uploadProof
);

router.get(
  "/all",
  getPayments
);

router.put(
  "/approve/:id",
  approvePayment
);

module.exports = router;