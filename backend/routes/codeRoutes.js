const express =
  require("express");

const router =
  express.Router();

const {

  generateCodes

} = require(

  "../controllers/codeController"

);

router.post(

  "/generate",

  generateCodes

);

module.exports =
  router;