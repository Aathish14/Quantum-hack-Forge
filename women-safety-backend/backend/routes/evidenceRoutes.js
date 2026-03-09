const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { uploadEvidence } = require("../controllers/evidenceController");

router.post("/upload", upload.single("file"), uploadEvidence);

module.exports = router;