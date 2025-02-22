import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import HandTrackingWebcam from "../components/webcam";
import { Link } from "wouter";
import ASL_IMAGES from "../assets/aslImages";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const ASL_ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const API_URL = "http://localhost:5000/process-image"; // Now using local backend

export default function Study({ params }: { params: { letter: string } }) {
  const { letter } = params;
  const [detectedLetter, setDetectedLetter] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleNextLetter = () => {
    const currentIndex = ASL_ALPHABETS.indexOf(letter || "A");
    const nextIndex = (currentIndex + 1) % ASL_ALPHABETS.length;
    return `/study/${ASL_ALPHABETS[nextIndex]}`;
  };



  const handleCapture = async () => {
    const video = document.querySelector("video");
    if (!video) return;
  
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/png");
    const base64Data = imageDataUrl.split(",")[1];
    const paddedBase64 = padBase64(base64Data);
  
    console.log("Sending image to server...");
    toast("Processing image...");
    setIsLoading(true);
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: paddedBase64
        })
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      const detectedLetter = data.detectedLetter.replace(/['"]+/g, "");
      setDetectedLetter(detectedLetter);
      
      if (detectedLetter.toUpperCase() === letter.toUpperCase()) {
        toast.success(`🎉 Success! You signed '${letter}' correctly!`);
      } else {
        toast.error(`Try again! The detected letter was '${detectedLetter}'`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("⚠️ Error verifying ASL sign.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Study ASL Letter: {letter}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ASL Sign for {letter}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={ASL_IMAGES[letter] || ""}
              alt={`ASL Sign for ${letter}`}
              className="w-100 h-100 object-contain pl-10"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice with Webcam</CardTitle>
          </CardHeader>
          <CardContent>
            <HandTrackingWebcam onDetectedLetter={setDetectedLetter} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              onClick={handleCapture}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader size={20} color="#ffffff" /> : "Capture"}
            </button>
          </CardFooter>
        </Card>
      </div>

      {detectedLetter && (
        <div className="mt-4 text-center">
          <p className="text-lg">
            Detected Letter: <span className="font-bold">{detectedLetter}</span>
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link href={handleNextLetter()}>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Next Letter
          </button>
        </Link>
      </div>
    </div>
  );
}
