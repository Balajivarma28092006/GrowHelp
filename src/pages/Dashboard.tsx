import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { Entry } from "@/types/entry";
import { EntryCard } from "@/components/EntryCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PenLine, Sprout } from "lucide-react";
import { differenceInDays } from "date-fns";

const Dashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const allEntries = storage.getEntries().sort((a, b) => b.createdAt - a.createdAt);
    setEntries(allEntries.slice(0, 3));
    
    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    const sortedDates = allEntries.map(e => new Date(e.date)).sort((a, b) => b.getTime() - a.getTime());
    
    for (let i = 0; i < sortedDates.length; i++) {
      const daysDiff = differenceInDays(today, sortedDates[i]);
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, []);

  const prompts = [
    "What small win can you celebrate today?",
    "What challenged you, and what did it teach you?",
    "How did you show up for yourself today?",
    "What are you grateful for right now?",
    "What would future you thank you for doing today?",
  ];

  const todayPrompt = prompts[new Date().getDay() % prompts.length];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every small step matters. Your journey of growth continues here.
          </p>
        </div>

        {/* Stats & Prompt Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Sprout className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-semibold">Your Streak</h2>
            </div>
            <p className="text-4xl font-bold text-primary mb-1">{streak} {streak === 1 ? "day" : "days"}</p>
            <p className="text-sm text-muted-foreground">Keep nurturing your growth</p>
          </div>

          <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/20 shadow-soft">
            <h2 className="text-lg font-serif font-semibold mb-2 text-foreground">
              Today's Reflection
            </h2>
            <p className="text-foreground/80 italic leading-relaxed">{todayPrompt}</p>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold">Recent Entries</h2>
            <Link to="/history">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {entries.length > 0 ? (
            <div className="grid gap-4">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <Sprout className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-serif font-semibold mb-2">Begin Your Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your first entry is the first step towards understanding your growth. Start today.
              </p>
              <Link to="/new">
                <Button size="lg" className="gap-2">
                  <PenLine className="w-4 h-4" />
                  Write First Entry
                </Button>
              </Link>
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <div className="text-center">
            <Link to="/new">
              <Button size="lg" className="gap-2 shadow-card">
                <PenLine className="w-4 h-4" />
                Write New Entry
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
