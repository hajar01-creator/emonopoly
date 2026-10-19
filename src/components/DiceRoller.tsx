import { useState } from 'react';
import { motion } from 'motion/react';
import { Dices, Sparkles } from 'lucide-react';
import { Player } from '../types';
import { playDiceRollSound } from '../utils/audio';

interface DiceRollerProps {
  currentPlayer: Player;
  onRoll: (diceValue: number) => void;
  isRolling: boolean;
  disabled: boolean;
}

// Visual dot arrangements for dice faces 1-6
const DICE_DOTS: { [key: number]: number[][] } = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

export function DiceRoller({
  currentPlayer,
  onRoll,
  isRolling,
  disabled,
}: DiceRollerProps) {
  const [displayValue, setDisplayValue] = useState<number>(1);
  const [localRolling, setLocalRolling] = useState(false);

  const handleRollClick = () => {
    if (disabled || isRolling || localRolling) return;

    setLocalRolling(true);
    playDiceRollSound();

    let rollCount = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6) + 1;
      setDisplayValue(rand);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDisplayValue(finalValue);
        setLocalRolling(false);
        onRoll(finalValue);
      }
    }, 80);
  };

  const dots = DICE_DOTS[displayValue] || DICE_DOTS[1];

  return (
    <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-amber-200 shadow-md text-center w-full max-w-[220px] mx-auto">
      {/* Current Turn Badge */}
      <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 w-full justify-center">
        <span className="text-lg">{currentPlayer.character.emoji}</span>
        <div className="text-left truncate">
          <p className="text-[9px] text-slate-500 font-medium">Giliran</p>
          <p className="text-xs font-bold text-slate-800 leading-tight truncate">
            {currentPlayer.name}
          </p>
        </div>
      </div>

      {/* 3D Dice Display */}
      <motion.div
        className="relative cursor-pointer my-1.5"
        onClick={handleRollClick}
        animate={
          localRolling || isRolling
            ? {
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.15, 0.95, 1.1, 1],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{
          repeat: localRolling || isRolling ? Infinity : 0,
          duration: 0.35,
          ease: 'easeInOut',
        }}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white via-amber-50 to-amber-100 rounded-xl p-2 shadow-lg border-3 sm:border-4 border-amber-400 grid grid-cols-3 grid-rows-3 gap-0.5 sm:gap-1 relative overflow-hidden"
          style={{
            boxShadow:
              '0 8px 20px -4px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Subtle shine effect */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-white/50 rounded-full blur-sm" />

          {/* Dots rendering */}
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => {
              const hasDot = dots.some(([dr, dc]) => dr === r && dc === c);
              return (
                <div
                  key={`${r}-${c}`}
                  className="flex items-center justify-center"
                >
                  {hasDot ? (
                    <motion.div
                      layout
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-xs"
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      <p className="text-[11px] text-slate-600 my-1 font-semibold">
        Dadu: <span className="text-amber-700 font-bold text-sm">{displayValue}</span>
      </p>

      {/* Big Roll Button */}
      <button
        id="btn-roll-dice"
        onClick={handleRollClick}
        disabled={disabled || isRolling || localRolling}
        className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm ${
          disabled || isRolling || localRolling
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 border-2 border-amber-300 shadow-amber-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        <Dices className="w-4 h-4" />
        {localRolling || isRolling ? 'Membaling...' : 'Baling Dadu 🎲'}
      </button>

      {/* Helper instruction */}
      <p className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
        Dadu automatik secara rawak
      </p>
    </div>
  );
}
