import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Entry } from "@/types/entry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Trash2, Sparkles, Smile, Meh, Frown, CloudRain } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const moodIcons = {
  great: { icon: Sparkles, label: "Great" },
  good: { icon: Smile, label: "Good" },
  okay: { icon: Meh, label: "Okay" },
  struggling: { icon: Frown, label: "Struggling" },
  difficult: { icon: CloudRain, label: "Difficult" },
};

const EntryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (id) {
      const entries = storage.getEntries();
      const found = entries.find((e) => e.id === id);
      setEntry(found || null);
    }
  }, [id]);

  const handleDelete = () => {
    if (id) {
      storage.deleteEntry(id);
      toast({
        title: "Entry deleted",
        description: "Your entry has been removed.",
      });
      navigate("/history");
    }
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Entry not found</p>
      </div>
    );
  }

  const MoodData = entry.mood ? moodIcons[entry.mood] : null;
  const MoodIcon = MoodData?.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={() => navigate(-1)} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your entry will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <time className="text-sm font-medium text-muted-foreground">
                {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
              </time>
              {MoodIcon && MoodData && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MoodIcon className="w-5 h-5" />
                  <span className="text-sm">{MoodData.label}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>

            {entry.lessons && entry.lessons.length > 0 && (
              <div className="pt-6 border-t border-border/50">
                <h3 className="text-lg font-serif font-semibold mb-4">
                  Lessons Learned
                </h3>
                <div className="space-y-2">
                  {entry.lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="p-3 bg-accent/30 rounded-lg text-sm"
                    >
                      {lesson}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntryDetail;
