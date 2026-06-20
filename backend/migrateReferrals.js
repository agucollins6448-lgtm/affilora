// scripts/migrateReferrals.js

const mongoose = require("mongoose");
const User = require("../backend/models/User");
require("dotenv").config();

(async () => {

  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find();

  let count = 0;

  for (const user of users) {

    if (
      typeof user.referredBy === "object" &&
      user.referredBy
    ) {

      const referrer =
        await User.findOne({
          referralCode: user.referredBy
        });

      if (referrer) {

        user.referredBy =
          referrer._id;

        await user.save();

        count++;

        console.log(
          `${user.username} migrated`
        );

      }

    }

  }

  console.log(
    `Done. ${count} users migrated.`
  );

  process.exit();

})();