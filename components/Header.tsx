import React from 'react';
import { UserState } from '../types';

interface HeaderProps {
  user: UserState;
  totalLessons: number;
}

export const Header: React.FC<HeaderProps> = ({ user, totalLessons }) => {
  const progressPercent = Math.round((user.completedLessonIds.length / totalLessons) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-4 md:px-8 justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block">
          <p className="text-xs text-cyan-400 uppercase tracking-widest">Cadet</p>
          <h3 className="font-bold text-white">{user.name}</h3>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="flex justify-between text-xs mb-1 text-slate-300">
          <span>System Synchronization</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-yellow-400">⚡</span>
        <span className="font-mono text-yellow-400 font-bold">{user.xp} XP</span>
      </div>
    </header>
  );
};