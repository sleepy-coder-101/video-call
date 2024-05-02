require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    // origin: [`${process.env.FRONTEND_URL}`],
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const meetingRoutes = require("./routes/meetingRoutes");
const userRoutes = require("./routes/userRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const connectDB = require("./config/db");

// Connect to mongodb
connectDB();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/meeting", meetingRoutes);
app.use("/api/users", userRoutes);
app.use("/webhook", webhookRoutes);

// Socket connection checking
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Server connection checking
// const PORT = process.env.PORT | 5000;
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});

module.exports = io;
