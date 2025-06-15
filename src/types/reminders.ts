
export type ReminderCategory = "important-dates" | "general-reminders";
export type NoteCategory = "quotes" | "technology" | "books" | "movies";

export interface ReminderNoteItem {
  id: string;
  type: "reminder" | "note";
  title: string;
  content: string;
  category: ReminderCategory | NoteCategory;
  date?: string; // ISO for reminders
  time?: string; // hh:mm for general reminders
  author?: string; // for quotes
  status?: string; // for books/movies
  createdAt: string;
  alarmSent?: boolean; // Only for general reminders
}
