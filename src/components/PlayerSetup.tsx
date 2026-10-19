import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, Trophy, Play, Check } from 'lucide-react';
import { Player, Character } from '../types';
import { CHARACTERS } from '../data/characters';
import { playStarSound } from '../utils/audio';

interface PlayerSetupProps {
  onStartGame: (players: Player[], targetRounds: number) => void;
  onOpenRules: () => void;
}

export function PlayerSetup({ onStartGame, onOpenRules }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4>(2);
  const [targetRounds, setTargetRounds] = useState<number>(5);

  const [playerData, setPlayerData] = useState<
    Array<{ name: string; characterId: string }>
  >([
    { name: 'Pemain 1', characterId: 'joy' },
    { name: 'Pemain 2', characterId: 'sadness' },
    { name: 'Pemain 3', characterId: 'anger' },
    { name: 'Pemain 4', characterId: 'anxiety' },
  ]);

  const handleNameChange = (index: number, newName: string) => {
    setPlayerData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name: newName };
      return copy;
    });
  };

  const handleCharacterSelect = (index: number, characterId: string) => {
    setPlayerData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], characterId };
      return copy;
    });
  };

  const handleStart = () => {
    playStarSound();

    const selectedPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const data = playerData[i];
      const char =
        CHARACTERS.find((c) => c.id === data.characterId) || CHARACTERS[i % CHARACTERS.length];
      selectedPlayers.push({
        id: i,
        name: data.name.trim() || `Pemain ${i + 1}`,
        character: char,
        position: 0,
        stars: 3, // Starting stars
        calmCardsCount: 0,
        challengeCardsCount: 0,
        badges: [],
      });
    }

    onStartGame(selectedPlayers, targetRounds);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-rose-50 to-cyan-100 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-amber-300 p-5 sm:p-8"
      >
        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Edisi Sekolah Rendah (Umur 7 - 12 Tahun)
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span className="text-amber-500">Emotion</span>
            <span className="text-cyan-600">opoly</span> 🎲
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-md mx-auto mt-1">
            Permainan Monopoli Emosi & Luahan Perasaan berinspirasikan watak Inside Out!
          </p>
        </div>

        {/* Setup Options: Player Count & Game Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Player Count Selection (2, 3, 4) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-600" /> Bilangan Pemain:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  id={`btn-player-count-${num}`}
                  onClick={() => setPlayerCount(num as 2 | 3 | 4)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-1 ${
                    playerCount === num
                      ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-md scale-105'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                  }`}
                >
                  {num} Pemain
                </button>
              ))}
            </div>
          </div>

          {/* Game Duration Selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Tempoh Pusingan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '5 Pusingan', value: 5 },
                { label: '8 Pusingan', value: 8 },
                { label: '10 Pusingan', value: 10 },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  id={`btn-rounds-${r.value}`}
                  onClick={() => setTargetRounds(r.value)}
                  className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all border-2 flex items-center justify-center ${
                    targetRounds === r.value
                      ? 'bg-cyan-500 border-cyan-600 text-white shadow-md scale-105'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Players Customization Grid */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Tetapkan Nama & Pilih Watak Inside Out:
            </h3>
            <button
              onClick={onOpenRules}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800 underline flex items-center gap-1"
            >
              📖 Baca Cara Bermain
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Array.from({ length: playerCount }).map((_, idx) => {
              const currentData = playerData[idx];
              const selectedChar =
                CHARACTERS.find((c) => c.id === currentData.characterId) ||
                CHARACTERS[idx];

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border-2 transition-all bg-white shadow-sm"
                  style={{ borderColor: selectedChar.accentColor }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Pemain {idx + 1}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${selectedChar.color}30`,
                        color: selectedChar.accentColor,
                      }}
                    >
                      {selectedChar.name}
                    </span>
                  </div>

                  {/* Player Name Input */}
                  <input
                    type="text"
                    value={currentData.name}
                    maxLength={15}
                    placeholder={`Nama Pemain ${idx + 1}`}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3"
                  />

                  {/* Character Avatar Picker */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {CHARACTERS.map((char) => {
                      const isSelected = currentData.characterId === char.id;
                      return (
                        <button
                          key={char.id}
                          type="button"
                          onClick={() => handleCharacterSelect(idx, char.id)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 scale-105 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={`${char.name}: ${char.description}`}
                        >
                          <span className="text-xl">{char.emoji}</span>
                          <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                            {char.englishName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <button
            id="btn-open-rules-setup"
            type="button"
            onClick={onOpenRules}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
          >
            📖 Panduan Cara Bermain
          </button>

          <button
            id="btn-start-game"
            type="button"
            onClick={handleStart}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            Mula Pengembaraan Emotionopoly! 🚀
          </button>
        </div>
      </motion.div>
    </div>
  );
}
