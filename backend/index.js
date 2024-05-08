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
app.post("/webhook", (req, res) => {
  console.log("Webhook request received");

  const { webhookType, data } = req.body;
  console.log("Webhook body:", req.body);

  if (webhookType === "session-ended") {
    const { start, end, meetingId } = data;
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationInMilliseconds = endTime - startTime;
    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
    console.log("Duration: ", durationInSeconds);

    io.emit("meetingDuration", { duration: durationInSeconds, meetingId });

    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.use("/api/meeting", meetingRoutes);
app.use("/api/users", userRoutes);

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
