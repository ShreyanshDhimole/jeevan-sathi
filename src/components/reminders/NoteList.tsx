
import React from "react";
import { ReminderNoteItem, NoteCategory } from "@/types/reminders";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NoteListProps {
  items: ReminderNoteItem[];
  onDelete: (id: string) => void;
}

const categories: { label: string; value: NoteCategory }[] = [
  { label: "Motivating Quotes", value: "quotes" },
  { label: "Technology", value: "technology" },
  { label: "Books", value: "books" },
  { label: "Movies", value: "movies" },
];

export const NoteList: React.FC<NoteListProps> = ({ items, onDelete }) => {
  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {categories.map(cat => {
        const categoryNotes = items.filter(item => item.category === cat.value);
        if (!categoryNotes.length) return null;
        return (
          <div key={cat.value}>
            <h3 className="mb-2 mt-1 text-base font-semibold text-blue-700">{cat.label}</h3>
            <div className="flex flex-col gap-3">
              {categoryNotes.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded shadow animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Bell className="text-blue-400" />
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                      {item.category === "quotes" && item.author && (
                        <div className="text-xs text-gray-400">— {item.author}</div>
                      )}
                      {item.content && <div className="text-sm text-gray-600">{item.content}</div>}
                      {(item.category === "books" || item.category === "movies") && item.status && (
                        <div className="text-xs text-gray-500">Status: {item.status}</div>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => onDelete(item.id)} size="sm" variant="outline" className="mt-2 md:mt-0">
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
