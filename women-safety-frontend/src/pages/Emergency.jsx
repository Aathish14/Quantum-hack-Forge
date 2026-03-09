import { useState } from "react";
import EmergencyButton from "../components/EmergencyButton";
import CameraRecorder from "../components/CameraRecorder";

const Emergency = () => {

  const [incidentId, setIncidentId] = useState(null);

  return (
    <div>

      <h1>Women Safety System</h1>

      <EmergencyButton setIncidentId={setIncidentId} />

      {incidentId && <CameraRecorder incidentId={incidentId} />}

    </div>
  );
};

export default Emergency;