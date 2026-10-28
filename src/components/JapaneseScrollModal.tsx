import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface JapaneseScrollModalProps {
  onComplete: () => void;
  selectedOptionLabel: string;
}

const ADORED_THINGS = [
  { num: '一', text: "The way your eyes crinkle when you laugh so hard you can't breathe 🥹", icon: '👁️' },
  { num: '二', text: "Your smile that instantly deletes all stress from my entire day 🌸", icon: '😊' },
  { num: '三', text: "How ridiculously adorable you look in oversized hoodies with messy hair 🧸", icon: '☁️' },
  { num: '四', text: "That passionate spark in your voice when you talk about things you love ✨", icon: '🎙️' },
  { num: '五', text: "The way your hand fits into mine like they were custom crafted for each other 🤝", icon: '🔒' },
  { num: '六', text: "Your cute dramatic pout whenever you want extra attention 🥺", icon: '🎀' },
  { num: '七', text: "The chaotic memes you send me at ungodly hours of the night 📱", icon: '⚡' },
  { num: '八', text: "How you make sitting together in complete silence feel like pure magic 🛋️", icon: '☕' },
  { num: '九', text: "Your gentle kindness and how deeply you care for the people around you 🤍", icon: '🕊️' },
  { num: '十', text: "Literally every single breath, laugh, and heartbeat of yours 👑", icon: '💖' },
];

export const JapaneseScrollModal: React.FC<JapaneseScrollModalProps> = ({
  onComplete,
  selectedOptionLabel,
}) => {
  // Phases:
  // 1: Tease ("You really think I only like ONE thing about you?!")
  // 2: Scroll Unrolling & Reel Moving
  // 3: Scroll Closes with Ribbon & Final Romantic Flirt Proclamation
  const [phase, setPhase] = useState<'tease' | 'scroll' | 'flirt'>('tease');
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sound.playPop();

    // After 2.2s of teasing, transition to the scroll unroll!
    const t1 = setTimeout(() => {
      setPhase('scroll');
      sound.playScroll();
    }, 2400);

    return () => {
      clearTimeout(t1);
    };
  }, []);

  // Animate the rolling list when in scroll phase
  useEffect(() => {
    if (phase !== 'scroll') return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScrollProgress(progress);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += 1.8;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('flirt');
          sound.playSparkle();
        }, 800);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-[#2D0B16]/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto max-h-screen select-none"
    >
      {/* Ambient Sakura / Star Petals floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 800],
              x: [(i % 2 === 0 ? 30 : -30), (i % 2 === 0 ? -40 : 40)],
              rotate: [0, 360],
              opacity: [0, 0.75, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + (i % 5) * 1.5,
              delay: (i % 6) * 0.7,
              ease: 'linear',
            }}
            className="absolute text-base sm:text-xl"
            style={{
              left: `${(i * 13) % 96}%`,
              top: '-5%',
              color: i % 2 === 0 ? '#E8A0BF' : '#F7D060',
            }}
          >
            {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '✨' : '💖'}
          </motion.div>
        ))}
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-5 right-5 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-all cursor-pointer z-50"
      >
        Skip ➔
      </button>

      {/* Main Interactive Stage */}
      <div className="relative w-full max-w-xl flex flex-col items-center justify-center text-center z-10 py-2">

        {/* Phase 1: Playful Tease */}
        <AnimatePresence mode="wait">
          {phase === 'tease' && (
            <motion.div
              key="tease"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="p-6 sm:p-10 rounded-3xl bg-linear-to-b from-[#FFFDFB] to-[#FFE5EC] border-2 border-[#E8A0BF] shadow-2xl text-center max-w-md w-full"
            >
              <motion.div
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-5xl sm:text-7xl mb-3 sm:mb-4"
              >
                😏💅
              </motion.div>

              <div className="text-xs font-bold uppercase tracking-wider text-[#E8A0BF] mb-2">
                Hold On A Minute...
              </div>

              <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-[#4A1525] leading-snug mb-3">
                Wait... you REALLY think I only like <span className="text-[#E8A0BF] underline decoration-wavy">{selectedOptionLabel}</span> about you?! 😂🤨
              </h2>

              <p className="text-xs sm:text-sm text-[#4A1525]/75 leading-relaxed">
                Did you honestly believe I could narrow down my adoration to just one single thing?! Let me show you what the actual record looks like...
              </p>

              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#E8A0BF]">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Unrolling the sacred comprehensive scroll...</span>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Japanese Scroll (巻物) Unrolling & Continuous List Reel */}
          {phase === 'scroll' && (
            <motion.div
              key="scroll"
              initial={{ scaleX: 0.15, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0.1, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative flex items-center justify-center"
            >
              {/* Left Wooden Scroll Roller */}
              <div className="w-5 sm:w-7 h-[330px] sm:h-[410px] md:h-[450px] bg-linear-to-r from-[#3B111D] via-[#591C2B] to-[#2D0B16] rounded-l-md border-y-4 border-l-2 border-[#F7D060] shadow-2xl shrink-0 flex flex-col justify-between py-2 z-20">
                <div className="w-3 h-3 rounded-full bg-[#F7D060] mx-auto shadow-xs" />
                <div className="text-[10px] text-[#F7D060] font-serif writing-vertical rotate-180 opacity-70">
                  巻物
                </div>
                <div className="w-3 h-3 rounded-full bg-[#F7D060] mx-auto shadow-xs" />
              </div>

              {/* Scroll Parchment Body */}
              <div className="flex-1 h-[310px] sm:h-[390px] md:h-[430px] bg-[#FFF8EE] border-y-4 border-[#85193C] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Traditional Gold Silk Brocade Top Trim */}
                <div className="h-6 bg-linear-to-r from-[#85193C] via-[#A32A4B] to-[#85193C] border-b border-[#F7D060] flex items-center justify-between px-4 text-[10px] text-[#F7D060] font-serif tracking-widest uppercase">
                  <span>✦ 永遠の愛 ✦</span>
                  <span>The Infinite Scroll of Adoration</span>
                  <span>✦ 愛 ✦</span>
                </div>

                {/* Moving Rolling Reel Content */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-3.5 scroll-smooth no-scrollbar"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="text-center py-2 border-b border-[#E8A0BF]/30">
                    <span className="font-serif text-lg font-extrabold text-[#4A1525]">
                      Exhibit A: The Endless List of Things I Love About You
                    </span>
                    <p className="text-[11px] text-[#4A1525]/60 italic mt-0.5">
                      (Documented with 100% scientific romantic accuracy)
                    </p>
                  </div>

                  {ADORED_THINGS.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-[#E8A0BF]/40 shadow-2xs flex items-center gap-3 text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FFE5EC] text-[#4A1525] font-serif font-extrabold text-xs flex items-center justify-center shrink-0 border border-[#E8A0BF]/50">
                        {item.num}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#4A1525] leading-snug">
                        {item.text}
                      </div>
                    </motion.div>
                  ))}

                  <div className="text-center py-4 text-xs font-bold text-[#E8A0BF] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>And infinity more entries currently being written...</span>
                  </div>
                </div>

                {/* Scroll Progress Bar & Bottom Trim */}
                <div className="h-6 bg-linear-to-r from-[#85193C] via-[#A32A4B] to-[#85193C] border-t border-[#F7D060] flex items-center justify-between px-4 text-[10px] text-[#F7D060]">
                  <span>Rolling through memories...</span>
                  <span>{scrollProgress}% Read</span>
                </div>
              </div>

              {/* Right Wooden Scroll Roller */}
              <div className="w-5 sm:w-7 h-[420px] sm:h-[460px] bg-linear-to-l from-[#3B111D] via-[#591C2B] to-[#2D0B16] rounded-r-md border-y-4 border-r-2 border-[#F7D060] shadow-2xl shrink-0 flex flex-col justify-between py-2 z-20">
                <div className="w-3 h-3 rounded-full bg-[#F7D060] mx-auto shadow-xs" />
                <div className="text-[10px] text-[#F7D060] font-serif writing-vertical opacity-70">
                  永遠
                </div>
                <div className="w-3 h-3 rounded-full bg-[#F7D060] mx-auto shadow-xs" />
              </div>
            </motion.div>
          )}

          {/* Phase 3: Scroll Closed with Silk Ribbon & Grand Romantic Flirt */}
          {phase === 'flirt' && (
            <motion.div
              key="flirt"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-[#FFFDFB] to-[#FFE5EC] border-2 border-[#E8A0BF] shadow-2xl text-center max-w-lg w-full relative overflow-hidden"
            >
              {/* Decorative Ribbon Seal */}
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#E8A0BF] to-[#F7D060] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#E8A0BF]/30 mb-4">
                <Heart className="w-8 h-8 fill-white" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D060]/25 text-[#4A1525] text-xs font-extrabold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A0BF]" />
                The Official Verdict
              </div>

              {/* The Big Flirt Headline requested by user */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#4A1525] leading-tight mb-4">
                &ldquo;There’s literally nothing I CAN&apos;T like about you. You&apos;re the whole masterpiece, idiot. 😌💖✨&rdquo;
              </h2>

              <p className="text-sm sm:text-base text-[#4A1525]/85 leading-relaxed mb-6 font-medium">
                Not just your eyes, not just your smile. Every single centimeter, every quirky little habit, every laugh, and every glance—I&apos;m completely, hopelessly down bad for all of it. 🥰💍
              </p>

              {/* Action Button to Complete Question 3 & Reveal Final Score */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onComplete}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-[#E8A0BF] via-[#d685a7] to-[#B5838D] text-white font-bold text-base shadow-xl shadow-[#E8A0BF]/40 hover:shadow-2xl transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Accept The Whole Truth &amp; See Our Score 💖</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
