import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, RotateCcw, Award, Heart } from 'lucide-react';
import { Player } from '../types';
import { playFanfareSound } from '../utils/audio';

interface EndGameModalProps {
  players: Player[];
  onRestart: () => void;
}

const HONORARY_TITLES = [
  '🌟 Juara Ketenangan & Ekspresi Diri',
  '💎 Wira Empati Sahabat Sejati',
  '🦁 Bintang Keberanian Meluahkan Hati',
  '✨ Penyebar Ceria & Senyuman Terang',
];

export function EndGameModal({ players, onRestart }: EndGameModalProps) {
  // Sort players by stars descending
  const sortedPlayers = [...players].sort((a, b) => b.stars - a.stars);

  useEffect(() => {
    playFanfareSound();

    // Trigger confetti cannon
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#FACC15', '#60A5FA', '#F87171', '#C084FC', '#4ADE80', '#FB923C'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 text-center overflow-hidden relative"
      >
        {/* Celebration Header */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-lg">
          <Trophy className="w-9 h-9 text-amber-600 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Tahniah Semua Pemain! 🎉
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-5">
          Semua pemain telah menunjukkan keberanian meluahkan perasaan dan saling menyokong dengan penuh kasih sayang!
        </p>

        {/* Players Podium List */}
        <div className="space-y-3 mb-6">
          {sortedPlayers.map((p, index) => {
            const isWinner = index === 0;
            const title = HONORARY_TITLES[index] || '🌈 Bintang Emosi Hebat';

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isWinner
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-100 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                      isWinner
                        ? 'bg-amber-400 text-amber-950 border border-amber-500'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{p.character.emoji}</span>
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        {p.name}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        ({p.character.name})
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-700 mt-0.5">
                      {title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-amber-200 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-black text-slate-800">
                    {p.stars} ⭐
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message for Teachers/Pupils */}
        <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 mb-6 flex items-center justify-center gap-2 text-xs font-semibold text-cyan-900">
          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          Ingat: Setiap emosi ada tujuan tersendiri. Jangan pendam, sentiasa berkongsi!
        </div>

        {/* Restart Button */}
        <button
          id="btn-restart-game"
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
        >
          <RotateCcw className="w-5 h-5" />
          Main Semula Bersama Kawan-Kawan! 🎲
        </button>
      </motion.div>
    </div>
  );
}
