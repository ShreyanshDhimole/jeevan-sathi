
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Play, Square, CheckCircle, Clock } from 'lucide-react';
import { RoutineItem, CompletionRecord } from '@/types/routine';
import { useToast } from '@/hooks/use-toast';

interface TaskTrackerProps {
  task: RoutineItem;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string, quality: number, notes: string, duration: number) => void;
  onStart: (taskId: string) => void;
}

export const TaskTracker = ({ task, isOpen, onClose, onComplete, onStart }: TaskTrackerProps) => {
  const [quality, setQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
    onStart(task.id);
    toast({
      title: "Task Started! 🚀",
      description: `You've started "${task.task}". Stay focused!`,
    });
  };

  const handleComplete = () => {
    const finalDuration = duration || 0;
    onComplete(task.id, quality, notes, finalDuration);
    
    // Calculate streak bonus
    const streakBonus = task.streak >= 7 ? Math.floor(task.streak / 7) * 50 : 0;
    
    toast({
      title: "Task Completed! 🎉",
      description: `You earned ${task.points + streakBonus} points! Current streak: ${task.streak + 1} days`,
    });
    
    // Reset form
    setQuality(5);
    setNotes('');
    setDuration(0);
    setIsRunning(false);
    setStartTime(null);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {task.task}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Task Details</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {task.points} pts
                </span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {task.streak} day streak
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-600">
              Scheduled: {task.time} | Priority: {task.priority}
            </div>
          </div>

          {task.status !== 'in-progress' ? (
            <Button onClick={handleStart} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Task
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{formatTime(duration)}</div>
                <div className="text-sm text-green-600">Task in progress...</div>
              </div>

              <div>
                <Label>How did you perform? (Quality)</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setQuality(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= quality ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {quality === 5 ? 'Excellent!' : quality === 4 ? 'Good' : quality === 3 ? 'Average' : quality === 2 ? 'Below Average' : 'Poor'}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? Any insights or challenges?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Continue Later
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
