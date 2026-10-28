import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface Stage2Props {
  onComplete: () => void;
}

interface FloatingGameHeart {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  speedY: number;
  speedX: number;
  color: string;
}

const CATCH_PRAISES = [
  'Got one! 💫',
  'Two down, you’re good at this! 🥰',
  'More than halfway there! 💖',
  'Just one more to go...! 🌸',
];

export const Stage2Arcade: React.FC<Stage2Props> = ({ onComplete }) => {
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [heartsList, setHeartsList] = useState<FloatingGameHeart[]>([]);
  const [catchParticles, setCatchParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // The Grand Expanding Blooming Heart on the 5th catch
  const [showBloomingHeart, setShowBloomingHeart] = useState(false);
  const [bloomOrigin, setBloomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Initialize floating hearts
  const initGame = () => {
    setHeartsCaught(0);
    setIsFinishing(false);
    setShowBloomingHeart(false);

    const colors = ['#E8A0BF', '#FF758F', '#F7D060', '#FFCAD4', '#FF4D6D', '#B5838D'];
    const initial: FloatingGameHeart[] = Array.from({ length: 7 }, (_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 65,
      size: Math.floor(Math.random() * 12) + 38,
      speedY: (Math.random() - 0.5) * 0.38,
      speedX: (Math.random() - 0.5) * 0.38,
      color: colors[i % colors.length],
    }));
    setHeartsList(initial);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Floating hearts physics animation loop
  const requestRef = useRef<number | null>(null);
  useEffect(() => {
    if (isFinishing) return;

    const animateHearts = () => {
      setHeartsList((prev) =>
        prev.map((h) => {
          let newX = h.x + h.speedX;
          let newY = h.y + h.speedY;
          let newSpeedX = h.speedX;
          let newSpeedY = h.speedY;

          // Bounce off bounds
          if (newX < 8 || newX > 88) newSpeedX = -newSpeedX;
          if (newY < 8 || newY > 82) newSpeedY = -newSpeedY;

          return {
            ...h,
            x: Math.max(8, Math.min(88, newX)),
            y: Math.max(8, Math.min(82, newY)),
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );
      requestRef.current = requestAnimationFrame(animateHearts);
    };

    requestRef.current = requestAnimationFrame(animateHearts);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isFinishing]);

  // Guaranteed smooth transition to next screen once blooming heart appears
  useEffect(() => {
    if (!showBloomingHeart) return;

    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [showBloomingHeart, onComplete]);

  // Click or Touch / Catch Heart Handler
  const handleCatchHeart = (
    heart: FloatingGameHeart,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    if (isFinishing) return;

    const nextCount = heartsCaught + 1;
    setHeartsCaught(nextCount);

    // Particle Burst at click or tap location
    try {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const parentRect = target.parentElement?.getBoundingClientRect();
      if (parentRect && parentRect.width > 0 && parentRect.height > 0) {
        const clickX = rect.left - parentRect.left + rect.width / 2;
        const clickY = rect.top - parentRect.top + rect.height / 2;
        const pId = Date.now();
        setCatchParticles((prev) => [...prev, { id: pId, x: clickX, y: clickY }]);
        setTimeout(() => {
          setCatchParticles((prev) => prev.filter((p) => p.id !== pId));
        }, 700);

        setBloomOrigin({
          x: Math.max(10, Math.min(90, (clickX / parentRect.width) * 100)),
          y: Math.max(10, Math.min(90, (clickY / parentRect.height) * 100)),
        });
      }
    } catch {
      // Safe fallback
      setBloomOrigin({ x: 50, y: 50 });
    }

    if (nextCount < 5) {
      // Normal catch: play pop and respawn heart elsewhere
      sound.playPop();
      const colors = ['#E8A0BF', '#FF758F', '#F7D060', '#FFCAD4', '#FF4D6D', '#B5838D'];
      setHeartsList((prev) =>
        prev.map((h) =>
          h.id === heart.id
            ? {
                ...h,
                x: 15 + Math.random() * 70,
                y: 15 + Math.random() * 65,
                color: colors[Math.floor(Math.random() * colors.length)],
              }
            : h
        )
      );
    } else {
      // FINAL 5TH HEART CAUGHT!
      sound.playFanfare();
      sound.playKiss();
      setIsFinishing(true);
      setShowBloomingHeart(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Stage Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-8"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-[#E8A0BF] mb-2 inline-block">
          Phase 02 · The Heart Catcher
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1525] tracking-tight text-balance mb-3">
          Catch The Floating Hearts
        </h1>
        <p className="text-sm sm:text-base text-[#4A1525]/75 max-w-md mx-auto">
          Tap or click on 5 drifting hearts to capture my full undivided attention.
        </p>

        {/* Catch Counter Bar */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i < heartsCaught
                  ? 'w-8 bg-linear-to-r from-[#E8A0BF] to-[#FF4D6D]'
                  : 'w-4 bg-[#E8A0BF]/30'
              }`}
            />
          ))}
        </div>
        <div className="text-xs font-bold text-[#4A1525]/70 mt-2 tabular-nums">
          {heartsCaught} / 5 Hearts Caught
          {heartsCaught > 0 && heartsCaught < 5 && (
            <span className="text-[#E8A0BF] ml-2 font-medium">
              — {CATCH_PRAISES[heartsCaught - 1]}
            </span>
          )}
        </div>
      </motion.div>

      {/* Main Interactive Heart Catcher Arena */}
      <div className="bg-[#FFFDFB] border border-[#E8A0BF]/30 rounded-3xl p-4 sm:p-7 shadow-xl shadow-[#E8A0BF]/15 relative overflow-hidden backdrop-blur-xs">
        {/* Decorative corner glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FFE5EC] rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#F7D060]/20 rounded-full blur-2xl pointer-events-none opacity-60" />

        {/* The Floating Canvas Area */}
        <div className="relative w-full min-h-[350px] sm:min-h-[420px] bg-linear-to-b from-[#FFFBF5] via-[#FFF8F0] to-[#FFE5EC]/30 rounded-2xl border border-[#E8A0BF]/25 overflow-hidden select-none touch-none cursor-crosshair">
          
          {/* Sparkle Click Particles */}
          {catchParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute pointer-events-none text-2xl -translate-x-1/2 -translate-y-1/2"
              style={{ left: p.x, top: p.y }}
            >
              ✨💖
            </motion.div>
          ))}

          {/* Active Floating Hearts */}
          {!showBloomingHeart &&
            heartsList.map((heart) => (
              <button
                key={heart.id}
                type="button"
                onClick={(e) => handleCatchHeart(heart, e)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCatchHeart(heart, e);
                }}
                style={{
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                }}
                className="absolute p-3 -translate-x-1/2 -translate-y-1/2 transform transition-transform hover:scale-130 active:scale-90 focus:outline-hidden cursor-pointer z-10 touch-manipulation"
                aria-label="Catch floating heart"
              >
                <Heart
                  className="animate-pulse filter drop-shadow-md"
                  style={{
                    width: heart.size,
                    height: heart.size,
                    color: heart.color,
                    fill: heart.color,
                  }}
                />
              </button>
            ))}

          {/* THE GRAND BLOOMING HEART & ROMANTIC EXCLAMATION OVERLAY */}
          <AnimatePresence>
            {showBloomingHeart && (
              <motion.div
                key="blooming-heart-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-8 z-30 overflow-y-auto max-h-full bg-white/92 backdrop-blur-md"
              >
                {/* 1st Giant Expanding Ripple Heart */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 4.8, opacity: 0 }}
                  transition={{
                    duration: 2.2,
                    ease: 'easeOut',
                  }}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${bloomOrigin.x}%`,
                    top: `${bloomOrigin.y}%`,
                  }}
                >
                  <Heart className="w-48 h-48 sm:w-64 sm:h-64 text-[#FF4D6D] fill-[#FF4D6D] drop-shadow-2xl" />
                </motion.div>

                {/* 2nd Echoing Ripple Heart */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.8 }}
                  animate={{ scale: 4.0, opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    delay: 0.35,
                    ease: 'easeOut',
                  }}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${bloomOrigin.x}%`,
                    top: `${bloomOrigin.y}%`,
                  }}
                >
                  <Heart className="w-40 h-40 sm:w-52 sm:h-52 text-[#E8A0BF] fill-[#E8A0BF] drop-shadow-lg" />
                </motion.div>

                {/* Floating ambient romantic emojis */}
                {['✨', '💖', '🌸', '💕', '💍', '🥹', '✨'].map((emoji, idx) => (
                  <motion.div
                    key={idx}
                    initial={{
                      y: 60,
                      opacity: 0,
                      x: (idx - 3) * 45,
                    }}
                    animate={{
                      y: -140,
                      opacity: [0, 1, 0],
                      x: (idx - 3) * 55 + (Math.random() - 0.5) * 30,
                    }}
                    transition={{
                      duration: 2.2,
                      delay: 0.1 * idx,
                      ease: 'easeOut',
                    }}
                    className="absolute pointer-events-none text-2xl sm:text-3xl select-none"
                  >
                    {emoji}
                  </motion.div>
                ))}

                {/* Center Core Heart Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-tr from-[#FF4D6D] to-[#E8A0BF] p-1 shadow-2xl shadow-[#FF4D6D]/40 mb-3 sm:mb-4 flex items-center justify-center text-white z-40"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-[#FF4D6D] text-[#FF4D6D] animate-bounce" />
                  </div>
                </motion.div>

                {/* The Romantic Exclamation requested by user */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="max-w-md space-y-2 sm:space-y-3 z-40 px-2"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EC] text-[#FF4D6D] text-[11px] sm:text-xs font-extrabold uppercase tracking-widest shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    Heart Captured!
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#4A1525] leading-tight">
                    &ldquo;...Exactly how you caught my heart! 🥹💖💍✨&rdquo;
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4A1525]/85 font-medium leading-relaxed max-w-sm mx-auto">
                    You didn&apos;t just catch these floating hearts—you stole mine effortlessly from the very beginning.
                  </p>

                  {/* Auto-advance progress bar + Instant Action Button */}
                  <div className="pt-3 flex flex-col items-center gap-2">
                    <div className="w-48 h-1.5 bg-[#E8A0BF]/25 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.0, ease: 'linear' }}
                        className="h-full bg-linear-to-r from-[#E8A0BF] to-[#FF4D6D] rounded-full"
                      />
                    </div>

                    <span className="text-[11px] text-[#E8A0BF] font-semibold">
                      Proceeding to the big moment... ✨
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        onComplete();
                      }}
                      className="mt-1 px-6 py-2.5 rounded-full bg-linear-to-r from-[#E8A0BF] via-[#e283a8] to-[#FF4D6D] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer z-50"
                    >
                      <span>Take Me To The Question 💖</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer Hint */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#4A1525]/60">
          <span>Click each heart before it drifts away</span>
          <span className="font-medium text-[#E8A0BF]">5 catches to reveal</span>
        </div>
      </div>
    </div>
  );
};
