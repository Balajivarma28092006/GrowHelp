import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { Entry, Mood } from "@/types/entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, isAfter } from "date-fns";
import { Sparkles, Smile, Meh, Frown, CloudRain, TrendingUp } from "lucide-react";

const moodValues = {
  great: 5,
  good: 4,
  okay: 3,
  struggling: 2,
  difficult: 1,
};

const moodLabels = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  struggling: "Struggling",
  difficult: "Difficult",
};

const moodColors = {
  great: "hsl(var(--growth-sage))",
  good: "hsl(var(--primary))",
  okay: "hsl(var(--growth-peach))",
  struggling: "hsl(var(--growth-terracotta))",
  difficult: "hsl(var(--destructive))",
};

const moodIcons = {
  great: Sparkles,
  good: Smile,
  okay: Meh,
  struggling: Frown,
  difficult: CloudRain,
};

const MoodTrends = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [averageMood, setAverageMood] = useState(0);
  const [mostCommonMood, setMostCommonMood] = useState<Mood | null>(null);

  useEffect(() => {
    const allEntries = storage.getEntries();
    const entriesWithMood = allEntries.filter(e => e.mood);
    setEntries(entriesWithMood);

    // Process timeline data (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentEntries = entriesWithMood.filter(e => 
      isAfter(new Date(e.date), thirtyDaysAgo)
    );

    const timeline = recentEntries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: format(new Date(entry.date), "MMM d"),
        mood: entry.mood ? moodValues[entry.mood] : 0,
        moodLabel: entry.mood ? moodLabels[entry.mood] : "",
        color: entry.mood ? moodColors[entry.mood] : "",
      }));
    
    setTimelineData(timeline);

    // Process mood distribution
    const moodCounts: Record<Mood, number> = {
      great: 0,
      good: 0,
      okay: 0,
      struggling: 0,
      difficult: 0,
    };

    entriesWithMood.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood]++;
      }
    });

    const distribution = Object.entries(moodCounts)
      .filter(([_, count]) => count > 0)
      .map(([mood, count]) => ({
        name: moodLabels[mood as Mood],
        value: count,
        color: moodColors[mood as Mood],
        mood: mood as Mood,
      }))
      .sort((a, b) => b.value - a.value);

    setDistributionData(distribution);

    // Calculate average mood
    if (entriesWithMood.length > 0) {
      const sum = entriesWithMood.reduce((acc, entry) => {
        return acc + (entry.mood ? moodValues[entry.mood] : 0);
      }, 0);
      setAverageMood(sum / entriesWithMood.length);
    }

    // Find most common mood
    if (distribution.length > 0) {
      setMostCommonMood(distribution[0].mood);
    }
  }, []);

  const getMoodDescription = (avg: number): string => {
    if (avg >= 4.5) return "Thriving";
    if (avg >= 3.5) return "Growing steadily";
    if (avg >= 2.5) return "Finding your way";
    if (avg >= 1.5) return "Facing challenges";
    return "Going through difficulty";
  };

  const MostCommonIcon = mostCommonMood ? moodIcons[mostCommonMood] : TrendingUp;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Mood Trends</h1>
          <p className="text-muted-foreground">
            Visualize your emotional journey over time
          </p>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif">Average Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {averageMood.toFixed(1)}/5
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getMoodDescription(averageMood)}
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-primary/40" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/50 bg-gradient-to-br from-accent/30 to-accent/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif">Most Common</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {mostCommonMood ? moodLabels[mostCommonMood] : "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your typical mood
                      </p>
                    </div>
                    <MostCommonIcon className="w-10 h-10 text-foreground/40" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/50 bg-gradient-to-br from-secondary/20 to-secondary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-serif">Tracked Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {entries.length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Days with mood data
                      </p>
                    </div>
                    <Sparkles className="w-10 h-10 text-foreground/40" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Chart */}
            {timelineData.length > 0 && (
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Mood Over Time (Last 30 Days)</CardTitle>
                  <p className="text-sm text-muted-foreground">Track how your feelings change day by day</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        domain={[0, 5]} 
                        ticks={[1, 2, 3, 4, 5]}
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                        formatter={(value: any, name: string, props: any) => [props.payload.moodLabel, 'Mood']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Distribution Chart */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Mood Distribution</CardTitle>
                  <p className="text-sm text-muted-foreground">Your overall mood breakdown</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Mood Frequency</CardTitle>
                  <p className="text-sm text-muted-foreground">Count of each mood state</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={distributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="shadow-card border-border/50">
            <CardContent className="text-center py-16">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-serif font-semibold mb-2">No Mood Data Yet</h3>
              <p className="text-muted-foreground">
                Start tracking your moods in your entries to see trends and insights here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MoodTrends;
