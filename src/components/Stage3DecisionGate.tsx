import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface Stage3Props {
  onAccept: () => void;
}

const FUNNY_EXCUSES = [
  'NO WAY 🙅',
  'Nice try! 😜',
  'Error 404: Choice Not Found 💨',
  'Button unavailable rn 💅',
  'Are you sure? Try again 😉',
  'Oops, cursor slipped! 🏃💨',
  'Resistance is futile 💕',
  'System glitch: only YES works ✨',
  'Look how pretty the other button is! 👉',
  'I don’t think so, shawty! 🥰',
];

export const Stage3DecisionGate: React.FC<Stage3Props> = ({ onAccept }) => {
  const [noButtonIndex, setNoButtonIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [evadeCount, setEvadeCount] = useState(0);
  const [isEvading, setIsEvading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleEvade = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    sound.playEvade();

    setEvadeCount((prev) => prev + 1);
    setNoButtonIndex((prev) => (prev + 1) % FUNNY_EXCUSES.length);
    setIsEvading(true);

    // Compute safe dynamic bounds based on container width so it never clips on mobile
    const container = containerRef.current;
    const containerWidth = container ? container.clientWidth : 300;
    const safeRadiusX = Math.max(40, Math.min(125, containerWidth / 2 - 55));
    const safeRadiusY = 70;

    const maxOffset = Math.min(safeRadiusX, 45 + evadeCount * 8);
    const randomAngle = Math.random() * Math.PI * 2;
    const distance = 45 + Math.random() * maxOffset;

    const newX = Math.cos(randomAngle) * distance;
    const newY = Math.sin(randomAngle) * (distance * 0.65);

    setNoButtonPos({
      x: Math.max(-safeRadiusX, Math.min(safeRadiusX, newX)),
      y: Math.max(-safeRadiusY, Math.min(safeRadiusY, newY)),
    });
  };

  // The Yes button grows slightly with each dodge (up to a sweet limit)
  const yesScale = Math.min(1.22, 1 + evadeCount * 0.035);

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-14 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#FFFDFB] border-2 border-[#E8A0BF]/40 rounded-3xl p-5 sm:p-10 md:p-12 shadow-2xl shadow-[#E8A0BF]/15 relative overflow-hidden backdrop-blur-xs"
      >
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FFE5EC]/70 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EC] text-[#E8A0BF] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Moment of Truth
        </div>

        <p className="font-serif italic text-base sm:text-lg text-[#E8A0BF] mb-2">
          So... based on the highly official data above...
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#4A1525] tracking-tight text-balance leading-tight mb-4">
          Will you make this forever?
        </h1>

        <p className="text-sm sm:text-base text-[#4A1525]/75 max-w-md mx-auto mb-10">
          Through all the lazy Sundays, late-night grocery runs, shared playlists, and every high &amp; low yet to come.
        </p>

        {/* Buttons Interactive Playground */}
        <div
          ref={containerRef}
          className="relative min-h-[160px] sm:min-h-[180px] flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-lg mx-auto"
        >
          {/* YES DEFINITELY BUTTON */}
          <motion.button
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            type="button"
            onClick={() => {
              sound.playFanfare();
              onAccept();
            }}
            className="w-full sm:w-auto px-10 py-4.5 rounded-full bg-linear-to-r from-[#E8A0BF] via-[#e283a8] to-[#c75d86] text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-[#E8A0BF]/40 hover:shadow-2xl hover:shadow-[#E8A0BF]/60 transition-all flex items-center justify-center gap-3 cursor-pointer z-20 group"
          >
            <Heart className="w-6 h-6 fill-white group-hover:scale-120 transition-transform" />
            <span>YES, DEFINITELY! 💖</span>
          </motion.button>

          {/* PLAYFUL EVASIVE NO BUTTON */}
          <motion.button
            animate={{
              x: noButtonPos.x,
              y: noButtonPos.y,
              scale: isEvading ? Math.max(0.75, 1 - evadeCount * 0.03) : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 22,
            }}
            onMouseEnter={handleEvade}
            onTouchStart={handleEvade}
            onClick={handleEvade}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FFFBF5] border border-[#E8A0BF]/50 text-[#4A1525]/75 hover:text-[#4A1525] font-semibold text-xs sm:text-sm hover:border-[#E8A0BF] transition-colors shadow-xs cursor-pointer select-none whitespace-nowrap z-10"
          >
            {FUNNY_EXCUSES[noButtonIndex]}
          </motion.button>
        </div>

        {/* Playful hint text if they keep trying */}
        {evadeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-xs text-[#E8A0BF] font-medium"
          >
            {evadeCount >= 3
              ? "Notice how the NO button is literally running for its life? Take the hint! 😉"
              : "That button has evasive maneuvers programmed in. Just say YES! 💕"}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
