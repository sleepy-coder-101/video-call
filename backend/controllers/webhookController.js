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

// Socket connection checking
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

exports.handleWebhook = async (req, res) => {
  const { webhookType, data } = req.body;

  if (webhookType === "session-ended") {
    const { start, end, meetingId } = data;
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationInMilliseconds = endTime - startTime;
    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);

    io.emit("meetingDuration", { duration: durationInSeconds, meetingId });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};
