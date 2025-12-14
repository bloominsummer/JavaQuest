import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px]" />

      <GlassCard className="max-w-md w-full text-center border-t border-white/20">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
          JAVA QUEST
        </h1>
        <p className="text-slate-400 mb-8">Initialize your journey into the code matrix.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Username"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-4 text-center text-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-slate-600"
              autoFocus
            />
          </div>
          <NeonButton type="submit" fullWidth disabled={!name.trim()}>
            Initialize System
          </NeonButton>
        </form>
      </GlassCard>
    </div>
  );
};