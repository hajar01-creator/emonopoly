import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, Heart, Star, CheckCircle, Flame, ShieldAlert, Wind, Feather, Zap, HelpCircle } from 'lucide-react';
import { KadTenang, KadCabaran, Player } from '../types';
import { CHARACTERS } from '../data/characters';
import { speakText, playStarSound } from '../utils/audio';
import { BreathingExercise } from './BreathingExercise';

interface CardModalProps {
  card: KadTenang | KadCabaran;
  isTenang: boolean;
  player: Player;
  onClose: (starsEarned: number) => void;
}

export function CardModal({ card, isTenang, player, onClose }: CardModalProps) {
  const [showBreathing, setShowBreathing] = useState(false);
  const [peerPraises, setPeerPraises] = useState<{ [key: string]: number }>({
    hebat: 0,
    berani: 0,
    kasih: 0,
  });

  const character = CHARACTERS.find((c) => c.id === card.characterId) || CHARACTERS[0];

  const handleSpeech = () => {
    if (isTenang) {
      const c = card as KadTenang;
      speakText(`${c.title}. ${c.instruction}. ${c.quote}`);
    } else {
      const c = card as KadCabaran;
      speakText(`${c.title}. Situasi: ${c.scenario}. Cabaran kamu: ${c.actionRequired}. ${c.cheerMessage}`);
    }
  };

  const addPeerPraise = (type: 'hebat' | 'berani' | 'kasih') => {
    setPeerPraises((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    playStarSound();
  };

  const handleFinish = (starsEarned: number = card.starsEarned) => {
    if (starsEarned > 0) {
      playStarSound();
    }
    onClose(starsEarned);
  };

  if (showBreathing) {
    return (
      <BreathingExercise
        title={(card as KadTenang).title}
        initialStarsReward={card.starsEarned}
        onComplete={() => {
          setShowBreathing(false);
          handleFinish();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 overflow-hidden relative"
        style={{ borderColor: isTenang ? '#06B6D4' : '#F97316' }}
      >
        {/* Header Ribbon */}
        <div
          className={`px-6 py-4 text-white flex items-center justify-between ${
            isTenang
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500'
              : 'bg-gradient-to-r from-orange-500 to-amber-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              {isTenang ? (
                <Feather className="w-6 h-6 text-white" />
              ) : (
                <Zap className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                {isTenang ? 'Kad Tenang (Minda Damai)' : 'Kad Cabaran (Ekspresi Diri)'}
              </span>
              <h2 className="text-xl font-bold leading-tight">{card.title}</h2>
            </div>
          </div>

          <button
            onClick={handleSpeech}
            title="Dengarkan Suara Pembaca"
            className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Character Tag & Player Info */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{character.emoji}</span>
              <div>
                <p className="text-xs text-slate-500">Watak Terkait</p>
                <p className="text-sm font-bold text-slate-800">
                  {character.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="text-xs font-bold text-amber-900">
                Ganjaran: +{card.starsEarned} Bintang
              </span>
            </div>
          </div>

          {/* Specific Card Layout */}
          {isTenang ? (
            // Kad Tenang content
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200">
                <p className="text-xs font-semibold uppercase text-cyan-800 mb-1">
                  Panduan Bertenang:
                </p>
                <p className="text-base text-slate-700 leading-relaxed font-medium">
                  {(card as KadTenang).instruction}
                </p>
              </div>

              {(card as KadTenang).quote && (
                <div className="text-center italic text-xs text-slate-500 px-4 py-2 bg-slate-50 rounded-xl">
                  {(card as KadTenang).quote}
                </div>
              )}

              {(card as KadTenang).category === 'pernafasan' && (
                <button
                  onClick={() => setShowBreathing(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold text-sm flex items-center justify-center gap-2 border border-cyan-300 transition-all"
                >
                  <Wind className="w-4 h-4 text-cyan-700" />
                  Mula Latihan Bernafas Berpandu (10 Saat) 🌬️
                </button>
              )}
            </div>
          ) : (
            // Kad Cabaran content
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200">
                <p className="text-xs font-semibold uppercase text-orange-800 mb-0.5">
                  Situasi Emosi:
                </p>
                <p className="text-sm text-slate-700 font-medium">
                  {(card as KadCabaran).scenario}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300">
                <p className="text-xs font-bold uppercase text-amber-900 mb-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Cabaran Untuk {player.name}:
                </p>
                <p className="text-base text-slate-900 font-semibold leading-relaxed">
                  {(card as KadCabaran).actionRequired}
                </p>
              </div>

              {/* Peer Praises from classmates */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2 text-center">
                  Kawan-kawan sekalian, mari beri sorakan kepada {player.name}! 👏
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addPeerPraise('hebat')}
                    className="py-1.5 px-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                  >
                    ⭐ Hebat! {peerPraises.hebat > 0 && `(${peerPraises.hebat})`}
                  </button>
                  <button
                    onClick={() => addPeerPraise('berani')}
                    className="py-1.5 px-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                  >
                    🦁 Berani! {peerPraises.berani > 0 && `(${peerPraises.berani})`}
                  </button>
                  <button
                    onClick={() => addPeerPraise('kasih')}
                    className="py-1.5 px-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
                  >
                    ❤️ Kasih! {peerPraises.kasih > 0 && `(${peerPraises.kasih})`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Claim Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="btn-skip-card-action"
              type="button"
              onClick={() => handleFinish(0)}
              className="sm:w-2/5 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-xs cursor-pointer"
              title="Jika pemain tidak dapat atau belum mahu melakukan kad ini"
            >
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Tidak Dapat Buat (+0 ⭐)</span>
            </button>

            <button
              id="btn-claim-card-stars"
              type="button"
              onClick={() => handleFinish(card.starsEarned)}
              className={`sm:w-3/5 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isTenang
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-cyan-200'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200'
              }`}
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Selesai & Tebus (+{card.starsEarned} ⭐)</span>
            </button>
          </div>
          <p className="text-[11px] text-center text-slate-400 font-medium">
            💡 Pilih (+0 ⭐) jika murid ingin melangkau cabaran ini dengan selesa.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
