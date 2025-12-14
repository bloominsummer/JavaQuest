import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { CourseMap } from './components/CourseMap';
import { LessonView } from './components/LessonView';
import { OpeningComic } from './components/OpeningComic';
import { ClosingComic } from './components/ClosingComic';
import { UserState } from './types';
import { JAVA_COURSE } from './constants';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserState | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('javaquest_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      // Ensure backward compatibility for existing users
      if (parsedUser.hasSeenIntro === undefined) {
        parsedUser.hasSeenIntro = true;
      }
      if (parsedUser.hasSeenOutro === undefined) {
        parsedUser.hasSeenOutro = false;
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // Save to LocalStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('javaquest_user', JSON.stringify(user));
    }
  }, [user]);

  const handleStart = (name: string) => {
    setUser({
      name,
      completedLessonIds: [],
      xp: 0,
      currentLessonIndex: 0,
      hasSeenIntro: false, // New users must see the intro
      hasSeenOutro: false
    });
  };

  const handleIntroComplete = () => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, hasSeenIntro: true };
    });
  };

  const handleOutroComplete = () => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, hasSeenOutro: true };
    });
  };

  const handleLessonSelect = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!user || !activeLessonId) return;

    setUser(prev => {
      if (!prev) return null;
      
      const isNewCompletion = !prev.completedLessonIds.includes(activeLessonId);
      let nextIndex = prev.currentLessonIndex;
      
      if (isNewCompletion) {
        // Unlock next lesson if we just finished the current highest one
        const finishedLessonIdx = JAVA_COURSE.findIndex(l => l.id === activeLessonId);
        if (finishedLessonIdx === prev.currentLessonIndex) {
            nextIndex = finishedLessonIdx + 1;
        }
      }

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        completedLessonIds: isNewCompletion 
          ? [...prev.completedLessonIds, activeLessonId]
          : prev.completedLessonIds,
        currentLessonIndex: nextIndex
      };
    });

    setActiveLessonId(null);
  };

  if (loading) return null;

  // View: Welcome
  if (!user) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // View: Opening Comic (Intro)
  if (!user.hasSeenIntro) {
    return <OpeningComic onComplete={handleIntroComplete} />;
  }

  // View: Active Lesson
  if (activeLessonId) {
    const lesson = JAVA_COURSE.find(l => l.id === activeLessonId);
    if (!lesson) return <div>Error: Lesson not found</div>;
    
    return (
      <LessonView 
        userName={user.name}
        lesson={lesson} 
        onComplete={handleLessonComplete} 
        onExit={() => setActiveLessonId(null)}
      />
    );
  }

  // View: Closing Comic (Outro)
  // Check if all lessons are completed and outro hasn't been seen
  const isCourseComplete = JAVA_COURSE.every(l => user.completedLessonIds.includes(l.id));
  if (isCourseComplete && !user.hasSeenOutro) {
    return <ClosingComic onComplete={handleOutroComplete} />;
  }

  // View: Map (Dashboard)
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black pb-20">
      <Header user={user} totalLessons={JAVA_COURSE.length} />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                Mission Control
            </h2>
            <p className="text-slate-400">Select your next objective</p>
        </div>
        
        <CourseMap 
            lessons={JAVA_COURSE}
            currentLessonIndex={user.currentLessonIndex}
            onSelectLesson={handleLessonSelect}
        />
      </main>
    </div>
  );
};

export default App;