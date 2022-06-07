const express = require("express");
const passport = require("passport");
const authRoutes = require("./routes/auth.route");
const apiRoutes = require("./routes/api.route");
const cors = require("cors");
const User = require("./models/user.model");
const Group = require("./models/chatGroup.model");
require("dotenv").config();

//DB Connection
require("./database/db.config").dbConnection();

//App instance

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

const server = require("http").Server(app);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server on port 5000");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methos: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders:
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (data) => {
    const user = User.findById(data.userId);
    const group = Group.findById(data.groupId);
    if (user && group) {
      socket.join(data.groupId);
      onlineUsers.set(data.userId, socket.id);
      console.log("user joined", data.userId);
    }
  });
  socket.on("sendMessage", async (data) => {
    const newMessage = {
      message: data.message,
      sender: data.sender,
      dateCreated: new Date(),
    };
    io.to(data.groupId).emit("newMessage", newMessage);
  });
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


