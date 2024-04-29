require("dotenv").config();

const jwt = require("jsonwebtoken");
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

// app.use(cors());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  })
);

app.use(express.json());

let roomId = null;
let authToken = null;

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

app.get("/api/token", async (req, res) => {
  console.log("I got to api/token");
  try {
    const options = {
      expiresIn: "120m",
      algorithm: "HS256",
    };
    const payload = {
      apikey: process.env.API_KEY,
      permissions: [`allow_join`],
      version: 2,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, options);
    authToken = token;

    res.json({ token: token });
  } catch (error) {
    console.error("Failed to fetch authToken ");
  }
});

app.post("/api/meetings", async (req, res) => {
  try {
    const bodyPayload = {
      webhook: {
        endPoint: `${process.env.BACKEND_URL}/webhook`,
        events: ["session-ended"],
      },
    };

    const response = await fetch("https://api.videosdk.live/v2/rooms", {
      method: "POST",
      headers: {
        Authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await response.json();
    console.log(data);
    // console.log(data.webhook);
    roomId = data.roomId;
    res.json({ meetingId: data.roomId });
  } catch (error) {
    console.error("Error in creating meeting", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// const PORT = process.env.PORT | 5000;
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
