import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { Entry } from "@/types/entry";
import { EntryCard } from "@/components/EntryCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const History = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const allEntries = storage.getEntries().sort((a, b) => b.createdAt - a.createdAt);
    setEntries(allEntries);
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.lessons?.some((lesson) =>
        lesson.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Your Journey</h1>
          <p className="text-muted-foreground">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} recorded
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your entries..."
              className="pl-10"
            />
          </div>
        </div>

        {filteredEntries.length > 0 ? (
          <div className="grid gap-4">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {searchTerm ? "No entries match your search." : "No entries yet. Start writing!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
