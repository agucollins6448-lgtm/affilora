const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const express = require("express");
const cors = require('cors');

const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
const cpxRoutes = require("./routes/cpxRoutes");
const supportRoutes = require("./routes/supportRoutes");
const membershipRequestRoutes = require("./routes/membershipRequestRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow your React app
  credentials: true // Allow cookies/headers if needed later
}));

app.use(express.json());

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/withdrawals",
  require(
    "./routes/withdrawalRoutes"
  )
);

app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

app.use(
  "/api/transactions",
  require(
    "./routes/transactionRoutes"
  )
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);

app.use(
  "/api/support",
  supportRoutes
);

app.use(
  "/api/membership-requests",
  membershipRequestRoutes
);


app.use(

  "/uploads",

  express.static("uploads")

);

app.use(
  
  "/api/cpx", 
  
  cpxRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT =
  process.env.PORT || 5000;

const server =
http.createServer(app);

const io =
new Server(server, {

  cors: {
    origin:
      "http://localhost:5173",
    methods:
      ["GET", "POST"]
  }

});

io.on("connection", socket => {

  console.log(
    "Client Connected",
    socket.id
  );

  socket.on(
    "disconnect",
    () => {

      console.log(
        "Client Disconnected"
      );

    }
  );

});

app.set("io", io);

server.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});