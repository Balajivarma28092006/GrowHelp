import { Entry, Lesson } from "@/types/entry";

const ENTRIES_KEY = "growth_diary_entries";
const LESSONS_KEY = "growth_diary_lessons";

export const storage = {
  getEntries(): Entry[] {
    const data = localStorage.getItem(ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEntry(entry: Entry): void {
    const entries = this.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  },

  deleteEntry(id: string): void {
    const entries = this.getEntries().filter(e => e.id !== id);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  },

  getLessons(): Lesson[] {
    const data = localStorage.getItem(LESSONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveLesson(lesson: Lesson): void {
    const lessons = this.getLessons();
    const index = lessons.findIndex(l => l.id === lesson.id);
    
    if (index >= 0) {
      lessons[index] = lesson;
    } else {
      lessons.push(lesson);
    }
    
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  },

  deleteLesson(id: string): void {
    const lessons = this.getLessons().filter(l => l.id !== id);
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  }
};
