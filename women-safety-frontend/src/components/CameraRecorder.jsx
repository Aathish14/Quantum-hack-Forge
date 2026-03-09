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
<<<<<<< Updated upstream
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
=======
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
>>>>>>> Stashed changes
  };

  useEffect(() => {
    if (incidentId) {
      startCameraAndRecord();
    } else {
      stopRecording();
    }
<<<<<<< Updated upstream
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

=======

    return () => {
      stopRecording();
    };
  }, [incidentId, startCameraAndRecord]);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800 animate-slide-up">
      {/* Header Bar */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
          </svg>
          <h2 className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Live Evidence Capture</h2>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 bg-black bg-opacity-50 rounded-full border border-red-900">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">REC</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted // Muted locally so the victim doesn't hear echo, but audio is recorded
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* Overlay Grids / Tech aesthetics */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-[1px] border-white border-opacity-10 grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-white border-opacity-5"></div>
            ))}
          </div>
        </div>

        {/* Timestamp Overlay */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <div className="font-mono text-xs text-brand-red bg-black bg-opacity-60 px-2 py-1 rounded backdrop-blur-sm border border-red-900 border-opacity-50">
            SECURE CLOUD SYNC: ACTIVE
          </div>
        </div>
      </div>
    </div>
>>>>>>> Stashed changes
  );

};

export default CameraRecorder;