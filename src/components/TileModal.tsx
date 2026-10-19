import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, CheckCircle, Heart, Star, RotateCcw, BookOpen, HelpCircle } from 'lucide-react';
import { BoardTile, Player } from '../types';
import { CHARACTERS } from '../data/characters';
import { ROUND_THEMES } from '../data/boardTiles';
import { speakText, playStarSound } from '../utils/audio';

interface TileModalProps {
  tile: BoardTile;
  player: Player;
  currentRound: number;
  totalRounds: number;
  onClose: (starsEarned: number) => void;
}

export function TileModal({
  tile,
  player,
  currentRound,
  totalRounds,
  onClose,
}: TileModalProps) {
  const [claps, setClaps] = useState<number>(0);

  // Available questions for this tile
  const questionsList =
    tile.questionsByRound && tile.questionsByRound.length > 0
      ? tile.questionsByRound
      : tile.question
      ? [tile.question]
      : [];

  const tipsList =
    tile.tipsByRound && tile.tipsByRound.length > 0
      ? tile.tipsByRound
      : tile.tip
      ? [tile.tip]
      : [];

  // Default question index calculated from currentRound (1-based index)
  const defaultIdx = (currentRound - 1) % (questionsList.length || 1);
  const [selectedQIdx, setSelectedQIdx] = useState<number>(defaultIdx);

  const activeQuestion = questionsList[selectedQIdx] || tile.question || tile.shortDesc;
  const activeTip = tipsList[selectedQIdx] || tile.tip;

  // Round theme info (maps round 1..5)
  const themeIndex = Math.min(Math.max(currentRound - 1, 0), ROUND_THEMES.length - 1);
  const currentTheme = ROUND_THEMES[themeIndex];

  const character = tile.characterId
    ? CHARACTERS.find((c) => c.id === tile.characterId)
    : null;

  const handleSpeech = () => {
    const speechText = `${tile.title}. Pusingan ${currentRound}: ${currentTheme.title}. Soalan: ${activeQuestion}. Panduan: ${
      activeTip || 'Kongsikan jawapan kamu secara jujur bersama kawan-kawan!'
    }`;
    speakText(speechText);
  };

  const handleNextQuestionVariant = () => {
    if (questionsList.length <= 1) return;
    setSelectedQIdx((prev) => (prev + 1) % questionsList.length);
    playStarSound();
  };

  const addClap = () => {
    setClaps((c) => c + 1);
    playStarSound();
  };

  const handleFinish = (stars: number = tile.starReward) => {
    if (stars > 0) {
      playStarSound();
    }
    onClose(stars);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 15 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 overflow-hidden"
        style={{ borderColor: tile.color }}
      >
        {/* Header Ribbon */}
        <div
          className="px-6 py-4 text-slate-900 flex items-center justify-between"
          style={{ backgroundColor: `${tile.color}30` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm text-2xl"
              style={{ backgroundColor: tile.color }}
            >
              {character?.emoji || '🌟'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {character ? `Zon Emosi: ${character.englishName}` : 'Petak Khas'}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-slate-300 text-slate-700">
                  Pusingan {currentRound}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {tile.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleSpeech}
            title="Dengarkan Suara Pembaca"
            className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-colors shadow-sm text-slate-700"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {/* Active Player banner & Round Theme Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{player.character.emoji}</span>
              <div>
                <p className="text-xs text-slate-500">Pemain Mendarat</p>
                <p className="text-sm font-bold text-slate-800">{player.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                {currentTheme.badge}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="text-xs font-extrabold text-amber-900">
                  +{tile.starReward}⭐
                </span>
              </div>
            </div>
          </div>

          {/* Depth Level Indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {currentTheme.title}
            </span>
            <span className="text-[10px] text-amber-800 font-bold">
              Tahap {Math.min(currentRound, 5)}/5
            </span>
          </div>

          {/* Question or Activity Box */}
          <div
            className="p-4 rounded-2xl border-2 space-y-2 relative"
            style={{
              backgroundColor: `${tile.color}12`,
              borderColor: `${tile.color}40`,
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Soalan Pusingan {currentRound}:
              </p>

              {/* Option to cycle question within this tile's bank if pupil wants */}
              {questionsList.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextQuestionVariant}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white border border-slate-200 shadow-2xs transition-all"
                  title="Tukar soalan lain jika mahu soalan berbeza"
                >
                  <RotateCcw className="w-3 h-3" />
                  Tukar Soalan ({selectedQIdx + 1}/{questionsList.length})
                </button>
              )}
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              "{activeQuestion}"
            </p>
          </div>

          {/* Contextual Round Coaching Tip */}
          {activeTip && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
              <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700">Bimbingan Emosi:</strong> {activeTip}
              </span>
            </div>
          )}

          {/* Peer Cheer buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-500">
              Kawan-kawan mendengar & menyokong:
            </span>
            <button
              onClick={addClap}
              className="py-1.5 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              👏 Tepuk Tangan! {claps > 0 && `(${claps})`}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="btn-skip-tile-question"
              type="button"
              onClick={() => handleFinish(0)}
              className="sm:w-2/5 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-xs cursor-pointer"
              title="Jika pemain tidak dapat atau belum bersedia menjawab soalan ini"
            >
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Tidak Dapat Jawab (+0 ⭐)</span>
            </button>

            <button
              id="btn-confirm-tile-action"
              type="button"
              onClick={() => handleFinish(tile.starReward)}
              className="sm:w-3/5 py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: tile.color,
                boxShadow: `0 10px 20px -5px ${tile.color}80`,
              }}
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Saya Sudah Kongsi! (+{tile.starReward} ⭐)</span>
            </button>
          </div>
          <p className="text-[11px] text-center text-slate-400 font-medium">
            💡 Ruang selamat: Murid boleh pilih butang (+0 ⭐) jika belum bersedia berkongsi tanpa rasa bersalah.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
