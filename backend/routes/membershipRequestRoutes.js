const express =
require("express");

const router =
express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");


const {

  createRequest,

  getRequests,

  approveRequest,

  rejectRequest


} = require(
  "../controllers/membershipRequestController"
);

router.post(
  "/create",
  authMiddleware,
  createRequest
);

router.get(
  "/all",
  adminMiddleware,
  getRequests
);

router.put(
  "/approve/:id",
  adminMiddleware,
  approveRequest
);

router.put(
  "/reject/:id",
  adminMiddleware,
  rejectRequest
);

module.exports = router;