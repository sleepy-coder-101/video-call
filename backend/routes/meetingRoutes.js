const express = require("express");
const router = express.Router();

const meetingController = require("../controllers/meetingController");

router.get("/fetch-token", meetingController.fetchToken);
router.post("/create-room", meetingController.createRoom);

module.exports = router;
