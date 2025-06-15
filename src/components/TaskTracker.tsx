import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Play, Square, CheckCircle, Clock } from 'lucide-react';
import { RoutineItem } from '@/types/routine';
import { useToast } from '@/hooks/use-toast';

// Fix: Define TaskTrackerProps according to usage in Routine.tsx
interface TaskTrackerProps {
  task: RoutineItem;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string, quality: number, notes: string, duration: number) => void;
  onStart: (taskId: string) => void;
}

// Helper type for breaks
type BreakType = "short" | "medium" | "long";
const BREAK_PRESETS = [
  { type: "short" as BreakType, label: "Short Break", defaultDuration: 5 },
  { type: "medium" as BreakType, label: "Medium Break", defaultDuration: 15 },
  { type: "long" as BreakType, label: "Long Break", defaultDuration: 30 }
];

export const TaskTracker = ({ task, isOpen, onClose, onComplete, onStart }: TaskTrackerProps) => {
  const [quality, setQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [breaks, setBreaks] = useState<{ type: BreakType, started: Date, ended?: Date, overTime?: boolean }[]>([]);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakType, setBreakType] = useState<BreakType>("short");
  const [breakTimer, setBreakTimer] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

  const { toast } = useToast();

  // Timer for task
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime && !isOnBreak) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, isOnBreak]);

  // Timer for break
  useEffect(() => {
    let breakInterval: NodeJS.Timeout;
    if (isOnBreak && breakStartTime) {
      breakInterval = setInterval(() => {
        setBreakTimer(Math.floor((Date.now() - breakStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(breakInterval);
  }, [isOnBreak, breakStartTime]);

  // Reset onClose
  useEffect(() => {
    if (!isOpen) {
      setQuality(5);
      setNotes('');
      setDuration(0);
      setIsRunning(false);
      setStartTime(null);
      setIsOnBreak(false);
      setBreaks([]);
      setBreakTimer(0);
      setBreakStartTime(null);
      setBreakType("short");
    }
  }, [isOpen]);

  // Utility
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Prevent timer start if no duration (task.duration)
  const handleStart = () => {
    if (!task.duration || task.duration <= 0) {
      toast({
        title: "Duration Required",
        description: "Please set a time required for this task before starting the timer.",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(true);
    setStartTime(new Date());
    onStart(task.id);
    toast({
      title: "Task Started! 🚀",
      description: `You've started "${task.task}". Stay focused!`,
    });
  };

  // Complete task
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
    setIsOnBreak(false);
    setBreakTimer(0);
    setBreakStartTime(null);
    setBreaks([]);
    setBreakType("short");
    onClose();
  };

  // --- BREAK CONTROL ---
  // Start break
  const handleStartBreak = () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
    setBreakTimer(0);
    setBreaks(prev => [...prev, { type: breakType, started: new Date() }]);
    toast({
      title: "Break Started",
      description: `You've started a ${breakType} break.`
    });
  };

  // End break
  const handleEndBreak = () => {
    if (isOnBreak && breakStartTime) {
      const allowed = BREAK_PRESETS.find(b => b.type === breakType)?.defaultDuration || 5;
      const overTime = breakTimer > allowed * 60;
      // Update last break ended
      setBreaks(prev => {
        const lastIndex = prev.length - 1;
        if (lastIndex >= 0) {
          const updated = [...prev];
          updated[lastIndex] = {
            ...updated[lastIndex],
            ended: new Date(),
            overTime
          };
          return updated;
        }
        return prev;
      });

      setIsOnBreak(false);
      setBreakStartTime(null);
      setBreakTimer(0);
      toast({
        title: overTime ? "Break Exceeded" : "Break Ended",
        description: overTime 
          ? `You exceeded the ${breakType} break limit and may be penalized.`
          : `Break over, back to work!`
      });
    }
  };

  // Penalty notification for overtime break (basic, real penalty logic should update user state)
  useEffect(() => {
    if (isOnBreak && breakStartTime) {
      const allowed = BREAK_PRESETS.find(b => b.type === breakType)?.defaultDuration || 5;
      if (breakTimer > allowed * 60) {
        toast({
          title: "Break Time Exceeded",
          description: `You have exceeded the ${breakType} break limit.`,
          variant: "destructive"
        });
      }
    }
    // eslint-disable-next-line
  }, [breakTimer]);

  const breakCount = breaks.length;
  const breakTime = breaks.reduce((sum, b) => 
    b.ended && b.started ? sum + Math.floor((b.ended.getTime() - b.started.getTime()) / 1000) : sum, 0);

  // --- MAIN UI ---
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] !p-0 overflow-visible"> {/* Fixed padding and allow full width on small screens */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 px-6 pt-6">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {task.task}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 px-6 pb-6 flex flex-col">
          <div className="bg-blue-50 p-4 rounded-lg w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <span className="text-sm font-medium text-blue-800">Task Details</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {task.points} pts
                </span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {task.streak} day streak
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-600 flex flex-wrap gap-2">
              <span>Scheduled: {task.time}</span>
              <span>| Priority: {task.priority}</span>
            </div>
            <div className="text-xs text-gray-500">
              {task.duration ? `Duration: ${task.duration} min` : "No timer for this task"}
            </div>
          </div>

          {!isRunning && !isOnBreak && (
            <Button onClick={handleStart} className="w-full" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Task
            </Button>
          )}

          {isRunning && !isOnBreak && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-center w-full">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">{formatTime(duration)}</div>
                <div className="text-sm text-green-600">Task in progress...</div>
              </div>

              {/* BREAK BUTTON */}
              <div>
                <Label>Need a break?</Label>
                <div className="flex flex-wrap gap-2 mt-1 items-center">
                  {BREAK_PRESETS.map(b => (
                    <Button
                      key={b.type}
                      variant={breakType === b.type ? "default" : "outline"}
                      onClick={() => setBreakType(b.type)}
                      className="flex-1 min-w-[110px]"
                    >
                      {b.label}
                    </Button>
                  ))}
                  <Button onClick={handleStartBreak} className="flex-1 min-w-[110px]">
                    <Square className="h-4 w-4 mr-1" />
                    Start Break
                  </Button>
                </div>
              </div>

              <div>
                <Label>How did you perform? (Quality)</Label>
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setQuality(star)}
                      className="p-1"
                      type="button"
                      tabIndex={0}
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
                  className="w-full resize-none min-h-[64px] max-h-[140px]"
                />
              </div>

              <div className="flex gap-2 pt-4 flex-col sm:flex-row">
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

          {/* BREAK TIMER UI */}
          {isOnBreak && (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg text-center w-full">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-800">{formatTime(breakTimer)}</div>
                <div className="text-sm text-yellow-600">
                  {breakType.charAt(0).toUpperCase() + breakType.slice(1)} Break in progress...
                </div>
              </div>
              <Button onClick={handleEndBreak} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Resume Task
              </Button>
            </div>
          )}

          {/* Overview of breaks in this session */}
          {breakCount > 0 && (
            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-3 max-h-[160px] overflow-y-auto">
              <div>
                Breaks taken: <b>{breakCount}</b> | Total break time: <b>{formatTime(breakTime)}</b>
              </div>
              <div>
                {breaks.map((b, i) => (
                  <div key={i}>
                    #{i + 1}: {b.type} - {b.ended ? `${Math.round(((b.ended.getTime() - b.started.getTime())/60000)*100)/100} min` : 'Ongoing'} {b.overTime ? "(exceeded)" : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
