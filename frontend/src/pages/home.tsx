import { Link } from 'wouter';
import { Card, CardContent } from '../components/ui/card';
import { BookOpen, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Learn ASL with Interactive Practice
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master American Sign Language through our interactive learning platform.
          Practice with real-time feedback and fun challenges.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <BookOpen className="w-12 h-12 text-primary" />
              <h2 className="text-2xl font-semibold">Learn ASL Alphabet</h2>
              <p className="text-center text-gray-600">
                Start with the basics and learn each letter through interactive
                lessons with real-time feedback.
              </p>
              <Link href="/learn">
                <button className="w-full bg-black text-white py-2 px-4 rounded-md">
                  Start Learning
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Trophy className="w-12 h-12 text-primary" />
              <h2 className="text-2xl font-semibold">Take the Challenge</h2>
              <p className="text-center text-gray-600">
                Test your skills with our timed challenges and track your progress
                as you master ASL.
              </p>
              <Link href="/challenge">
                <button className="w-full bg-black text-white py-2 px-4 rounded-md">
                  Start Challenge
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}