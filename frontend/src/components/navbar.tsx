
import { Link, useLocation } from 'wouter';
import { Button } from "./ui/button"
import { Home, BookOpen, Trophy } from 'lucide-react';

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:relative md:border-t-0 md:border-b">
      <div className="container mx-auto flex justify-center gap-4">
        <Link href="/">
          <Button
            variant={location === '/' ? 'default' : 'ghost'}
            className="flex gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Button>
        </Link>
        <Link href="/learn">
          <Button
            variant={location === '/learn' ? 'default' : 'ghost'}
            className="flex gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Learn</span>
          </Button>
        </Link>
        <Link href="/challenge">
          <Button
            variant={location === '/challenge' ? 'default' : 'ghost'}
            className="flex gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Challenge</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
