
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const Pomodoro: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      // Trigger notification
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Audio play blocked'));
      
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60);
        alert("Work session complete! Take a 5-minute break.");
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
        alert("Break over! Time to focus.");
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          {isBreak ? <Coffee className="text-teal-500" size={18} /> : <Clock className="text-indigo-500" size={18} />}
          {isBreak ? 'Quick Break' : 'Focus Timer'}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isBreak ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'}`}>
          {isBreak ? 'Relaxing' : 'Pomodoro'}
        </span>
      </div>

      <div className="text-center">
        <div className="text-4xl font-mono font-black mb-6 tracking-widest text-slate-800 dark:text-slate-100">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={toggleTimer}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all
              ${isActive 
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none'}
            `}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button 
            onClick={resetTimer}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Clock: React.FC<{className?: string, size?: number}> = ({className, size}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Pomodoro;
