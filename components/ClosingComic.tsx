import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';

const closingDialogs = [
  "Akhirnya aku paham kenapa programku dulu sering error.",
  "Bukan karena Java-nya susah, tapi karena aku belum paham dasarnya.",
  "Sekarang aku tahu kalau setiap variabel harus punya tipe data yang tepat.",
  "Angka disimpan sebagai int atau double, teks sebagai String, dan logika sebagai boolean.",
  "Aku juga jadi lebih hati-hati saat memberi nama variabel.",
  "Identifier yang jelas bikin kode lebih rapi dan mudah dipahami.",
  "Kesalahan kecil seperti salah tipe data atau nama variabel ternyata bisa berdampak besar.",
  "Tapi dengan memahami aturannya, error itu bisa dihindari.",
  "Belajar pemrograman ternyata bukan soal menghafal kode.",
  "Tapi soal memahami konsep dan berpikir logis.",
  "Sekarang aku lebih percaya diri untuk menulis kode Java.",
  "Siap lanjut ke materi pemrograman yang lebih kompleks!",
  "Yuk, terus belajar dan jangan takut mencoba."
];

interface ClosingComicProps {
  onComplete: () => void;
}

export const ClosingComic: React.FC<ClosingComicProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentDialog = closingDialogs[index];

  useEffect(() => {
    setText('');
    setIsTyping(true);
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < currentDialog.length) {
        setText((prev) => currentDialog.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [index, currentDialog]);

  const handleNext = () => {
    if (index < closingDialogs.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Background Ambience - Different tint for closing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />
      
      {/* Confetti / Particle effect container (placeholder for simplicity) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px]"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px]"></div>
      </div>
      
      <div className="z-10 w-full max-w-2xl flex flex-col items-center animate-in slide-in-from-bottom-10 fade-in duration-700">
        
        {/* Character Silhouette - Slightly different styling/color to signify growth */}
        <div className="mb-10 relative">
          <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] relative overflow-hidden flex items-center justify-center z-10">
             {/* Visor - Changed color to Emerald for success */}
             <div className="absolute top-[35%] w-24 h-4 bg-emerald-400 blur-[2px] shadow-[0_0_15px_#34d399]"></div>
             {/* Tech lines */}
             <div className="absolute bottom-4 w-12 h-1 bg-slate-700 rounded-full"></div>
             <div className="absolute bottom-2 w-8 h-1 bg-slate-700 rounded-full"></div>
          </div>
          {/* Shoulders */}
          <div className="w-56 h-28 bg-gradient-to-b from-slate-800 to-transparent rounded-t-[100px] absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-60 border-t border-emerald-500/30"></div>
        </div>

        {/* Dialog Bubble */}
        <GlassCard className="w-full min-h-[220px] flex flex-col justify-between relative border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          {/* Speech bubble tail indicator */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-slate-800 border-t border-l border-emerald-500/50 rotate-45"></div>
          
          <div className="flex-1 flex items-center">
            <p className="text-xl md:text-2xl font-medium text-emerald-50 font-mono leading-relaxed tracking-wide drop-shadow-md">
                {text}
                <span className={`inline-block w-3 h-6 bg-emerald-400 ml-1 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
            </p>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-white/5">
            <NeonButton 
              onClick={handleNext} 
              disabled={isTyping}
              variant="green"
              className={`transition-all duration-300 ${isTyping ? "opacity-50 grayscale" : "animate-pulse-slow hover:animate-none"}`}
            >
              {index === closingDialogs.length - 1 ? "Complete Course" : "Next >>"}
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};