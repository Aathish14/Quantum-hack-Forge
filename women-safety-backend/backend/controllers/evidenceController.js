const Evidence = require("../models/Evidence");
const cloudinary = require("../config/cloudinary");

exports.uploadEvidence = async (req, res) => {

  try {

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const { incidentId, mediaType } = req.body;

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "auto"
      }
    );

    const evidence = await Evidence.create({
      incidentId,
      mediaType,
      url: result.secure_url
    });

    res.status(201).json({
      message: "Evidence uploaded",
      evidence
    });

  } catch (error) {

    console.error("Upload Error:", error);

    res.status(500).json({
      error: "Upload failed",
      details: error.message
    });

  }

};