import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, CheckCircle2, ArrowRight, Wand2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { FairyCutscene } from './FairyCutscene';
import { JapaneseScrollModal } from './JapaneseScrollModal';

interface Stage1Props {
  onComplete: () => void;
}

interface Question {
  id: number;
  question: string;
  tagline: string;
  options: {
    id: string;
    text: string;
    flavor: string;
    icon: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How good am I for you? 🥺👉👈",
    tagline: "Be completely honest—though only one category of answers is spiritually acceptable.",
    options: [
      {
        id: 'a',
        text: 'The Absolute Best! 🏆✨🥰',
        flavor: 'Unrivaled, undefeated in the entire galaxy',
        icon: '🌟',
      },
      {
        id: 'b',
        text: '100% Guaranteed Soulmate! 💯💍💖',
        flavor: 'Scientifically, spiritually & emotionally certified',
        icon: '💯',
      },
      {
        id: 'c',
        text: 'Undoubtedly My Person! 🥹🔒💕',
        flavor: 'No debate, case closed, forever and always',
        icon: '👑',
      },
      {
        id: 'd',
        text: "You're not... 🙅‍♂️💔",
        flavor: "Nice try, don't even think about it 👀",
        icon: '👀',
      },
    ],
  },
  {
    id: 2,
    question: "What's the chances it'll work out? 🔮📈✨",
    tagline: 'Calculated across all dimensions and alternate timelines.',
    options: [
      {
        id: 'a',
        text: 'Digits of Pi (Infinite & Never-Ending)! 🥧♾️✨',
        flavor: 'Infinite decimals, literally zero chance of stopping',
        icon: '🥧',
      },
      {
        id: 'b',
        text: '100% Guaranteed Success! 💯🔒💖',
        flavor: 'Mathematically proven with no return policy',
        icon: '💯',
      },
      {
        id: 'c',
        text: 'All Numbers on the Number Line! 🔢📈✨',
        flavor: 'Infinitely vast and ever expanding',
        icon: '📈',
      },
      {
        id: 'd',
        text: "It won't... 🙄💔",
        flavor: 'Warning: strictly hazardous to click ⚠️',
        icon: '💣',
      },
    ],
  },
  {
    id: 3,
    question: 'What I like in you the most 🥺💖✨',
    tagline: 'Go ahead, pick whichever one you think wins.',
    options: [
      {
        id: 'a',
        text: 'Your Eyes 👁️✨',
        flavor: 'Deeper than the ocean, honestly unfair',
        icon: '👁️',
      },
      {
        id: 'b',
        text: 'Your Smile 😊🌸',
        flavor: 'Literally lights up my entire universe',
        icon: '😊',
      },
      {
        id: 'c',
        text: 'Your Face 🥰✨',
        flavor: 'Certified 100/10 masterwork',
        icon: '🥰',
      },
      {
        id: 'd',
        text: 'Your Lips 💋💖',
        flavor: 'Dangerous to look at, impossible to ignore',
        icon: '💋',
      },
    ],
  },
];

interface GlassShard {
  id: number;
  x: number;
  y: number;
  r: number;
  scale: number;
  vx: number;
  vy: number;
}

export const Stage1Compatibility: React.FC<Stage1Props> = ({ onComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Question 1: Fairy Cutscene & Trick State
  const [q1TrickState, setQ1TrickState] = useState<'normal' | 'dodging' | 'transformed'>('normal');
  const [q1HoveredOptionD, setQ1HoveredOptionD] = useState<boolean>(false);
  const [showFairyCutscene, setShowFairyCutscene] = useState(false);
  const [trickMessage, setTrickMessage] = useState<string | null>(null);

  // Question 2: Glass Shatter & Angry Emoji State
  const [q2Attempts, setQ2Attempts] = useState<number>(0);
  const [q2ShowAngryEmoji, setQ2ShowAngryEmoji] = useState<boolean>(false);
  const [q2IsShattered, setQ2IsShattered] = useState<boolean>(false);
  const [q2ShatterParticles, setQ2ShatterParticles] = useState<GlassShard[]>([]);
  const [q2ShowDefiantBanner, setQ2ShowDefiantBanner] = useState<boolean>(false);

  // Question 3: Japanese Scroll Reel & Tease Modal
  const [showJapaneseScrollModal, setShowJapaneseScrollModal] = useState<boolean>(false);
  const [selectedQ3OptionText, setSelectedQ3OptionText] = useState<string>('your smile');

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === QUESTIONS.length;

  const handleSelectOption = (qId: number, optId: string) => {
    sound.playPop();

    if (qId === 3) {
      // Question 3: Trigger the teasing popup and unrolling Japanese scroll cutscene!
      const opt = QUESTIONS[2].options.find((o) => o.id === optId);
      const cleanLabel = opt ? opt.text.replace(/[^\w\s]/gi, '').trim() : 'that';
      setSelectedQ3OptionText(cleanLabel || 'that');
      setSelectedAnswers((prev) => ({ ...prev, 3: optId }));
      setShowJapaneseScrollModal(true);
      return;
    }

    const updated = { ...selectedAnswers, [qId]: optId };
    setSelectedAnswers(updated);

    if (activeQuestionIdx < QUESTIONS.length - 1) {
      setTimeout(() => {
        setActiveQuestionIdx((prev) => prev + 1);
      }, 350);
    }
  };

  const handleScrollModalComplete = () => {
    setShowJapaneseScrollModal(false);
    setIsCalculating(true);
    setTimeout(() => {
      setQuizFinished(true);
      setIsCalculating(false);
      sound.playMatch();
    }, 900);
  };

  // Question 1 Option D interaction
  const handleTrickOptionAttempt = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (q1TrickState === 'transformed') {
      sound.playSparkle();
      handleSelectOption(1, 'd');
      return;
    }

    // Launch the fairy cutscene!
    setShowFairyCutscene(true);
  };

  const handleFairyCutsceneComplete = () => {
    setShowFairyCutscene(false);
    setQ1TrickState('transformed');
    setTrickMessage("I replaced this card, just like I’ll replace all your emptiness with a smile 🥹✨");
    sound.playSparkle();
  };

  // Question 2 Option D ("It won't...") interaction
  const handleQ2OptionDClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (q2IsShattered) return;

    if (q2Attempts === 0) {
      // First attempt: Pop big angry emoji + cute warning!
      sound.playGrumpy();
      setQ2Attempts(1);
      setQ2ShowAngryEmoji(true);
      setTimeout(() => {
        setQ2ShowAngryEmoji(false);
      }, 2200);
    } else {
      // Second attempt: Break like glass and disappear!
      sound.playGlassShatter();
      setQ2Attempts(2);
      setQ2IsShattered(true);

      // Create glass shard particles flying outward
      const rect = e.currentTarget.getBoundingClientRect();
      const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
      const originX = parentRect ? rect.left - parentRect.left + rect.width / 2 : 160;
      const originY = parentRect ? rect.top - parentRect.top + rect.height / 2 : 120;

      const shards: GlassShard[] = Array.from({ length: 18 }, (_, i) => ({
        id: Date.now() + i,
        x: originX,
        y: originY,
        r: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.4,
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.5) * 260 - 50,
      }));
      setQ2ShatterParticles(shards);

      // Brief angry puff then reveal the big cute defiant banner
      setQ2ShowAngryEmoji(true);
      setTimeout(() => {
        setQ2ShowAngryEmoji(false);
        setQ2ShowDefiantBanner(true);
        sound.playMatch();
      }, 1000);
    }
  };

  // Animated counter for compatibility meter
  useEffect(() => {
    if (!quizFinished) return;
    let start = 0;
    const target = 99.99;
    const stepTime = 18;
    const steps = 50;
    const increment = target / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCalculatedScore(99.99);
        clearInterval(interval);
      } else {
        setCalculatedScore(parseFloat(start.toFixed(2)));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [quizFinished]);

  return (
    <div className="w-full max-w-3xl mx-auto py-6 sm:py-10 px-4 relative">
      {/* Fairy Magical Replacement Cutscene (Question 1) */}
      <AnimatePresence>
        {showFairyCutscene && (
          <FairyCutscene onComplete={handleFairyCutsceneComplete} />
        )}
      </AnimatePresence>

      {/* Japanese Scroll Adoration Modal (Question 3) */}
      <AnimatePresence>
        {showJapaneseScrollModal && (
          <JapaneseScrollModal
            onComplete={handleScrollModalComplete}
            selectedOptionLabel={selectedQ3OptionText}
          />
        )}
      </AnimatePresence>

      {/* Big Animated Angry Emoji Popup (Question 2) */}
      <AnimatePresence>
        {q2ShowAngryEmoji && activeQuestionIdx === 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.35, 1],
              opacity: [0, 1, 1],
              rotate: [0, -10, 10, -5, 5, 0],
            }}
            exit={{ scale: 0.6, opacity: 0, y: -50 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center p-4 bg-black/15 backdrop-blur-[2px]"
          >
            <div className="text-8xl sm:text-9xl filter drop-shadow-2xl animate-bounce">
              {q2Attempts === 1 ? '😡💢' : '💥😤💨'}
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-4 px-6 py-3 rounded-full bg-white/95 border-2 border-red-300 text-sm sm:text-base font-extrabold text-[#4A1525] shadow-2xl text-center max-w-sm"
            >
              {q2Attempts === 1
                ? "HAYYY! 😤 Don't you dare click that! Final warning, buster! 🛑✋"
                : "NOPE! Invalid choice shattered into pieces! 💥"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="text-xs font-semibold tracking-wider uppercase text-[#E8A0BF] mb-2 inline-block">
          Phase 01 · The Icebreaker
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A1525] tracking-tight text-balance mb-3">
          Our Compatibility Meter
        </h1>
        <p className="text-sm sm:text-base text-[#4A1525]/75 max-w-lg mx-auto">
          Before we proceed to any major life decisions, let&apos;s consult the scientifically rigorous, 100% objective algorithm.
        </p>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                sound.playPop();
                setActiveQuestionIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeQuestionIdx === idx
                  ? 'w-8 bg-[#E8A0BF]'
                  : selectedAnswers[q.id]
                  ? 'w-3 bg-[#4A1525]/40'
                  : 'w-2 bg-[#E8A0BF]/30'
              }`}
              aria-label={`Go to question ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Card */}
      <div className="bg-[#FFFDFB] border border-[#E8A0BF]/30 rounded-3xl p-4 sm:p-8 shadow-xl shadow-[#E8A0BF]/10 relative overflow-hidden backdrop-blur-xs">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FFE5EC] rounded-full blur-2xl pointer-events-none opacity-60" />

        {!quizFinished ? (
          <div>
            {/* Question Container with Animation */}
            <AnimatePresence mode="wait">
              {QUESTIONS.map(
                (q, idx) =>
                  activeQuestionIdx === idx && (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="border-b border-[#E8A0BF]/20 pb-4">
                        <div className="flex items-center justify-between text-xs text-[#4A1525]/60 mb-1">
                          <span>Question {idx + 1} of 3</span>
                          <span>{selectedAnswers[q.id] ? 'Answered' : 'Pending Choice'}</span>
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1525]">
                          {q.question}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#4A1525]/70 mt-1">
                          {q.tagline}
                        </p>
                      </div>

                      {/* Question 1: Fairy Transformation Success Banner */}
                      <AnimatePresence>
                        {activeQuestionIdx === 0 &&
                          q1TrickState === 'transformed' &&
                          trickMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.96 }}
                              transition={{ duration: 0.2 }}
                              className="p-3 rounded-2xl text-center text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 border bg-[#FFE5EC] text-[#4A1525] border-[#E8A0BF]"
                            >
                              <Sparkles className="w-4 h-4 text-[#E8A0BF] shrink-0 animate-bounce" />
                              <span className="leading-snug">{trickMessage}</span>
                            </motion.div>
                          )}
                      </AnimatePresence>

                      {/* Question 2: Big Defiant Romantic Love Banner */}
                      <AnimatePresence>
                        {q2ShowDefiantBanner && activeQuestionIdx === 1 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                            className="p-5 rounded-3xl bg-linear-to-r from-[#FFE5EC] via-[#FFF0F3] to-[#FDEEDC] border-2 border-[#E8A0BF] text-center shadow-md relative overflow-hidden"
                          >
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E8A0BF] mb-1 flex items-center justify-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#E8A0BF]" />
                              Permanent Universal Law
                            </div>
                            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#4A1525] leading-snug">
                              &ldquo;No matter how much u try, I’ll make it last! 😤💖🔒✨&rdquo;
                            </h3>
                            <p className="text-xs text-[#4A1525]/75 mt-1 font-semibold">
                              (Now go ahead and pick one of the 3 true answers below, silly 🥰)
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Options Grid with Layout Physics */}
                      <div className="relative">
                        {/* Flying glass shards animation on shatter */}
                        {q2ShatterParticles.map((shard) => (
                          <motion.div
                            key={shard.id}
                            initial={{
                              x: shard.x,
                              y: shard.y,
                              opacity: 1,
                              scale: shard.scale,
                              rotate: shard.r,
                            }}
                            animate={{
                              x: shard.x + shard.vx,
                              y: shard.y + shard.vy + 80,
                              opacity: 0,
                              rotate: shard.r + 360,
                              scale: 0.1,
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="absolute pointer-events-none z-40 w-4 h-6 bg-linear-to-tr from-white/95 via-[#FFE5EC] to-[#E8A0BF]/70 border border-white rounded-xs shadow-md"
                            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 70%)' }}
                          />
                        ))}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                          {q.options.map((opt) => {
                            const isQ1OptionD = q.id === 1 && opt.id === 'd';
                            const isQ2OptionD = q.id === 2 && opt.id === 'd';
                            const isSelected = selectedAnswers[q.id] === opt.id;

                            // If Question 2 Option D shattered, remove it completely so the remaining 3 settle!
                            if (isQ2OptionD && q2IsShattered) {
                              return null;
                            }

                            // Dynamic content for Question 1 Option D
                            let optIcon = opt.icon;
                            let optText = opt.text;
                            let optFlavor = opt.flavor;

                            if (isQ1OptionD) {
                              if (q1TrickState === 'transformed') {
                                optIcon = '🌸';
                                optText = 'Irreplaceable & My Whole World! 🌍💖✨';
                                optFlavor = 'I replaced this like I’ll replace your emptiness with a smile 🥹✨';
                              } else if (q1TrickState === 'dodging') {
                                optIcon = '🪄';
                                optText = 'Transforming option... ✨';
                                optFlavor = 'Replacing this with something unforgettable...';
                              }
                            }

                            // Question 2 Option D Warning State
                            if (isQ2OptionD && q2Attempts === 1) {
                              optFlavor = "DANGER! Click again and I will shatter! ⚠️";
                            }

                            // Layout styling: When Q2 has 3 items left, span the 3rd item nicely
                            const isThirdItemInShatteredQ2 =
                              q.id === 2 && q2IsShattered && opt.id === 'c';

                            return (
                              <motion.button
                                key={opt.id}
                                layout={isThirdItemInShatteredQ2 ? 'position' : false}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.98 }}
                                animate={
                                  isQ1OptionD && q1TrickState === 'dodging'
                                    ? {
                                        x: [0, -10, 10, -8, 8, -4, 4, 0],
                                        rotate: [0, -2, 2, -1, 1, 0],
                                      }
                                    : isQ1OptionD && q1TrickState === 'transformed'
                                    ? {
                                        scale: [1, 1.03, 1],
                                      }
                                    : isQ2OptionD && q2Attempts === 1
                                    ? {
                                        x: [-4, 4, -4, 4, 0],
                                      }
                                    : {}
                                }
                                transition={{
                                  layout: { duration: 0.45, ease: 'easeOut' },
                                  duration: 0.25,
                                }}
                                type="button"
                                onMouseEnter={() => {
                                  if (isQ1OptionD && q1TrickState === 'normal') {
                                    sound.playPop();
                                    setQ1HoveredOptionD(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (isQ1OptionD) {
                                    setQ1HoveredOptionD(false);
                                  }
                                }}
                                onClick={(e) => {
                                  if (isQ1OptionD) {
                                    if (q1TrickState !== 'transformed') {
                                      handleTrickOptionAttempt(e);
                                    } else {
                                      sound.playSparkle();
                                      handleSelectOption(q.id, opt.id);
                                    }
                                  } else if (isQ2OptionD) {
                                    handleQ2OptionDClick(e);
                                  } else {
                                    handleSelectOption(q.id, opt.id);
                                  }
                                }}
                                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between min-h-[102px] relative overflow-hidden select-none cursor-pointer ${
                                  isThirdItemInShatteredQ2 ? 'sm:col-span-2' : ''
                                } ${
                                  isSelected
                                    ? 'bg-[#FFE5EC] border-[#E8A0BF] shadow-md shadow-[#E8A0BF]/20 ring-1 ring-[#E8A0BF]'
                                    : isQ1OptionD && q1TrickState === 'transformed'
                                    ? 'bg-linear-to-r from-[#FFF0F3] to-[#FFE5EC] border-[#E8A0BF] ring-2 ring-[#E8A0BF]/40 shadow-sm'
                                    : isQ2OptionD && q2Attempts === 1
                                    ? 'bg-red-50/80 border-red-300 text-red-950 ring-2 ring-red-200 shadow-sm'
                                    : 'bg-[#FFFBF5] border-[#E8A0BF]/25 hover:border-[#E8A0BF]/70 hover:bg-[#FFF8F0]'
                                }`}
                              >
                                {/* Playful hover overlay inside Option D (No layout shifts, zero vibration) */}
                                <AnimatePresence>
                                  {isQ1OptionD && q1TrickState === 'normal' && q1HoveredOptionD && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.96 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.96 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute inset-0 z-30 pointer-events-none bg-[#4A1525]/95 text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner"
                                    >
                                      <span className="text-xl mb-0.5">👀✋</span>
                                      <span className="text-xs font-extrabold leading-snug">
                                        Wait... you&apos;re not actually thinking about clicking this, are you?!
                                      </span>
                                      <span className="text-[10px] text-[#FFCAD4] mt-0.5 font-medium">
                                        (Click at your own risk...)
                                      </span>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Glowing sparkle badge on transformed option */}
                                {isQ1OptionD && q1TrickState === 'transformed' && (
                                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-[#E8A0BF] bg-white/80 px-2 py-0.5 rounded-full shadow-2xs">
                                    <Sparkles className="w-3 h-3" />
                                    Upgraded
                                  </div>
                                )}

                                {/* Warning badge on Q2 Attempt 1 */}
                                {isQ2OptionD && q2Attempts === 1 && (
                                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                    ⚠️ Final Warning
                                  </div>
                                )}

                                <div className="flex items-start justify-between gap-3">
                                  <span className="text-2xl" role="img" aria-hidden="true">
                                    {optIcon}
                                  </span>
                                  {isSelected ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#4A1525] shrink-0" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-[#E8A0BF]/50 shrink-0" />
                                  )}
                                </div>
                                <div className="mt-2">
                                  <div className="text-sm font-bold text-[#4A1525] leading-snug">
                                    {optText}
                                  </div>
                                  <div className="text-[11px] text-[#4A1525]/70 mt-1 leading-normal">
                                    {optFlavor}
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Quick Navigation Footer */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E8A0BF]/20">
              <button
                type="button"
                disabled={activeQuestionIdx === 0}
                onClick={() => {
                  sound.playPop();
                  setActiveQuestionIdx((prev) => Math.max(0, prev - 1));
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeQuestionIdx === 0
                    ? 'opacity-30 cursor-not-allowed text-[#4A1525]'
                    : 'text-[#4A1525] hover:bg-[#FFE5EC]/50'
                }`}
              >
                ← Previous
              </button>

              <div className="text-xs text-[#4A1525]/60 font-medium">
                {answeredCount} of 3 Selected
              </div>

              {activeQuestionIdx < QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setActiveQuestionIdx((prev) => prev + 1);
                  }}
                  className="text-xs font-semibold text-[#4A1525] px-3 py-1.5 rounded-lg hover:bg-[#FFE5EC]/50 transition-colors flex items-center gap-1"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isAllAnswered || isCalculating}
                  onClick={() => {
                    setIsCalculating(true);
                    setTimeout(() => {
                      setQuizFinished(true);
                      setIsCalculating(false);
                      sound.playMatch();
                    }, 800);
                  }}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    isAllAnswered
                      ? 'bg-[#E8A0BF] text-white hover:bg-[#df91b2] shadow-sm cursor-pointer'
                      : 'opacity-40 bg-[#E8A0BF]/30 text-[#4A1525] cursor-not-allowed'
                  }`}
                >
                  {isCalculating ? 'Computing Result...' : 'Calculate Score ✨'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results Reveal */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-6 space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFE5EC] flex items-center justify-center text-[#E8A0BF] shadow-inner">
              <Heart className="w-8 h-8 fill-[#E8A0BF] text-[#E8A0BF] animate-bounce" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D060]/20 text-[#4A1525] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E8A0BF]" />
                Official Algorithm Verdict
              </div>

              {/* Score Counter */}
              <div className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#4A1525] tracking-tight text-balance tabular-nums mt-1">
                {calculatedScore.toFixed(2)}%
              </div>
              <div className="font-serif text-xl sm:text-2xl text-[#E8A0BF] font-semibold mt-1">
                Definitive Mutual Match
              </div>
              <p className="text-xs sm:text-sm text-[#4A1525]/75 max-w-md mx-auto mt-2 italic">
                (The remaining 0.01% is permanently reserved for the 45-minute standoff over what we should eat for dinner.)
              </p>
            </div>

            {/* Answer Breakdown Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#FFFBF5] rounded-2xl border border-[#E8A0BF]/30 text-left">
              <div className="p-2">
                <span className="text-[11px] font-semibold text-[#E8A0BF] block">Vibe Consensus</span>
                <span className="text-xs font-medium text-[#4A1525] line-clamp-2">
                  Unmatched cozy harmony verified.
                </span>
              </div>
              <div className="p-2 sm:border-x sm:border-[#E8A0BF]/20">
                <span className="text-[11px] font-semibold text-[#E8A0BF] block">Probability Rate</span>
                <span className="text-xs font-medium text-[#4A1525] line-clamp-2">
                  Infinite digits of Pi & guaranteed success.
                </span>
              </div>
              <div className="p-2">
                <span className="text-[11px] font-semibold text-[#E8A0BF] block">Adoration Rate</span>
                <span className="text-xs font-medium text-[#4A1525] line-clamp-2">
                  Nothing I can&apos;t like about you. Whole masterpiece.
                </span>
              </div>
            </div>

            {/* CTA Button to Stage 2 */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  sound.playPop();
                  onComplete();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#E8A0BF] to-[#d685a7] text-white font-bold text-base shadow-lg shadow-[#E8A0BF]/30 hover:shadow-xl hover:shadow-[#E8A0BF]/40 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Unlock Phase 2 💖</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
