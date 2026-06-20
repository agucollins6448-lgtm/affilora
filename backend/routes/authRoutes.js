const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,
  
  changePassword,

  uploadProfileImage,

  updateSettings,

  getCurrentUser,

  resetMembership,

  getMyReferrals

} = require(
  "../controllers/authController"
);
const authMiddleware =
  require(

    "../middleware/authMiddleware"

  );


const upload =
  require(
    "../middleware/upload"
  );

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(

  "/me",

  authMiddleware,

  getCurrentUser

);

router.put(

  "/change-password",

  authMiddleware,

  changePassword

);


router.put(

  "/upload-profile",

  authMiddleware,

  upload.single("image"),

  uploadProfileImage

);

router.put("/update-settings",
  
  authMiddleware,
  
  updateSettings
);


 router.get(
  "/my-referrals",
  authMiddleware,
  getMyReferrals
);

module.exports =
  router;