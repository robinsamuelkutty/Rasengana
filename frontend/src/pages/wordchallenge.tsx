import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import HandTrackingWebcam from "../components/webcam";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useSearchParams, Link } from "wouter";

const API_URL = "http://localhost:5000/process-image";

const WordChallenge = () => {
  const [searchParams] = useSearchParams();
  const selectedWords = searchParams.get("words")?.split(",") || [];
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(150);
  const [isLoading, setIsLoading] = React.useState(false);
  const [detectedLetter, setDetectedLetter] = React.useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = React.useState(false);

  const currentWord = selectedWords[currentWordIndex];
  const currentLetter = currentWord?.[currentLetterIndex];

  React.useEffect(() => {
    if (timeLeft === 0) {
      toast.error("Time's up! Try again.");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const padBase64 = (base64: string): string => {
    const paddingNeeded = 4 - (base64.length % 4);
    return paddingNeeded < 4 ? base64 + "=".repeat(paddingNeeded) : base64;
  };

  const handleCapture = async () => {
    if (!currentWord || gameCompleted) return;

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

    setIsLoading(true);
    toast("Processing image...");

    try {
      const requestBody = JSON.stringify({ image: paddedBase64 });
      console.log("Request body:", requestBody);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data }), // Send to Node.js backend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const receivedLetter = data.detectedLetter?.replace(/['"]/g, '').toUpperCase();
      setDetectedLetter(receivedLetter);

      if (receivedLetter === currentLetter?.toUpperCase()) {
        toast.success(`✅ Correct! Detected letter: ${receivedLetter}`);
        
        // Move to next letter or word
        if (currentLetterIndex < currentWord.length - 1) {
          setCurrentLetterIndex(prev => prev + 1);
        } else {
          // Word completed
          if (currentWordIndex < selectedWords.length - 1) {
            toast.success(`🎉 Word '${currentWord}' completed!`);
            setCurrentWordIndex(prev => prev + 1);
            setCurrentLetterIndex(0);
          } else {
            // Game completed
            toast.success("🏆 Congratulations! All words completed!");
            setGameCompleted(true);
          }
        }
      } else {
        toast.error(`❌ Incorrect! Expected ${currentLetter}`);
      }
    } catch (error) {
      console.error("Oops Try again!");
      toast.error("⚠️ Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentWord) {
    return <div className="container mx-auto p-4">No words selected. Please go back and select words.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Time Left: {timeLeft} seconds</h1>
        <div className="mt-2">
          <span className="font-semibold">Progress: </span>
          Word {currentWordIndex + 1}/{selectedWords.length} - Letter {currentLetterIndex + 1}/{currentWord.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Word: {currentWord}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {currentWord.split('').map((letter, index) => (
                <span
                  key={index}
                  className={`text-4xl font-bold p-2 ${
                    index === currentLetterIndex
                      ? 'text-primary border-b-4 border-primary'
                      : index < currentLetterIndex
                      ? 'text-gray-400'
                      : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
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
              disabled={isLoading || gameCompleted}
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

      {gameCompleted && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-green-600">🎉 Game Completed! 🎉</h2>
          <Link href="/" className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Play Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default WordChallenge;