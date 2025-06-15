
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface Task {
  id: string;
  time: string;
  task: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  flexible: boolean;
}

interface RecalibrateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missedTasks: Task[];
  upcomingTasks: Task[];
}

export const RecalibrateDialog = ({ isOpen, onClose, missedTasks, upcomingTasks }: RecalibrateDialogProps) => {
  const [suggestions, setSuggestions] = useState<Array<{
    action: string;
    task: string;
    newTime?: string;
    reason: string;
  }>>([]);

  React.useEffect(() => {
    if (isOpen && missedTasks.length > 0) {
      generateSuggestions();
    }
  }, [isOpen, missedTasks]);

  const generateSuggestions = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const newSuggestions = [];

    for (const missedTask of missedTasks) {
      if (missedTask.flexible) {
        if (missedTask.priority === 'high') {
          // High priority missed tasks - reschedule ASAP
          const nextSlot = findNextAvailableSlot(currentHour + 1);
          newSuggestions.push({
            action: 'reschedule',
            task: missedTask.task,
            newTime: nextSlot,
            reason: 'High priority task - rescheduled to next available slot'
          });
        } else if (missedTask.priority === 'medium') {
          // Medium priority - reschedule to evening
          newSuggestions.push({
            action: 'reschedule',
            task: missedTask.task,
            newTime: '7:00 PM',
            reason: 'Medium priority - moved to evening'
          });
        } else {
          // Low priority - move to tomorrow
          newSuggestions.push({
            action: 'postpone',
            task: missedTask.task,
            reason: 'Low priority - postponed to tomorrow'
          });
        }
      } else {
        // Non-flexible tasks that were missed
        newSuggestions.push({
          action: 'alert',
          task: missedTask.task,
          reason: 'Fixed time task missed - requires immediate attention'
        });
      }
    }

    setSuggestions(newSuggestions);
  };

  const findNextAvailableSlot = (startHour: number) => {
    // Simple logic to find next available hour
    const availableHours = [10, 11, 14, 15, 16, 19, 20];
    const nextHour = availableHours.find(hour => hour > startHour) || availableHours[0];
    return `${nextHour > 12 ? nextHour - 12 : nextHour}:00 ${nextHour >= 12 ? 'PM' : 'AM'}`;
  };

  const getCurrentAdvice = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour < 9) {
      return "🌅 Good morning! Focus on high-priority tasks first to get back on track.";
    } else if (currentHour < 12) {
      return "☀️ Morning productivity time! Tackle those missed important tasks now.";
    } else if (currentHour < 17) {
      return "🌤️ Afternoon focus! Reschedule flexible tasks to evening and stay on priority items.";
    } else {
      return "🌆 Evening mode! Review what's essential for today and plan tomorrow better.";
    }
  };

  const applyRecalibration = () => {
    // Here you would apply the recalibration logic
    console.log('Applying recalibration suggestions:', suggestions);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Smart Routine Recalibration
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 mb-2">Current Situation Analysis</div>
            <p className="text-blue-800 text-sm">{getCurrentAdvice()}</p>
          </div>

          {suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {suggestion.action === 'reschedule' && <Clock className="h-4 w-4 text-blue-600 mt-0.5" />}
                      {suggestion.action === 'postpone' && <ArrowRight className="h-4 w-4 text-yellow-600 mt-0.5" />}
                      {suggestion.action === 'alert' && <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />}
                      
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {suggestion.task}
                        </div>
                        {suggestion.newTime && (
                          <div className="text-sm text-blue-600 font-medium">
                            New time: {suggestion.newTime}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">
                          {suggestion.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Next Action</span>
            </div>
            <p className="text-green-800 text-sm">
              After applying these changes, focus on your next upcoming task and stick to the new schedule. 
              I'll continue monitoring and help you stay on track!
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={applyRecalibration} className="flex-1">
              Apply Recalibration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
