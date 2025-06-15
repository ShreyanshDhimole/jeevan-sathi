
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ReminderCategory } from "@/types/reminders";

interface AddReminderDialogProps {
  onAdd: (reminder: { title: string; content: string; category: ReminderCategory; date?: string }) => void;
}

export const AddReminderDialog: React.FC<AddReminderDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ReminderCategory>("important-dates");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, content, category, date: date.trim() || undefined });
    setOpen(false);
    setTitle(""); setContent(""); setDate("");
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
            <select className="border rounded px-2 py-1 flex-1"
              value={category} onChange={e=>setCategory(e.target.value as ReminderCategory)}>
              <option value="important-dates">Important Date</option>
              <option value="general-reminders">General Reminder</option>
            </select>
            {category==="important-dates" && (
              <Input type="date" value={date} onChange={e=>setDate(e.target.value)} className="max-w-[130px]" />
            )}
          </div>
          <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Input placeholder="(Optional) Details" value={content} onChange={e=>setContent(e.target.value)} />
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
