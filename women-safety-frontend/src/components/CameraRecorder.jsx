import { useRef, useEffect, useCallback } from "react";
import API from "../services/api";

const CameraRecorder = ({ incidentId }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startCameraAndRecord = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = mediaStream;
      videoRef.current.srcObject = mediaStream;
      
      const recorder = new MediaRecorder(mediaStream);
      let chunks = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: "video/webm" });
          const formData = new FormData();
          formData.append("file", blob, "evidence.webm");
          formData.append("incidentId", incidentId);
          formData.append("mediaType", "video");

          await API.post("/evidence/upload", formData);
          console.log("Evidence uploaded");
        } catch (error) {
          console.error("Upload error:", error);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (error) {
      console.error("Camera error:", error);
    }
  }, [incidentId]);

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
  };

  useEffect(() => {
    if (incidentId) {
      startCameraAndRecord();
    } else {
      stopRecording();
    }
  }, [incidentId, startCameraAndRecord]);

  return (

    <div>

      <h2>Emergency Recording</h2>

      <video
        ref={videoRef}
        autoPlay
        width="400"
      />

    </div>

  );

};

export default CameraRecorder;