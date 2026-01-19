
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  Settings, 
  Moon, 
  Sun,
  Zap,
  Download,
  Menu,
  X
} from 'lucide-react';
import { Subject, ViewType, StudyTask } from './types';
import { generateSchedule } from './utils/algorithm';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import SetupWizard from './components/SetupWizard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  // State
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('study_subjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [isPanicMode, setIsPanicMode] = useState<boolean>(() => {
    return localStorage.getItem('panic_mode') === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('dark_mode') === 'true';
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derived Schedule
  const schedule = useMemo(() => generateSchedule(subjects, isPanicMode), [subjects, isPanicMode]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('panic_mode', isPanicMode.toString());
  }, [isPanicMode]);

  useEffect(() => {
    localStorage.setItem('dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const addSubject = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
    setCurrentView('dashboard');
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const toggleTaskCompletion = (taskId: string) => {
    // In a real app we'd track specific task IDs in storage
    // For this simple version, we'll simulate progress by updating subject units
    // or we could store a completedTasks array. Let's do a quick update on subject progress.
  };

  const exportSchedule = () => {
    const text = schedule.map(t => `${t.date}: ${t.subjectName} - Unit ${t.unitNumber} (${t.durationMinutes}m)`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study_schedule.txt';
    a.click();
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm z-50">
        <h1 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Zap size={20} /> SmartStudy
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setView={(v) => { setCurrentView(v); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isPanicMode={isPanicMode}
        togglePanicMode={() => setIsPanicMode(!isPanicMode)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {currentView === 'dashboard' && "Daily Overview"}
                {currentView === 'calendar' && "Upcoming Schedule"}
                {currentView === 'wizard' && "Add New Subject"}
                {currentView === 'settings' && "Preferences"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {isPanicMode ? "🚨 Panic Mode Active: Focusing on high-impact units." : "Stay calm, follow the plan."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={exportSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all text-sm font-medium"
              >
                <Download size={16} /> Export .txt
              </button>
              {currentView !== 'wizard' && (
                <button 
                  onClick={() => setCurrentView('wizard')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all text-sm font-medium"
                >
                  <PlusCircle size={16} /> New Subject
                </button>
              )}
            </div>
          </header>

          <div className="space-y-6">
            {currentView === 'dashboard' && (
              <Dashboard 
                subjects={subjects} 
                schedule={schedule} 
                isPanicMode={isPanicMode}
                deleteSubject={deleteSubject}
              />
            )}
            {currentView === 'calendar' && (
              <Calendar schedule={schedule} />
            )}
            {currentView === 'wizard' && (
              <SetupWizard onAdd={addSubject} onCancel={() => setCurrentView('dashboard')} />
            )}
            {currentView === 'settings' && (
              <div className="glass-card p-8 rounded-2xl shadow-xl space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Account & Data</h3>
                  <button 
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
