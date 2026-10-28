import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageHeaderProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  maxUnlockedStage: number;
}

export const StageHeader: React.FC<StageHeaderProps> = ({
  currentStage,
  onSelectStage,
  soundEnabled,
  onToggleSound,
  maxUnlockedStage,
}) => {
  const steps = [
    { id: 1, label: '01. Compatibility' },
    { id: 2, label: '02. Catching Hearts' },
    { id: 3, label: '03. The Question' },
    { id: 4, label: '04. The Reveal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF5]/85 backdrop-blur-md border-b border-[#E8A0BF]/20 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark + Mobile Phase Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Sparkles className="w-5 h-5 text-[#E8A0BF]" />
          <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#4A1525] whitespace-nowrap">
            A Little Romance
          </span>
          <span className="md:hidden text-[10px] font-extrabold text-[#E8A0BF] bg-[#FFE5EC] border border-[#E8A0BF]/30 px-2 py-0.5 rounded-full tabular-nums">
            {currentStage}/4
          </span>
        </div>

        {/* Zone 2: Navigation Steps */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-[#4A1525]/60">
          {steps.map((step, idx) => {
            const isCurrent = currentStage === step.id;
            const isUnlocked = step.id <= maxUnlockedStage;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && <span className="text-[#E8A0BF]/50" aria-hidden="true">·</span>}
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playPop();
                      onSelectStage(step.id);
                    }
                  }}
                  className={`transition-colors whitespace-nowrap py-1 px-2 rounded-md ${
                    isCurrent
                      ? 'text-[#4A1525] font-bold bg-[#E8A0BF]/15'
                      : isUnlocked
                      ? 'hover:text-[#4A1525] cursor-pointer'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {step.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Sound / Audio FX Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A1525] bg-[#FFFBF5] border border-[#E8A0BF]/40 rounded-full hover:bg-[#FFE5EC]/40 hover:border-[#E8A0BF] transition-all shadow-xs"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E8A0BF]" />
                <span className="hidden sm:inline">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#4A1525]/40" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
