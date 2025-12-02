import { Mood } from "@/types/entry";
import { Smile, Meh, Frown, CloudRain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  value?: Mood;
  onChange: (mood: Mood) => void;
}

const moods: { value: Mood; icon: any; label: string }[] = [
  { value: "great", icon: Sparkles, label: "Great" },
  { value: "good", icon: Smile, label: "Good" },
  { value: "okay", icon: Meh, label: "Okay" },
  { value: "struggling", icon: Frown, label: "Struggling" },
  { value: "difficult", icon: CloudRain, label: "Difficult" },
];

export const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        How are you feeling today?
      </label>
      <div className="flex gap-2 flex-wrap">
        {moods.map(({ value: moodValue, icon: Icon, label }) => (
          <button
            key={moodValue}
            type="button"
            onClick={() => onChange(moodValue)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
              "hover:border-primary hover:shadow-soft",
              value === moodValue
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border bg-card"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
