import React from 'react';
import { Lesson } from '../types';
import { GlassCard } from './ui/GlassCard';

interface CourseMapProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  onSelectLesson: (lessonId: string) => void;
}

export const CourseMap: React.FC<CourseMapProps> = ({ lessons, currentLessonIndex, onSelectLesson }) => {
  return (
    <div className="flex flex-col items-center space-y-8 py-20 relative">
      {/* Connecting Line */}
      <div className="absolute top-24 bottom-24 w-1 bg-slate-800 z-0 rounded-full" />
      
      {lessons.map((lesson, index) => {
        const isLocked = index > currentLessonIndex;
        const isCompleted = index < currentLessonIndex;
        const isCurrent = index === currentLessonIndex;

        return (
          <div 
            key={lesson.id} 
            className={`relative z-10 w-full max-w-sm flex flex-col items-center transition-all duration-500 ${isLocked ? 'opacity-50 grayscale' : 'opacity-100'}`}
          >
            <button
              onClick={() => !isLocked && onSelectLesson(lesson.id)}
              disabled={isLocked}
              className={`
                w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg transition-transform hover:scale-110
                ${isCurrent 
                  ? 'bg-slate-900 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] animate-pulse-slow' 
                  : isCompleted 
                    ? 'bg-emerald-900 border-emerald-500' 
                    : 'bg-slate-800 border-slate-700 cursor-not-allowed'}
              `}
            >
              <span className="text-3xl">
                {isCompleted ? '✅' : isLocked ? '🔒' : '🚀'}
              </span>
            </button>
            
            <GlassCard className={`mt-4 text-center p-4 w-64 ${isCurrent ? 'border-cyan-500/50' : ''}`}>
              <h3 className={`font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-200'}`}>
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
            </GlassCard>
          </div>
        );
      })}
    </div>
  );
};