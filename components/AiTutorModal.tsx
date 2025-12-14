import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';
import { AiChatMessage } from '../types';
import { askAiTutor } from '../services/geminiService';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    { role: 'model', text: 'Greetings, Cadet. I am CyberSensei. How can I assist with your Java code today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: AiChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const answer = await askAiTutor(input, context);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-lg h-[600px] flex flex-col relative border-cyan-500/30">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <span className="animate-pulse">🤖</span> CyberSensei
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-100' 
                    : 'bg-slate-700/50 border border-slate-600 text-slate-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-slate-700/50 border border-slate-600 p-3 rounded-lg text-sm text-slate-400 animate-pulse">
                 Processing...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Java..."
            className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 text-white"
          />
          <NeonButton onClick={handleSend} disabled={loading} className="py-2 px-4 text-sm">
            Send
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
};