import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface FairyCutsceneProps {
  onComplete: () => void;
}

export const FairyCutscene: React.FC<FairyCutsceneProps> = ({ onComplete }) => {
  // Stages:
  // 0: Initial dreamy white flash
  // 1: Fairy flies in
  // 2: Fairy examines & picks up the bad card
  // 3: Magic poof! Replaces card with the gorgeous glowing one
  // 4: Fairy delivers heartfelt message & blows a kiss
  // 5: Fairy flies away gracefully
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Sound: Fairy enters
    sound.playFairyArrival();

    const t1 = setTimeout(() => {
      setStage(1); // Fairy descends
    }, 600);

    const t2 = setTimeout(() => {
      setStage(2); // Fairy picks up bad card
    }, 1800);

    const t3 = setTimeout(() => {
      sound.playMagicPoof();
      setStage(3); // Wand poof! Card replaced!
    }, 3200);

    const t4 = setTimeout(() => {
      sound.playKiss();
      setStage(4); // Blows a kiss & message
    }, 4500);

    const t5 = setTimeout(() => {
      setStage(5); // Fairy departs
    }, 6400);

    const t6 = setTimeout(() => {
      onComplete(); // Finish cutscene and fade back
    }, 7400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-[#FFFDFB]/96 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto max-h-screen select-none"
    >
      {/* Dreamy Ambient Fairy Dust Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFE5EC]/60 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F7D060]/20 rounded-full blur-3xl" />
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5 + (i % 4) * 0.5,
              delay: (i % 5) * 0.3,
            }}
            className="absolute text-xs"
            style={{
              left: `${(i * 19) % 95}%`,
              top: `${(i * 23) % 90}%`,
              color: i % 2 === 0 ? '#E8A0BF' : '#F7D060',
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* Skip Button in the corner */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-5 right-5 text-xs font-semibold text-[#4A1525]/60 hover:text-[#4A1525] bg-white/80 px-3 py-1.5 rounded-full border border-[#E8A0BF]/30 transition-all cursor-pointer z-50 shadow-xs"
      >
        Skip ➔
      </button>

      {/* Main Cutscene Stage */}
      <div className="relative w-full max-w-lg min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center text-center z-10 py-4">
        
        {/* Animated Cute Fairy Character */}
        <motion.div
          animate={
            stage === 0
              ? { y: -160, opacity: 0, scale: 0.7 }
              : stage === 1
              ? { y: -30, opacity: 1, scale: 1 }
              : stage === 2 || stage === 3
              ? { y: -45, opacity: 1, scale: 1.05 }
              : stage === 4
              ? { y: -35, opacity: 1, scale: 1.1 }
              : { y: -220, x: 120, opacity: 0, scale: 0.6 } // flying away
          }
          transition={{
            type: 'spring',
            stiffness: 90,
            damping: 14,
            duration: 1,
          }}
          className="relative z-20 flex flex-col items-center mb-4"
        >
          {/* Wings + Fairy Body Container */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Left Fluttering Wing */}
            <motion.div
              animate={{ rotate: [-20, 18, -20], scaleX: [0.85, 1.1, 0.85] }}
              transition={{ repeat: Infinity, duration: 0.22, ease: 'easeInOut' }}
              className="absolute -left-5 top-2 w-14 h-18 bg-linear-to-tl from-[#FFCAD4]/80 to-[#FFE5EC]/40 rounded-full border border-white/80 shadow-md origin-right blur-[0.3px]"
            />

            {/* Right Fluttering Wing */}
            <motion.div
              animate={{ rotate: [20, -18, 20], scaleX: [0.85, 1.1, 0.85] }}
              transition={{ repeat: Infinity, duration: 0.22, ease: 'easeInOut' }}
              className="absolute -right-5 top-2 w-14 h-18 bg-linear-to-tr from-[#FFCAD4]/80 to-[#FFE5EC]/40 rounded-full border border-white/80 shadow-md origin-left blur-[0.3px]"
            />

            {/* Fairy Character Illustration */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Floral Halo Crown */}
              <div className="w-10 h-3 -mb-1 bg-[#F7D060]/40 rounded-full border border-[#F7D060] flex items-center justify-around px-1 shadow-xs">
                <span className="text-[7px]">🌸</span>
                <span className="text-[7px]">✨</span>
                <span className="text-[7px]">🌸</span>
              </div>

              {/* Head & Face */}
              <div className="w-14 h-14 rounded-full bg-[#FFEAE5] border-2 border-[#E8A0BF] relative flex items-center justify-center shadow-md">
                {/* Flowing Pastel Hair */}
                <div className="absolute -top-1.5 inset-x-0 h-6 bg-[#E8A0BF] rounded-t-full -z-10" />

                {/* Cute Eyes & Expression */}
                <div className="flex items-center gap-2 pt-1">
                  {stage >= 4 ? (
                    /* Winking Happy Eyes */
                    <>
                      <div className="text-xs font-bold text-[#4A1525]">^</div>
                      <div className="text-xs font-bold text-[#4A1525]">~</div>
                    </>
                  ) : (
                    /* Big Sparkly Cute Eyes */
                    <>
                      <div className="w-2.5 h-3 bg-[#4A1525] rounded-full relative flex items-start justify-end p-0.5">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                      <div className="w-2.5 h-3 bg-[#4A1525] rounded-full relative flex items-start justify-end p-0.5">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                    </>
                  )}
                </div>

                {/* Cute Rosy Blush Cheeks */}
                <div className="absolute bottom-3 left-1.5 w-2.5 h-1.5 bg-[#FF8FA3]/60 rounded-full blur-[0.5px]" />
                <div className="absolute bottom-3 right-1.5 w-2.5 h-1.5 bg-[#FF8FA3]/60 rounded-full blur-[0.5px]" />

                {/* Sweet Mouth / Kiss */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center text-[10px]">
                  {stage >= 4 ? '😚' : '‿'}
                </div>
              </div>

              {/* Fairy Pastel Dress */}
              <div className="w-9 h-9 -mt-1 bg-linear-to-b from-[#E8A0BF] to-[#FFCAD4] rounded-b-2xl border border-white/60 shadow-xs flex items-center justify-center">
                <span className="text-[8px] text-white">✨</span>
              </div>
            </div>

            {/* Glowing Magic Wand */}
            <motion.div
              animate={
                stage === 2
                  ? { rotate: [-10, 25, -10], y: [0, 4, 0] }
                  : stage === 3
                  ? { rotate: [30, -15, 30], scale: [1, 1.25, 1] }
                  : { rotate: [0, 10, 0] }
              }
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute -right-7 top-4 text-xl drop-shadow-md cursor-default"
            >
              🪄
            </motion.div>
          </div>

          {/* Fairy Speech Bubble */}
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8A0BF] text-xs font-bold text-[#4A1525] shadow-sm flex items-center gap-1.5"
              >
                <span>Wait a second... What is this?! 🧐</span>
              </motion.div>
            )}

            {stage === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8A0BF] text-xs font-bold text-[#4A1525] shadow-sm flex items-center gap-1.5"
              >
                <span>Nope nope! We don&apos;t do negative vibes here! ✋✨</span>
              </motion.div>
            )}

            {stage === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#FFE5EC] border border-[#E8A0BF] text-xs font-extrabold text-[#4A1525] shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8A0BF] animate-spin" />
                <span>Bibbidi-Bobbidi-Boo! Card Replaced! 🪄💖</span>
              </motion.div>
            )}

            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#FFE5EC] border border-[#E8A0BF] text-xs font-bold text-[#4A1525] shadow-sm flex items-center gap-1.5"
              >
                <span>*MWAH!* Sealed with a sweet kiss! 😘💋</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Kiss Heart Animation in Stage 4 */}
        <AnimatePresence>
          {stage === 4 && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0, y: 0 }}
              animate={{ scale: [0.5, 1.8, 2.5], opacity: [0, 1, 0], y: [-10, -60, -90] }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute z-40 text-4xl pointer-events-none drop-shadow-lg"
            >
              💖
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Card Being Replaced */}
        <div className="relative w-full max-w-sm min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage < 3 ? (
              /* The Bad Option Card being picked up */
              <motion.div
                key="bad-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  stage === 2
                    ? { y: -12, rotate: -4, scale: 0.98 }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 0.4, rotate: 15 }}
                transition={{ duration: 0.3 }}
                className="w-full p-4 rounded-2xl bg-[#FFFBF5] border-2 border-dashed border-[#E8A0BF]/60 text-left shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-[#4A1525]/50 line-through">Option D</div>
                  <div className="text-base font-bold text-[#4A1525]/70 flex items-center gap-2">
                    <span>You&apos;re not... 🙅‍♂️💔</span>
                  </div>
                  <div className="text-[11px] text-[#4A1525]/50 mt-0.5">
                    (Fairy currently removing this invalid entry...)
                  </div>
                </div>
                <div className="text-2xl opacity-60">👀</div>
              </motion.div>
            ) : (
              /* The Gorgeous Upgraded Replacement Card */
              <motion.div
                key="good-card"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full p-4 rounded-2xl bg-linear-to-r from-[#FFF0F3] to-[#FFE5EC] border-2 border-[#E8A0BF] text-left shadow-xl shadow-[#E8A0BF]/30 relative overflow-hidden"
              >
                {/* Golden Sparkle Tag */}
                <div className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full text-[10px] font-extrabold text-[#E8A0BF] border border-[#E8A0BF]/40 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#E8A0BF]" />
                  Fairy Upgraded
                </div>

                <div className="text-2xl mb-1">🌸</div>
                <div className="text-sm sm:text-base font-extrabold text-[#4A1525]">
                  Irreplaceable &amp; My Whole World! 🌍💖✨
                </div>
                <div className="text-xs text-[#4A1525]/85 mt-1 font-medium italic">
                  I replaced this like I’ll replace all your emptiness with a smile 🥹✨
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The Heartfelt Statement from Prompt */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 max-w-md px-4 py-3 rounded-2xl bg-white/80 border border-[#E8A0BF]/40 shadow-sm"
            >
              <div className="text-xs sm:text-sm font-bold text-[#4A1525] leading-relaxed">
                &ldquo;I replaced this card, just like I&apos;ll replace all your emptiness with a smile...&rdquo; 🥹✨
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
