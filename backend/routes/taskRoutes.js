const express =
require("express");

const router =
express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {

  getTasks,

  completeTask,

  watchAdReward,

  surveyReward

} = require(
  "../controllers/taskController"
);

router.get(
  "/all",
  authMiddleware,
  getTasks
);

router.post(
  "/complete",
  authMiddleware,
  completeTask
);

router.post(
  "/watch-ad",
  authMiddleware,
  watchAdReward
);

router.post(
  "/survey-reward",
  authMiddleware,
  surveyReward
);

module.exports = router;