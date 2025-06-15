
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Star, Clock, CheckCircle, X } from 'lucide-react';
import { RoutineItem } from '@/types/routine';
import { format, isSameDay, parseISO } from 'date-fns';

interface RoutineCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  routineItems: RoutineItem[];
}

export const RoutineCalendar = ({ isOpen, onClose, routineItems }: RoutineCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return routineItems.map(task => {
      const completionsForDate = task.completionHistory.filter(record => 
        isSameDay(parseISO(record.date), date)
      );
      
      return {
        ...task,
        completionsForDate
      };
    }).filter(task => task.completionsForDate.length > 0);
  };

  const getDateStats = (date: Date) => {
    const tasksForDate = getTasksForDate(date);
    const totalTasks = tasksForDate.length;
    const totalPoints = tasksForDate.reduce((sum, task) => 
      sum + task.completionsForDate.reduce((taskSum, completion) => taskSum + completion.pointsEarned, 0), 0
    );
    const avgQuality = totalTasks > 0 ? 
      tasksForDate.reduce((sum, task) => 
        sum + task.completionsForDate.reduce((taskSum, completion) => taskSum + completion.quality, 0), 0
      ) / totalTasks : 0;

    return { totalTasks, totalPoints, avgQuality };
  };

  const hasCompletionsOnDate = (date: Date) => {
    return routineItems.some(task => 
      task.completionHistory.some(record => isSameDay(parseISO(record.date), date))
    );
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateStats = selectedDate ? getDateStats(selectedDate) : { totalTasks: 0, totalPoints: 0, avgQuality: 0 };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Routine Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasCompletions: (date) => hasCompletionsOnDate(date)
              }}
              modifiersStyles={{
                hasCompletions: {
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
              💡 Green dates have completed tasks with notes
            </div>
          </div>

          <div className="space-y-4">
            {selectedDate && (
              <>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-purple-700">{selectedDateStats.totalTasks}</div>
                      <div className="text-purple-600">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-700">{selectedDateStats.totalPoints}</div>
                      <div className="text-purple-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-700">{selectedDateStats.avgQuality.toFixed(1)}★</div>
                      <div className="text-purple-600">Avg Quality</div>
                    </div>
                  </div>
                </div>

                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No completed tasks on this date</p>
                    <p className="text-sm">Tasks completed on this day will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <h4 className="font-medium text-gray-900">Completed Tasks</h4>
                    {selectedDateTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{task.task}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {task.points} pts
                            </span>
                          </div>
                        </div>
                        
                        {task.completionsForDate.map((completion, index) => (
                          <div key={index} className="bg-gray-50 rounded p-2 mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {format(parseISO(completion.date), 'h:mm a')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(completion.quality)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            
                            {completion.notes && (
                              <p className="text-xs text-gray-700 mt-1">{completion.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
