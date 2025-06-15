import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    task: string;
    priority: 'high' | 'medium' | 'low';
    preferredTime: string;
    flexible: boolean;
    points: number;
    duration: number;
    description: string;
  }) => void;
}

export const AddTaskDialog = ({ isOpen, onClose, onAddTask }: AddTaskDialogProps) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [preferredTime, setPreferredTime] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState([50]);
  const [duration, setDuration] = useState(""); // New: duration in minutes

  const handleSubmit = () => {
    if (!taskName.trim() || !preferredTime || !duration || isNaN(Number(duration)) || Number(duration) <= 0) return;

    onAddTask({
      task: taskName,
      priority,
      preferredTime,
      flexible,
      points: points[0],
      duration: Number(duration),
      description,
    });

    // Reset form
    setTaskName("");
    setPriority('medium');
    setPreferredTime("");
    setFlexible(true);
    setDescription("");
    setPoints([50]);
    setDuration("");
    onClose();
  };

  const suggestOptimalTime = () => {
    const now = new Date();
    const suggestedHour = Math.min(now.getHours() + 2, 23);
    const timeString = `${suggestedHour > 12 ? suggestedHour - 12 : suggestedHour}:00 ${suggestedHour >= 12 ? 'PM' : 'AM'}`;
    setPreferredTime(timeString);
  };

  const getPointsSuggestion = () => {
    const basePts = priority === 'high' ? 100 : priority === 'medium' ? 50 : 25;
    return `Suggested: ${basePts} points`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Complete project proposal"
            />
          </div>

          <div>
            <Label>Priority Level</Label>
            <RadioGroup value={priority} onValueChange={(value: 'high' | 'medium' | 'low') => setPriority(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-red-600">High - Must do today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-yellow-600">Medium - Should do today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-green-600">Low - Can be postponed</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <div className="flex gap-2">
              <Input
                id="preferredTime"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="e.g., 2:00 PM"
              />
              <Button variant="outline" onClick={suggestOptimalTime}>
                Suggest
              </Button>
            </div>
          </div>

          <div>
            <Label>Flexibility</Label>
            <RadioGroup value={flexible ? "yes" : "no"} onValueChange={(value) => setFlexible(value === "yes")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="flexible-yes" />
                <Label htmlFor="flexible-yes">Flexible - Can be rescheduled if needed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="flexible-no" />
                <Label htmlFor="flexible-no">Fixed - Must be done at this time</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="duration">Time Required (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g., 30"
              min={1}
              inputMode="numeric"
              required
            />
            <span className="text-xs text-gray-500">Required. Must be a positive number.</span>
          </div>

          <div>
            <Label>Points System</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Points for completion:</span>
                <span className="font-bold text-green-600">{points[0]} points</span>
              </div>
              <Slider
                value={points}
                onValueChange={setPoints}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-gray-500 flex justify-between">
                <span>10 pts</span>
                <span className="text-blue-600">{getPointsSuggestion()}</span>
                <span>200 pts</span>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-sm">
                <div className="font-medium text-orange-800 mb-1">⚠️ Points System</div>
                <div className="text-orange-700">
                  • Earn <span className="font-semibold text-green-600">+{points[0]} points</span> on completion
                  • Lose <span className="font-semibold text-red-600">-{points[0]} points</span> if missed
                  • Streak bonuses: 7+ days = +50 pts, 30+ days = +100 pts
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={
              !taskName.trim() || !preferredTime || !duration || isNaN(Number(duration)) || Number(duration) <= 0
            }>
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
