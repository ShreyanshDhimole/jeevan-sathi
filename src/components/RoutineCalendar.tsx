
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Calendar className="h-6 w-6 text-purple-600" />
            Routine Calendar
            <button 
              onClick={onClose}
              className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-2 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full pointer-events-auto bg-white"
                modifiers={{
                  hasCompletions: (date) => hasCompletionsOnDate(date)
                }}
                modifiersStyles={{
                  hasCompletions: {
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 'bold',
                    borderRadius: '6px'
                  }
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md",
                  day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md",
                  day_selected: "bg-purple-600 text-white hover:bg-purple-700",
                  day_today: "bg-blue-100 text-blue-900 font-semibold",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-30",
                }}
              />
            </div>
            <div className="text-sm text-gray-600 bg-green-50 border border-green-200 p-3 rounded-lg">
              💡 <strong>Green dates</strong> have completed tasks with notes and progress data
            </div>
          </div>

          <div className="space-y-4">
            {selectedDate && (
              <>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3 text-lg">
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center bg-white/70 rounded-lg p-3">
                      <div className="font-bold text-purple-700 text-xl">{selectedDateStats.totalTasks}</div>
                      <div className="text-purple-600">Tasks</div>
                    </div>
                    <div className="text-center bg-white/70 rounded-lg p-3">
                      <div className="font-bold text-purple-700 text-xl">{selectedDateStats.totalPoints}</div>
                      <div className="text-purple-600">Points</div>
                    </div>
                    <div className="text-center bg-white/70 rounded-lg p-3">
                      <div className="font-bold text-purple-700 text-xl">{selectedDateStats.avgQuality.toFixed(1)}★</div>
                      <div className="text-purple-600">Avg Quality</div>
                    </div>
                  </div>
                </div>

                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No completed tasks on this date</p>
                    <p className="text-sm">Tasks completed on this day will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <h4 className="font-semibold text-gray-900 text-lg">Completed Tasks</h4>
                    {selectedDateTasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">{task.task}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {task.points} pts
                            </span>
                          </div>
                        </div>
                        
                        {task.completionsForDate.map((completion, index) => (
                          <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-3 mt-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 font-medium">
                                  {format(parseISO(completion.date), 'h:mm a')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(completion.quality)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            
                            {completion.notes && (
                              <div className="bg-white border border-gray-200 rounded p-2 mt-2">
                                <p className="text-sm text-gray-700">{completion.notes}</p>
                              </div>
                            )}
                            
                            {!completion.notes && (
                              <p className="text-xs text-gray-400 italic">No notes for this completion</p>
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
