const express =
require("express");

const router =
express.Router();

const {

  createTask,

  getTasks,

  completeTask,

  watchAdReward,

  surveyReward

} = require(
  "../controllers/taskController"
);

router.post(
  "/create",
  createTask
);

router.get(
  "/all",
  getTasks
);

router.post(
  "/complete",
  completeTask
);

router.post(
  "/watch-ad",
  watchAdReward
);

router.post(
  "/survey-reward",
  surveyReward
);

module.exports = router;