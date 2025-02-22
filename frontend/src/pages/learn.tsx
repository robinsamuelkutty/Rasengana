

import { Link } from "wouter";

const ASL_ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Learn() {
 
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      Learn ASL Alphabets
        </h1>

    {/* Progress Bar */}
      <div className="mb-8">
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Start with the basics and learn each letter through interactive
        lessons with real-time feedback.</p>
      </div>
      </div>

      {/* Alphabet Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {ASL_ALPHABETS.split("").map((letter, index) => (
          <Link key={index} href={`/study/${letter}`} className="w-full">
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <span className="text-4xl font-bold">{letter}</span>
              <span className="text-sm text-gray-500">ASL Sign</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
