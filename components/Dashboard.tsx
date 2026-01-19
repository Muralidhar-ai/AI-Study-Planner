
import React, { useState, useEffect } from 'react';
import { Subject, StudyTask } from '../types';
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Trash2,
  Play,
  RotateCcw
} from 'lucide-react';
import Pomodoro from './Pomodoro';

interface DashboardProps {
  subjects: Subject[];
  schedule: StudyTask[];
  isPanicMode: boolean;
  deleteSubject: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, schedule, isPanicMode, deleteSubject }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = schedule.filter(t => t.date === today);
  const totalUnits = subjects.reduce((acc, s) => acc + s.totalUnits, 0);
  
  // Simulated progress logic for this UI
  const progressPercent = subjects.length > 0 ? 15 : 0; 

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6">
          <BookOpen size={48} />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Subjects Added Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Add your first subject to generate an automated study plan and beat the exam stress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Today's Focus Card */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium opacity-80 mb-1">Today's Focus</h3>
            {todaysTasks.length > 0 ? (
              <div className="space-y-4">
                <p className="text-3xl font-bold">
                  {todaysTasks[0].subjectName}: Unit {todaysTasks[0].unitNumber}
                </p>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <Clock size={16} /> {todaysTasks[0].durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    <BookOpen size={16} /> 1 session
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xl font-bold italic">No tasks scheduled for today. Take a break!</p>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="glass-card rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="text-teal-500" size={20} /> 
              Next in Line
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syllabus Breakdown</span>
          </div>
          <div className="space-y-3">
            {schedule.slice(0, 5).map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:translate-x-1 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full ${isPanicMode ? 'bg-red-400' : 'bg-indigo-400'}`}></div>
                  <div>
                    <h4 className="font-bold text-sm">{task.subjectName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unit {task.unitNumber} • {task.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Play size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Widgets */}
      <div className="space-y-6">
        {/* Progress Tracker */}
        <div className="glass-card p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold">Progress</h3>
             <TrendingUp className="text-teal-500" size={20} />
          </div>
          <div className="flex items-center justify-center mb-4">
             <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                   <circle 
                    cx="64" cy="64" r="58" 
                    fill="none" stroke="currentColor" strokeWidth="12" 
                    className="text-gray-100 dark:text-gray-700" 
                  />
                   <circle 
                    cx="64" cy="64" r="58" 
                    fill="none" stroke="currentColor" strokeWidth="12" 
                    strokeDasharray={364.42}
                    strokeDashoffset={364.42 - (364.42 * progressPercent / 100)}
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-2xl font-bold">{progressPercent}%</span>
                </div>
             </div>
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            You are {progressPercent}% ready for your exams. Keep going!
          </p>
        </div>

        {/* Pomodoro Timer Widget */}
        <Pomodoro />

        {/* Subjects List */}
        <div className="glass-card p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
          <h3 className="font-bold mb-4">Your Subjects</h3>
          <div className="space-y-3">
            {subjects.map(s => (
              <div key={s.id} className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="truncate pr-2">
                   <p className="font-semibold text-sm truncate">{s.name}</p>
                   <p className="text-[10px] uppercase font-bold text-gray-400">{s.subjectType}</p>
                </div>
                <button 
                  onClick={() => deleteSubject(s.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
