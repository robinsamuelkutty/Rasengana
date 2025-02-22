import * as React from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

interface WebcamProps {
  onDetectedLetter: (letter: string | null) => void;
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const HandTrackingWebcam: React.FC<WebcamProps> = ({ onDetectedLetter }) => {
  const webcamRef = React.useRef<Webcam>(null);

  React.useEffect(() => {
    const captureImage = async () => {
      if (!webcamRef.current || !webcamRef.current.video) return;
      
      const video = webcamRef.current.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL("image/png"); // Convert to Base64
      
      try {
        const response = await fetch("https://psilvhbvp5.execute-api.us-east-1.amazonaws.com/endpoint/dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageBase64 }),
        });
  
        const data = await response.json();
        onDetectedLetter(data.detectedLetter || null);
      } catch (error) {
        console.error("Error detecting ASL sign:", error);
        onDetectedLetter(null);
      }
    };
    
    captureImage();
  }, [onDetectedLetter]);

  return (
    <div className="flex flex-col items-center">
      <Webcam ref={webcamRef} videoConstraints={videoConstraints} className="rounded-lg w-full" />
    </div>
  );
};

export default HandTrackingWebcam;
