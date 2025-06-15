
import React from "react";
import { ReminderNoteItem, ReminderCategory } from "@/types/reminders";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface ReminderListProps {
  items: ReminderNoteItem[];
  onDelete: (id: string) => void;
}
export const ReminderList: React.FC<ReminderListProps> = ({ items, onDelete }) => {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-3">
      {items.sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : 0)).map(item => (
        <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded shadow animate-fade-in">
          <div className="flex items-center gap-3">
            <Bell className="text-purple-500" />
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-gray-500">{item.category==="important-dates"&&item.date?`Date: ${item.date}`: null}</div>
              {item.content && <div className="text-sm text-gray-600">{item.content}</div>}
            </div>
          </div>
          <Button onClick={()=>onDelete(item.id)} size="sm" variant="outline" className="mt-2 md:mt-0">
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};
