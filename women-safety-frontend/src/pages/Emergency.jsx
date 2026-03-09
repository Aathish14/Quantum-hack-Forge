import { useState } from "react";
import EmergencyButton from "../components/EmergencyButton";
import CameraRecorder from "../components/CameraRecorder";

const Emergency = () => {

  const [incidentId, setIncidentId] = useState(null);

  return (
    <div>

<<<<<<< Updated upstream
      <h1>Women Safety System</h1>
=======
      <h1>Safety System</h1>
>>>>>>> Stashed changes

      <EmergencyButton setIncidentId={setIncidentId} />

      {incidentId && <CameraRecorder incidentId={incidentId} />}

    </div>
  );
};

export default Emergency;