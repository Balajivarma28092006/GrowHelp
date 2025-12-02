import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Entry, Mood } from "@/types/entry";
import { MoodSelector } from "@/components/MoodSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const NewEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | undefined>();
  const [lessons, setLessons] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState("");

  const handleAddLesson = () => {
    if (currentLesson.trim()) {
      setLessons([...lessons, currentLesson.trim()]);
      setCurrentLesson("");
    }
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Entry is empty",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    const entry: Entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: content.trim(),
      mood,
      lessons: lessons.length > 0 ? lessons : undefined,
      createdAt: Date.now(),
    };

    storage.saveEntry(entry);

    toast({
      title: "Entry saved",
      description: "Your growth has been recorded.",
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">New Entry</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-serif">How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent>
              <MoodSelector value={mood} onChange={setMood} />
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about your day, your feelings, or anything on your mind..."
                className="min-h-[300px] resize-none text-base leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-serif">Lessons Learned</CardTitle>
              <p className="text-sm text-muted-foreground">
                What insights or lessons did you gain today?
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentLesson}
                  onChange={(e) => setCurrentLesson(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddLesson()}
                  placeholder="Add a lesson..."
                  className="flex-1"
                />
                <Button onClick={handleAddLesson} size="icon" variant="secondary">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {lessons.length > 0 && (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                    >
                      <span className="text-sm">{lesson}</span>
                      <Button
                        onClick={() => handleRemoveLesson(index)}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button onClick={() => navigate("/")} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2 shadow-soft">
              <Save className="w-4 h-4" />
              Save Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
