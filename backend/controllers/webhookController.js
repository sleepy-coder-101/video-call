const io = require("../index");

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
