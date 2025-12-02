import { Entry } from "@/types/entry";
import { format } from "date-fns";
import { Sparkles, Smile, Meh, Frown, CloudRain } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface EntryCardProps {
  entry: Entry;
}

const moodIcons = {
  great: Sparkles,
  good: Smile,
  okay: Meh,
  struggling: Frown,
  difficult: CloudRain,
};

export const EntryCard = ({ entry }: EntryCardProps) => {
  const MoodIcon = entry.mood ? moodIcons[entry.mood] : null;

  return (
    <Link to={`/entry/${entry.id}`}>
      <Card className="hover:shadow-card transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <time className="text-sm font-medium text-muted-foreground">
              {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
            </time>
            {MoodIcon && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MoodIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 line-clamp-3 leading-relaxed">
            {entry.content}
          </p>
          {entry.lessons && entry.lessons.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                {entry.lessons.length} {entry.lessons.length === 1 ? "lesson" : "lessons"} learned
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
