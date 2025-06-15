
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Clock, Calendar, MessageSquare } from 'lucide-react';
import { RoutineItem } from '@/types/routine';
import { format, parseISO } from 'date-fns';

interface TaskNotesModalProps {
  task: RoutineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskNotesModal = ({ task, isOpen, onClose }: TaskNotesModalProps) => {
  if (!task) return null;

  const hasNotes = task.completionHistory.some(record => record.notes);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            {task.task} - History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">Task Overview</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {task.points} pts
                </span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {task.streak} day streak
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-600 space-y-1">
              <div>Scheduled: {task.time}</div>
              <div>Priority: {task.priority}</div>
              <div>Total completions: {task.completionHistory.length}</div>
            </div>
          </div>

          {task.completionHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No completion history yet</p>
              <p className="text-sm">Complete this task to start tracking notes and progress</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Completion History</h3>
              {task.completionHistory
                .slice()
                .reverse()
                .map((record, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {format(parseISO(record.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(parseISO(record.date), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(record.quality)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          +{record.pointsEarned} pts
                        </span>
                      </div>
                    </div>
                    
                    {record.duration && (
                      <div className="flex items-center gap-1 mb-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          Duration: {Math.floor(record.duration / 60)}:{(record.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="bg-gray-50 rounded p-3 mt-2">
                        <p className="text-sm text-gray-700">{record.notes}</p>
                      </div>
                    )}
                    
                    {!record.notes && (
                      <p className="text-xs text-gray-400 italic">No notes for this completion</p>
                    )}
                  </div>
                ))}
            </div>
          )}

          {!hasNotes && task.completionHistory.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                💡 Try adding notes when completing tasks to track your progress and insights!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
