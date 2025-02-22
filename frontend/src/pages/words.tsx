import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "wouter";

const WORD_LIST = [
    "APPLE", "GRAPE", "HOUSE", "CHAIR", "TABLE", "BEACH", "CLOUD", "DREAM", "PLANT", "STONE",
    "OCEAN", "LIGHT", "CANDY", "SOUND", "PAPER", "BRUSH", "TRAIN", "FLAME", "STORM", "RIVER",
    "BEAST", "FLASH", "GLOVE", "TRACK", "HEART", "SHINE", "FIELD", "FROST", "SWING", "SMILE"
  ];
  

const getRandomWords = (count: number) => {
  return WORD_LIST.filter(word => word.length >= 3 && word.length <= 5)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

const Word = () => {
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(getRandomWords(15));
  }, []);

  const toggleWordSelection = (word: string) => {
    setSelectedWords(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      return prev.length < 3 ? [...prev, word] : prev;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Word Challenge
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select 3 words from the list below to begin the challenge.
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto p-4">
        <CardContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {words.map(word => (
            <button
              key={word}
              className={`flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm 
              hover:shadow-md transition-shadow cursor-pointer text-lg font-medium
              ${selectedWords.includes(word) ? "bg-primary text-white" : "bg-gray-100 text-black"}`}
              onClick={() => toggleWordSelection(word)}
            >
              {word}
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <p className="text-lg font-semibold">
          Selected Words: <span className="text-primary">{selectedWords.join(", ") || "Select Any Three"}</span>
        </p>
        <Link href={`/word-challenge?words=${selectedWords.join(",")}`}>
          <button
            className={`mt-4 px-6 py-2 text-white font-semibold rounded-lg transition 
            ${selectedWords.length === 3 ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={selectedWords.length < 3}
          >
            Start Challenge
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Word;