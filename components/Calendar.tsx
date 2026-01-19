
import React, { useState } from 'react';
import { StudyTask } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

interface CalendarProps {
  schedule: StudyTask[];
}

const Calendar: React.FC<CalendarProps> = ({ schedule }) => {
  const [viewDate, setViewDate] = useState(new Date());

  // Generate 14 days from viewDate
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(viewDate);
    d.setDate(viewDate.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const getTasksForDay = (date: string) => schedule.filter(t => t.date === date);

  return (
    <div className="glass-card rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
            <CalIcon size={20} />
          </div>
          <div>
             <h3 className="font-bold">Two-Week Road</h3>
             <p className="text-xs text-gray-500">Overview of upcoming units</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => {
              const prev = new Date(viewDate);
              prev.setDate(viewDate.getDate() - 14);
              setViewDate(prev);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
           >
             <ChevronLeft size={20} />
           </button>
           <button 
             onClick={() => {
               const next = new Date(viewDate);
               next.setDate(viewDate.getDate() + 14);
               setViewDate(next);
             }}
             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
           >
             <ChevronRight size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((date) => {
          const dayTasks = getTasksForDay(date);
          const isToday = new Date().toISOString().split('T')[0] === date;
          const displayDate = new Date(date);

          return (
            <div 
              key={date} 
              className={`
                min-h-[160px] p-4 rounded-xl border-2 transition-all
                ${isToday 
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' 
                  : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}
              `}
            >
              <p className={`text-[10px] font-black uppercase mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                {displayDate.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="font-bold text-lg mb-4">{displayDate.getDate()}</p>
              
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <div key={task.id} className="text-[10px] p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded font-bold truncate">
                    {task.subjectName}: U{task.unitNumber}
                  </div>
                ))}
                {dayTasks.length === 0 && (
                  <p className="text-[10px] text-gray-400 italic">Rest day</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
