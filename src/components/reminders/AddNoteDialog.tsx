
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { NoteCategory } from "@/types/reminders";

interface AddNoteDialogProps {
  onAdd: (note: { title: string; content: string; category: NoteCategory; author?: string; status?: string }) => void;
}

export const AddNoteDialog: React.FC<AddNoteDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<NoteCategory>("quotes");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, content, category, author: author.trim()||undefined, status: status.trim()||undefined });
    setOpen(false);
    setTitle(""); setContent(""); setAuthor(""); setStatus("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">+ Add Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <select className="border rounded px-2 py-1 w-full"
            value={category} onChange={e=>setCategory(e.target.value as NoteCategory)}>
            <option value="quotes">Motivating Quote</option>
            <option value="technology">Technology</option>
            <option value="books">Book</option>
            <option value="movies">Movie</option>
          </select>
          <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <Input placeholder="(Optional) Details" value={content} onChange={e=>setContent(e.target.value)} />
          {category==="quotes" && (
            <Input placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
          )}
          {(category==="books" || category==="movies") && (
            <Input placeholder="Status (to-read, reading, completed, etc)" value={status} onChange={e=>setStatus(e.target.value)} />
          )}
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
