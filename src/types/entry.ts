export type Mood = "great" | "good" | "okay" | "struggling" | "difficult";

export interface Entry {
  id: string;
  date: string;
  content: string;
  mood?: Mood;
  lessons?: string[];
  createdAt: number;
}

export interface Lesson {
  id: string;
  content: string;
  entryId?: string;
  createdAt: number;
}
