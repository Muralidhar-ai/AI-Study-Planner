
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  Settings, 
  Moon, 
  Sun,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isPanicMode: boolean;
  togglePanicMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, setView, isOpen, isDarkMode, toggleDarkMode, isPanicMode, togglePanicMode 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'wizard', label: 'Add Subject', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full flex flex-col p-6">
        <div className="mb-10 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
            SmartStudy
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewType)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium
                ${currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-gray-400'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={togglePanicMode}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all border-2
              ${isPanicMode 
                ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200 dark:shadow-none animate-pulse' 
                : 'bg-white text-red-500 border-red-200 dark:bg-gray-800 dark:border-gray-700'}
            `}
          >
            <AlertTriangle size={18} />
            {isPanicMode ? 'PANIC ACTIVE' : 'PANIC MODE'}
          </button>

          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-lg transition-all ${!isDarkMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
            >
              <Sun size={18} />
            </button>
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-800 text-indigo-400 shadow-sm' : 'text-gray-400'}`}
            >
              <Moon size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
