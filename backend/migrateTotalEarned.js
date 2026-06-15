require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../backend/models/User");
const Transaction = require("../backend/models/Transaction");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  console.log("Connected");

  const users = await User.find();

  for (const user of users) {

    const transactions =
      await Transaction.find({
        user: user._id
      });

    const totalEarned =
      transactions
        .filter(t =>
          ["task", "ads", "referral", "survey"]
            .includes(t.type)
        )
        .reduce(
          (sum, t) =>
            sum + Number(t.amount || 0),
          0
        );

    user.totalEarned =
      totalEarned;

    await user.save();

    console.log(
      `${user.fullName}: ₦${totalEarned}`
    );
  }

  console.log("Migration complete");

  process.exit();

})
.catch(err => {

  console.log(err);

  process.exit(1);

});