const jwt = require("jsonwebtoken");

exports.fetchToken = async (req, res) => {
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
    res.json({ token: token });
  } catch (error) {
    console.error("Failed to fetch authToken ");
    res.status(500).json({ error: "Failed to fetch authToken" });
  }
};

exports.createRoom = async (req, res) => {
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
        Authorization: `${req.body.authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await response.json();
    console.log(data);
    res.json({ meetingId: data.roomId });
  } catch (error) {
    console.error("Error in creating meeting", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};
