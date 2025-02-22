import { Switch, Route } from "wouter";
import Home from "./pages/home"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster"
import { Navigation } from "./components/navbar"
import Learn from "./pages/learn";
import Study from "./pages/study";
import ChallengePage from "./pages/challenge";
import Word from "./pages/words";
import WordChallenge from "./pages/wordchallenge";
import AlphabetRace from "./pages/alphabetrace";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/study/:letter" component={Study} />
      <Route path="/challenge" component={ChallengePage} />
      <Route path="/word" component={Word} />
      <Route path="/word-challenge" component={WordChallenge} />
      <Route path="/alphabet-race" component={AlphabetRace} />

    </Switch>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App
