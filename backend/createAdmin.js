const mongoose =
require("mongoose");

const bcrypt =
require("bcryptjs");

require("dotenv").config();

const Admin =
require("./models/Admin");

mongoose.connect(
  process.env.MONGO_URI
).then(async () => {

  const hashedPassword =
    await bcrypt.hash(
      "admin123",
      10
    );

  await Admin.create({

    username: "admin",

    password:
      hashedPassword

  });

  console.log(
    "Admin created successfully"
  );

  process.exit();

}).catch(err => {

  console.log(err);

  process.exit();

});