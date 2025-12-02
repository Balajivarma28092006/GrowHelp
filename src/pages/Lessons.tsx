import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { Entry } from "@/types/entry";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { format } from "date-fns";

const Lessons = () => {
  const [lessonsData, setLessonsData] = useState<{ lesson: string; date: string; entryId: string }[]>([]);

  useEffect(() => {
    const entries = storage.getEntries();
    const allLessons: { lesson: string; date: string; entryId: string }[] = [];

    entries.forEach((entry: Entry) => {
      if (entry.lessons && entry.lessons.length > 0) {
        entry.lessons.forEach((lesson) => {
          allLessons.push({
            lesson,
            date: entry.date,
            entryId: entry.id,
          });
        });
      }
    });

    setLessonsData(allLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Lessons Learned</h1>
          <p className="text-muted-foreground">
            {lessonsData.length} {lessonsData.length === 1 ? "lesson" : "lessons"} collected
          </p>
        </div>

        {lessonsData.length > 0 ? (
          <div className="grid gap-4">
            {lessonsData.map((item, index) => (
              <Card
                key={index}
                className="shadow-soft border-border/50 hover:shadow-card transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed mb-2">{item.lesson}</p>
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(item.date), "MMMM d, yyyy")}
                      </time>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-serif font-semibold mb-2">No Lessons Yet</h3>
            <p className="text-muted-foreground">
              Start adding lessons to your entries to build your collection of insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
