
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ReminderCategory } from "@/types/reminders";

interface AddReminderDialogProps {
  onAdd: (reminder: { title: string; content: string; category: ReminderCategory; date?: string; time?: string }) => void;
}

function getToday(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}
function getTimeNow(): string {
  const now = new Date();
  // Pad with 0 if needed
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export const AddReminderDialog: React.FC<AddReminderDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ReminderCategory>("important-dates");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getToday());
  const [content, setContent] = useState("");
  const [time, setTime] = useState(getTimeNow());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, content, category, date: date.trim() || undefined, time: category === "general-reminders" ? time : undefined });
    setOpen(false);
    setTitle(""); setContent(""); setDate(getToday()); setTime(getTimeNow());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">+ Add Reminder</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1 flex-1"
              value={category}
              onChange={e => setCategory(e.target.value as ReminderCategory)}
            >
              <option value="important-dates">Important Date</option>
              <option value="general-reminders">General Reminder</option>
            </select>
            {(category === "important-dates") && (
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="max-w-[130px]" />
            )}
            {(category === "general-reminders") && (
              <>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="max-w-[130px]" />
                <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="max-w-[90px]" />
              </>
            )}
          </div>
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="(Optional) Details" value={content} onChange={e => setContent(e.target.value)} />
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
