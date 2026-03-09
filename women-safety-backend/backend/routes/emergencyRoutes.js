const express = require("express");
const router = express.Router();

const {
  triggerEmergency,
  stopEmergency
} = require("../controllers/emergencyController");

router.post("/", triggerEmergency);
router.post("/stop", stopEmergency);

module.exports = router;    