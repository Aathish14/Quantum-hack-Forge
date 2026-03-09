const Incident = require("../models/Incident");

// TRIGGER EMERGENCY
exports.triggerEmergency = async (req, res) => {
  try {

    const { userId, location, deviceId } = req.body;

    const incident = await Incident.create({
      userId,
      location,
      deviceId,
      status: "ACTIVE"
    });

    res.status(201).json({
      message: "Emergency triggered",
      incidentId: incident._id
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Emergency trigger failed"
    });

  }
};


// STOP EMERGENCY
exports.stopEmergency = async (req, res) => {
  try {

    const { incidentId } = req.body;

    await Incident.findByIdAndUpdate(
      incidentId,
      { status: "CANCELLED" }
    );

    res.json({
      message: "Emergency stopped"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to stop emergency"
    });

  }
};