import { Link } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { WholeWord, Gauge } from "lucide-react";

const ChallengePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Take the ASL Challenge
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Test your skills with our timed challenges and track your progress
        as you master ASL.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Word Challenge Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <WholeWord className="w-12 h-12 text-primary" />
              <h2 className="text-2xl font-semibold">Word Challenge</h2>
              <p className="text-center text-gray-600">
                Spell words using ASL hand signs within the time limit.
              </p>
              <Link href="/word">
                <button className="w-full bg-black text-white py-2 px-4 rounded-md">
                  Start Challenge
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alphabet Race Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Gauge className="w-12 h-12 text-primary" />
              <h2 className="text-2xl font-semibold">Alphabet Race</h2>
              <p className="text-center text-gray-600">
                Sign the correct ASL letters to move your car to the finish line.
              </p>
              <Link href="/alphabet-race">
                <button className="w-full bg-black text-white py-2 px-4 rounded-md">
                  Start Race
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChallengePage;
