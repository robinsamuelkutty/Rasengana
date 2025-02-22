import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import HandTrackingWebcam from "../components/webcam";
import toast, { Toaster } from "react-hot-toast";
import { Trophy, Flag, Car, Play } from "lucide-react";

const API_URL = "http://localhost:5000/process-image";
const ASL_ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FINISH_LINE = 95;
const NITRO_DURATION = 1000; // 3 seconds of nitro boost
const NITRO_SPEED = 15; // Speed increase during nitro

const AlphabetRace = () => {
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetLetter, setTargetLetter] = useState("");
  const [playerSpeed, setPlayerSpeed] = useState(0);
  const [opponentSpeeds, setOpponentSpeeds] = useState([0, 0, 0]);
  const [gameStatus, setGameStatus] = useState("waiting"); // waiting, running, finished
  const [playerPosition, setPlayerPosition] = useState(null);
  const [nitroActive, setNitroActive] = useState(false);
  const [baseSpeed] = useState([0.2, 0.3, 0.4]); // Slow base speeds for opponents

  useEffect(() => {
    generateRandomLetter();
  }, []);

  useEffect(() => {
    let gameInterval;
    if (gameStatus === "running") {
      gameInterval = setInterval(() => {
        setOpponentSpeeds(prev => 
          prev.map((speed, index) => {
            if (speed < FINISH_LINE) {
              // Each opponent has their own base speed plus some randomness
              return Math.min(speed + baseSpeed[index] * (Math.random() * 0.2 + 0.5), FINISH_LINE);
            }
            return speed;
          })
        );

        // Regular player movement when nitro is not active
        if (!nitroActive) {
          setPlayerSpeed(prev => 
            prev < FINISH_LINE ? prev + 0.1 : prev
          );
        }
      }, 100);
    }
    return () => clearInterval(gameInterval);
  }, [gameStatus, nitroActive, baseSpeed]);

  useEffect(() => {
    if (playerSpeed >= FINISH_LINE || opponentSpeeds.some(speed => speed >= FINISH_LINE)) {
      const position = calculatePosition();
      setPlayerPosition(position);
      setGameStatus("finished");
      toast.success(`Race finished! You came in ${position}th place!`);
    }
  }, [playerSpeed, opponentSpeeds]);

  const startRace = () => {
    setGameStatus("running");
    setPlayerSpeed(0);
    setOpponentSpeeds([0, 0, 0]);
    setPlayerPosition(null);
    generateRandomLetter();
    toast.success("🏁 Race Started!");
  };

  const activateNitro = () => {
    setNitroActive(true);
    // Boost player speed during nitro
    const nitroInterval = setInterval(() => {
      setPlayerSpeed(prev => Math.min(prev + NITRO_SPEED / 10, FINISH_LINE));
    }, 100);

    // Disable nitro after duration
    setTimeout(() => {
      setNitroActive(false);
      clearInterval(nitroInterval);
    }, NITRO_DURATION);
  };

  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const calculatePosition = () => {
    const allPositions = [...opponentSpeeds, playerSpeed];
    const sorted = [...allPositions].sort((a, b) => b - a);
    return sorted.indexOf(playerSpeed) + 1;
  };

  const generateRandomLetter = () => {
    const letter = ASL_ALPHABETS[Math.floor(Math.random() * ASL_ALPHABETS.length)];
    setTargetLetter(letter);
  };

  const padBase64 = (base64) => {
    const paddingNeeded = 4 - (base64.length % 4);
    return paddingNeeded < 4 ? base64 + "=".repeat(paddingNeeded) : base64;
  };

  const handleCapture = async () => {
    if (gameStatus !== "running") return;

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

    try {
      const requestBody = JSON.stringify({ image: paddedBase64 });
      console.log("Request body:", requestBody);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: JSON.stringify({
            image_data: paddedBase64
          })
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const receivedLetter = data.detectedLetter?.replace(/['"]/g, '').toUpperCase();
      setDetectedLetter(receivedLetter);

      if (receivedLetter === targetLetter) {
        toast.success("🏎️ Nitro Boost Activated!");
        activateNitro();
        generateRandomLetter();
      } else {
        toast.error("❌ Wrong Sign!");
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-2xl font-bold">ASL Racing Championship</CardTitle>
              {gameStatus !== "running" && (
                <button
                  onClick={startRace}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Play size={20} />
                  {gameStatus === "waiting" ? "Start Race" : "Race Again"}
                </button>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                {/* Sky */}
                <div className="absolute top-0 w-full h-1/3 bg-gradient-to-b from-blue-400 to-blue-200" />
                
                {/* Track */}
                <div className="absolute bottom-0 w-full h-2/3">
                  {/* Individual tracks */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-16 bg-gray-700 border-t-2 border-b-2 border-gray-600"
                      style={{ top: `${20 + i * 20}%` }}
                    >
                      {/* Track markings */}
                      {[...Array(20)].map((_, j) => (
                        <div
                          key={j}
                          className="absolute h-2 w-6 bg-white opacity-50"
                          style={{ left: `${j * 5}%`, top: '50%' }}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Finish line */}
                  <div className="absolute right-4 h-full w-8 bg-gradient-to-b from-black via-white to-black flex items-center justify-center">
                    <Flag className="text-red-500" size={32} />
                  </div>

                  {/* Cars */}
                  {opponentSpeeds.map((speed, i) => (
                    <div
                      key={i}
                      className="absolute transition-all duration-100"
                      style={{
                        top: `${25 + i * 20}%`,
                        left: `${speed}%`,
                        transform: 'translate(0, -50%)'
                      }}
                    >
                      <Car 
                        className="text-red-500" 
                        size={32}
                        style={{ transform: 'scaleX(1)' }}
                      />
                    </div>
                  ))}

                  {/* Player car */}
                  <div
                    className="absolute transition-all duration-100"
                    style={{
                      top: '85%',
                      left: `${playerSpeed}%`,
                      transform: 'translate(0, -50%)'
                    }}
                  >
                    <Car 
                      className={`${nitroActive ? 'text-yellow-400' : 'text-blue-500'}`}
                      size={32}
                      style={{ transform: 'scaleX(1)' }}
                    />
                    {nitroActive && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-pulse text-yellow-400">🔥</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game status overlay */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full">
                  <div className="text-white font-bold text-xl flex items-center gap-2">
                    {gameStatus === "running" ? (
                      <>Target Letter: {targetLetter}</>
                    ) : gameStatus === "finished" ? (
                      <div className="flex items-center gap-2">
                        <Trophy className="text-yellow-400" />
                        {getOrdinalSuffix(playerPosition)} Place!
                      </div>
                    ) : (
                      "Ready to Race!"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">ASL Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video">
                <HandTrackingWebcam onDetectedLetter={setDetectedLetter} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <button
                onClick={handleCapture}
                disabled={isLoading || gameStatus !== "running"}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 font-bold"
              >
                {isLoading ? "Processing..." : "Capture Sign"}
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlphabetRace;