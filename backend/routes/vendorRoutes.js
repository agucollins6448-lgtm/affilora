const express = require("express");

const router = express.Router();

const {
  createVendor,
  getVendors
} = require(
  "../controllers/vendorController"
);

router.post(
  "/create",
  createVendor
);

router.get(
  "/all",
  getVendors
);

module.exports = router;