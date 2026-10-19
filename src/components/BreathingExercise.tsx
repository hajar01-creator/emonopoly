import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wind, Sparkles, CheckCircle, Volume2 } from 'lucide-react';
import { playCalmBellSound, playStarSound } from '../utils/audio';

interface BreathingExerciseProps {
  onComplete: () => void;
  title?: string;
  initialStarsReward?: number;
}

export function BreathingExercise({
  onComplete,
  title = 'Latihan Bernafas Ketenangan',
  initialStarsReward = 2,
}: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'tarik' | 'tahan' | 'hembus'>('tarik');
  const [countdown, setCountdown] = useState<number>(4);
  const [cycle, setCycle] = useState<number>(1);
  const totalCycles = 3;
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    playCalmBellSound();
  }, []);

  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (phase === 'tarik') {
            setPhase('tahan');
            return 3;
          } else if (phase === 'tahan') {
            setPhase('hembus');
            return 4;
          } else {
            // cycle finished
            if (cycle >= totalCycles) {
              setIsFinished(true);
              playStarSound();
              return 0;
            } else {
              setCycle((c) => c + 1);
              setPhase('tarik');
              playCalmBellSound();
              return 4;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, cycle, isFinished]);

  const getInstruction = () => {
    switch (phase) {
      case 'tarik':
        return {
          title: 'Tarik Nafas Perlahan 🌬️',
          subtitle: 'Tarik udara segar melalui hidung, kembangkan dada kamu.',
          color: 'from-cyan-400 to-blue-500',
          scale: 1.35,
        };
      case 'tahan':
        return {
          title: 'Tahan Sebentar ✨',
          subtitle: 'Kekalkan ketenangan dalam dada dengan santai.',
          color: 'from-amber-400 to-orange-400',
          scale: 1.35,
        };
      case 'hembus':
        return {
          title: 'Hembus Nafas Lembut 🍃',
          subtitle: 'Lepaskan semua rasa cemas dan letih melalui mulut.',
          color: 'from-emerald-400 to-teal-500',
          scale: 1,
        };
    }
  };

  const currentInfo = getInstruction();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-4 border-cyan-200 relative overflow-hidden"
      >
        {/* Decorative Top Accent */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wind className="w-6 h-6 text-cyan-500 animate-pulse" />
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Pusingan {cycle} daripada {totalCycles}
        </p>

        {/* Breathing Animation Orb */}
        <div className="relative h-56 flex items-center justify-center my-4">
          {/* Outer Ripple */}
          <motion.div
            animate={{
              scale: isFinished ? 1 : currentInfo.scale * 1.15,
              opacity: phase === 'hembus' ? 0.3 : 0.6,
            }}
            transition={{ duration: phase === 'tahan' ? 0.2 : 3.8, ease: 'easeInOut' }}
            className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr ${currentInfo.color} blur-xl`}
          />

          {/* Core Orb */}
          <motion.div
            animate={{
              scale: isFinished ? 1 : currentInfo.scale,
            }}
            transition={{ duration: phase === 'tahan' ? 0.2 : 3.8, ease: 'easeInOut' }}
            className={`w-36 h-36 rounded-full bg-gradient-to-tr ${currentInfo.color} shadow-2xl flex flex-col items-center justify-center text-white relative z-10 border-4 border-white/80`}
          >
            {isFinished ? (
              <CheckCircle className="w-16 h-16 text-white animate-bounce" />
            ) : (
              <>
                <span className="text-4xl font-extrabold tracking-tight">
                  {countdown}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider mt-1 text-white/90">
                  Saat
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* Dynamic Instructional Text */}
        <div className="min-h-16 flex flex-col items-center justify-center my-2">
          {isFinished ? (
            <div>
              <h3 className="text-lg font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                <Sparkles className="w-5 h-5" /> Badan & Minda Kamu Kini Tenang!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Hebat sekali! Kamu telah berjaya melatih minda yang damai.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {currentInfo.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {currentInfo.subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Button */}
        <div className="mt-6">
          {isFinished ? (
            <button
              id="btn-complete-breathing"
              onClick={onComplete}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              Selesai & Tebus +{initialStarsReward} Bintang Ketenangan ⭐
            </button>
          ) : (
            <button
              id="btn-skip-breathing"
              onClick={onComplete}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Saya sudah rasa tenang (Langkau ke Papan)
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
