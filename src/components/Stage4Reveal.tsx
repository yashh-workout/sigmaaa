import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, RotateCcw, Heart, Check, Award, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Stage4Props {
  onRestart: () => void;
}

export const Stage4Reveal: React.FC<Stage4Props> = ({ onRestart }) => {
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Memoize custom heart shapes and palettes to ensure consistent performance
  const { heartShapes, palettes } = useMemo(() => {
    // Curated Romantic Color Palettes
    const palettes = {
      // Warm Rose & Ruby
      roseRuby: ['#E63946', '#FF4D6D', '#FF758F', '#C9184A', '#800F2F', '#E8A0BF'],
      // Soft Blush & Rose Gold
      blushGold: ['#F7D060', '#FFE6A7', '#FFCAD4', '#E8A0BF', '#FDEEDC', '#FFF0F3'],
      // Pastel Dream
      pastelDream: ['#FFB3C6', '#FF8FA3', '#FF758F', '#F7D060', '#FFE5EC', '#DDA0DD'],
      // Deep Mauve & Burgundy
      mauveBurgundy: ['#4A1525', '#85193C', '#B5838D', '#E8A0BF', '#6B2D44'],
      // Champagne & Starlight
      champagne: ['#FFFBF5', '#F7D060', '#FFCAD4', '#E8A0BF', '#FFFFFF'],
    };

    try {
      // Shape 1: Classic slender romantic SVG heart
      const classicHeart = confetti.shapeFromPath({
        path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      });

      // Shape 2: Chubby wide romantic SVG heart
      const chubbyHeart = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 84,-56 42,0 80,33 80,77 0,84 -76,147 -164,219 -88,-72 -164,-135 -164,-219 0,-44 38,-77 80,-77 47,0 65,18 84,56z',
      });

      // Shape 3: Sparkling Pink Heart Emoji
      const emojiSparkleHeart = confetti.shapeFromText({ text: '💖', scalar: 1.6 });

      // Shape 4: Growing Hearts Emoji
      const emojiTwoHearts = confetti.shapeFromText({ text: '💕', scalar: 1.5 });

      // Shape 5: Classic Red Heart Emoji
      const emojiRedHeart = confetti.shapeFromText({ text: '❤️', scalar: 1.6 });

      // Shape 6: Pure White Heart Emoji
      const emojiWhiteHeart = confetti.shapeFromText({ text: '🤍', scalar: 1.4 });

      // Shape 7: Starlight Sparkle Emoji
      const emojiSparkle = confetti.shapeFromText({ text: '✨', scalar: 1.3 });

      return {
        heartShapes: {
          classicHeart,
          chubbyHeart,
          emojiSparkleHeart,
          emojiTwoHearts,
          emojiRedHeart,
          emojiWhiteHeart,
          emojiSparkle,
        },
        palettes,
      };
    } catch {
      // Graceful fallback for shape creation
      return {
        heartShapes: null,
        palettes,
      };
    }
  }, []);

  // Grand multi-burst heart confetti choreographic sequence
  const triggerGrandHeartFinale = useCallback(() => {
    sound.playFanfare();

    const fallbackShapes: confetti.Shape[] = ['star', 'circle'];
    const fallbackCircle: confetti.Shape[] = ['circle'];
    const fallbackStar: confetti.Shape[] = ['star'];

    const shapesList: confetti.Shape[] = heartShapes
      ? [
          heartShapes.classicHeart,
          heartShapes.chubbyHeart,
          heartShapes.emojiSparkleHeart,
          heartShapes.emojiTwoHearts,
        ]
      : fallbackShapes;

    // Burst 1: Center explosive fountain of SVG hearts in rich ruby & rose
    confetti({
      particleCount: 65,
      spread: 80,
      startVelocity: 55,
      origin: { x: 0.5, y: 0.75 },
      shapes: shapesList,
      scalar: 1.5,
      colors: palettes.roseRuby,
      ticks: 240,
    });

    // Burst 2: Left cannon launch firing diagonally with sparkling pink emoji hearts & blush gold
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 58,
        spread: 60,
        startVelocity: 60,
        origin: { x: 0.05, y: 0.7 },
        shapes: heartShapes
          ? [heartShapes.emojiSparkleHeart, heartShapes.emojiTwoHearts, heartShapes.classicHeart]
          : fallbackShapes,
        scalar: 1.6,
        colors: palettes.blushGold,
        ticks: 260,
      });
    }, 280);

    // Burst 3: Right cannon launch firing diagonally with classic red hearts & deep mauve
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 122,
        spread: 60,
        startVelocity: 60,
        origin: { x: 0.95, y: 0.7 },
        shapes: heartShapes
          ? [heartShapes.emojiRedHeart, heartShapes.emojiWhiteHeart, heartShapes.chubbyHeart]
          : fallbackShapes,
        scalar: 1.6,
        colors: palettes.roseRuby,
        ticks: 260,
      });
    }, 500);

    // Burst 4: Dual crossing arcs from both flanks with gentle fluttering drift
    const timer3 = setTimeout(() => {
      // Left arc
      confetti({
        particleCount: 35,
        angle: 75,
        spread: 45,
        startVelocity: 48,
        origin: { x: 0.2, y: 0.8 },
        shapes: heartShapes ? [heartShapes.chubbyHeart, heartShapes.classicHeart] : fallbackCircle,
        scalar: 1.4,
        colors: palettes.pastelDream,
        drift: 0.25,
        gravity: 0.65,
        ticks: 300,
      });

      // Right arc
      confetti({
        particleCount: 35,
        angle: 105,
        spread: 45,
        startVelocity: 48,
        origin: { x: 0.8, y: 0.8 },
        shapes: heartShapes ? [heartShapes.chubbyHeart, heartShapes.classicHeart] : fallbackCircle,
        scalar: 1.4,
        colors: palettes.pastelDream,
        drift: -0.25,
        gravity: 0.65,
        ticks: 300,
      });
    }, 780);

    // Burst 5: Gentle Sky Cascade: hearts slowly drifting down from the top like rose petals
    const timer4 = setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 120,
        startVelocity: 25,
        origin: { x: 0.5, y: 0.15 },
        shapes: heartShapes
          ? [
              heartShapes.emojiSparkleHeart,
              heartShapes.classicHeart,
              heartShapes.emojiSparkle,
              heartShapes.emojiWhiteHeart,
            ]
          : fallbackCircle,
        scalar: 1.7,
        colors: palettes.blushGold,
        gravity: 0.55,
        ticks: 320,
      });
    }, 1150);

    // Burst 6: Final sparkling shimmer climax
    const timer5 = setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        startVelocity: 40,
        origin: { x: 0.5, y: 0.45 },
        shapes: heartShapes
          ? [heartShapes.emojiSparkle, heartShapes.emojiSparkleHeart]
          : fallbackStar,
        scalar: 1.5,
        colors: palettes.champagne,
        ticks: 200,
      });
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [heartShapes, palettes]);

  // Trigger grand finale on mount
  useEffect(() => {
    const cleanup = triggerGrandHeartFinale();
    return () => {
      if (cleanup) cleanup();
    };
  }, [triggerGrandHeartFinale]);

  // Claim Your Reward Handler with dedicated multi-burst heart wave
  const handleClaimReward = () => {
    sound.playSparkle();
    setRewardClaimed(true);

    const shapesList: confetti.Shape[] = heartShapes
      ? [
          heartShapes.emojiSparkleHeart,
          heartShapes.emojiTwoHearts,
          heartShapes.classicHeart,
          heartShapes.chubbyHeart,
          heartShapes.emojiRedHeart,
        ]
      : ['star', 'circle'];

    // Rapid celebratory heart pulses
    let iteration = 0;
    const interval = setInterval(() => {
      iteration++;
      const originX = 0.3 + (iteration % 3) * 0.2; // 0.3, 0.5, 0.7
      confetti({
        particleCount: 30,
        startVelocity: 35,
        spread: 140,
        ticks: 120,
        origin: { x: originX, y: 0.5 },
        shapes: shapesList,
        scalar: 1.5,
        colors: iteration % 2 === 0 ? palettes.roseRuby : palettes.blushGold,
      });

      if (iteration >= 5) {
        clearInterval(interval);
      }
    }, 180);
  };

  const handleShare = () => {
    sound.playPop();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-14 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#FFFDFB] border-2 border-[#E8A0BF]/50 rounded-3xl p-5 sm:p-10 md:p-14 shadow-2xl shadow-[#E8A0BF]/25 relative overflow-hidden backdrop-blur-xs"
      >
        {/* Soft radial glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FFE5EC] rounded-full blur-3xl pointer-events-none opacity-80" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F7D060]/20 rounded-full blur-3xl pointer-events-none opacity-80" />

        {/* Floating Heart Icon Badge */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-[#E8A0BF] to-[#F7D060] p-1 shadow-lg shadow-[#E8A0BF]/30 mb-6 flex items-center justify-center text-white"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <Heart className="w-10 h-10 fill-[#E8A0BF] text-[#E8A0BF]" />
          </div>
        </motion.div>

        {/* Required Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#4A1525] tracking-tight text-balance leading-tight mb-4">
          WE are meant for each other ig shawty. 💖✨
        </h1>

        {/* Sweet Subtext */}
        <p className="text-base sm:text-lg text-[#4A1525]/85 max-w-xl mx-auto leading-relaxed mb-8">
          Out of all the timelines, late-night talks, shared playlists, and ridiculous inside jokes—every single road led right here.
          Here&apos;s to us, our endless adventures, and writing every single next chapter side by side.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
          {/* Claim Your Reward Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleClaimReward}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-[#E8A0BF] via-[#d685a7] to-[#B5838D] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#E8A0BF]/35 hover:shadow-2xl hover:shadow-[#E8A0BF]/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            <span>Claim Your Reward 🎁</span>
          </motion.button>

          {/* Re-trigger Heart Fireworks */}
          <button
            type="button"
            onClick={triggerGrandHeartFinale}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#FFFBF5] border border-[#E8A0BF]/50 text-[#4A1525] font-semibold text-sm hover:border-[#E8A0BF] hover:bg-[#FFE5EC]/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#E8A0BF]" />
            <span>Heart Fireworks 🎆</span>
          </button>

          {/* Share The Moment */}
          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#FFFBF5] border border-[#E8A0BF]/30 text-[#4A1525]/80 font-semibold text-sm hover:border-[#E8A0BF] hover:bg-[#FFE5EC]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-[#E8A0BF]" />
                <span>Link Copied!</span>
              </>
            ) : (
              <span>Share Link 💌</span>
            )}
          </button>
        </div>

        {/* Reward Modal / Certificate Card */}
        <AnimatePresence>
          {rewardClaimed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-6 sm:p-8 rounded-3xl bg-linear-to-b from-[#FFFDFB] to-[#FFE5EC]/40 border-2 border-[#E8A0BF] text-center shadow-lg relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFFBF5] border border-[#E8A0BF] mx-auto flex items-center justify-center text-[#E8A0BF] mb-3 shadow-xs">
                <Award className="w-6 h-6" />
              </div>

              <div className="text-xs font-bold tracking-widest uppercase text-[#E8A0BF] mb-1">
                Official Love Covenant
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#4A1525] mb-2">
                Certificate of Mutual Devotion
              </h2>

              <p className="text-xs sm:text-sm text-[#4A1525]/80 max-w-md mx-auto mb-5 italic">
                &ldquo;By virtue of the 99.99% compatibility score and supreme arcade triumph, the bearer is hereby entitled to lifelong adoration, priority snacking rights, and infinite cuddles.&rdquo;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs">
                <div className="p-3 bg-[#FFFBF5] rounded-xl border border-[#E8A0BF]/30">
                  <span className="font-bold text-[#4A1525] block">Clause 1:</span>
                  <span className="text-[#4A1525]/75">First choice of any shared dessert.</span>
                </div>
                <div className="p-3 bg-[#FFFBF5] rounded-xl border border-[#E8A0BF]/30">
                  <span className="font-bold text-[#4A1525] block">Clause 2:</span>
                  <span className="text-[#4A1525]/75">Immunity from getting up when warm in bed.</span>
                </div>
                <div className="p-3 bg-[#FFFBF5] rounded-xl border border-[#E8A0BF]/30">
                  <span className="font-bold text-[#4A1525] block">Clause 3:</span>
                  <span className="text-[#4A1525]/75">Unconditional hugs on bad days.</span>
                </div>
              </div>

              <div className="mt-6 text-[11px] font-semibold text-[#E8A0BF]">
                Signed &amp; Sealed in the Heart Forever ✍️💖
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Restart Journey Button */}
        <div className="mt-10 pt-6 border-t border-[#E8A0BF]/20 flex justify-center">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onRestart();
            }}
            className="text-xs font-semibold text-[#4A1525]/70 hover:text-[#4A1525] transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-[#FFE5EC]/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Experience Again from Start</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
