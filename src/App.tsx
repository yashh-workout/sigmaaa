/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundHearts } from './components/BackgroundHearts';
import { StageHeader } from './components/StageHeader';
import { Stage1Compatibility } from './components/Stage1Compatibility';
import { Stage2Arcade } from './components/Stage2Arcade';
import { Stage3DecisionGate } from './components/Stage3DecisionGate';
import { Stage4Reveal } from './components/Stage4Reveal';
import { sound } from './utils/audio';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    sound.enabled = nextState;
    setSoundEnabled(nextState);
    if (nextState) {
      sound.playPop();
    }
  };

  const advanceToStage = (stage: number) => {
    setCurrentStage(stage);
    setMaxUnlockedStage((prev) => Math.max(prev, stage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentStage(1);
    setMaxUnlockedStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#4A1525] flex flex-col relative selection:bg-[#E8A0BF]/30 selection:text-[#4A1525]">
      {/* Ambient Canvas Background Floating Hearts */}
      <BackgroundHearts />

      {/* Top Bar Header */}
      <StageHeader
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        maxUnlockedStage={maxUnlockedStage}
      />

      {/* Main Interactive Stage Container */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full px-2 sm:px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {currentStage === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Stage1Compatibility onComplete={() => advanceToStage(2)} />
            </motion.div>
          )}

          {currentStage === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Stage2Arcade onComplete={() => advanceToStage(3)} />
            </motion.div>
          )}

          {currentStage === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Stage3DecisionGate onAccept={() => advanceToStage(4)} />
            </motion.div>
          )}

          {currentStage === 4 && (
            <motion.div
              key="stage-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <Stage4Reveal onRestart={handleRestart} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 border-t border-[#E8A0BF]/15 py-4 px-4 text-center text-xs text-[#4A1525]/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>A playful romantic proposal experience</span>
          <span className="text-[#E8A0BF]">Always choosing each other · Every single day</span>
        </div>
      </footer>
    </div>
  );
}
