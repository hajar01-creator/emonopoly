import { motion } from 'motion/react';
import {
  Sparkles,
  Star,
  Flag,
  Feather,
  Zap,
  Heart,
  Wind,
  Flame,
  ShieldAlert,
  CloudRain,
  ShieldCheck,
  Moon,
  Eye,
  Smile,
  Compass,
  Target,
  ArrowRight,
  Footprints,
} from 'lucide-react';
import { BoardTile, Player, MovementState } from '../types';
import { BOARD_TILES, ROUND_THEMES } from '../data/boardTiles';
import { CHARACTERS } from '../data/characters';
import { DiceRoller } from './DiceRoller';

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
  onRollDice: (value: number) => void;
  isRolling: boolean;
  isMoving: boolean;
  movementState?: MovementState | null;
  currentRound: number;
  totalRounds: number;
  onOpenHowToPlay: () => void;
  onOpenBreathing: () => void;
}

// Maps tile index (0..19) to 6x6 CSS grid position
const TILE_GRID_POSITIONS: { [key: number]: { row: number; col: number } } = {
  0: { row: 1, col: 1 },
  1: { row: 1, col: 2 },
  2: { row: 1, col: 3 },
  3: { row: 1, col: 4 },
  4: { row: 1, col: 5 },
  5: { row: 1, col: 6 },
  6: { row: 2, col: 6 },
  7: { row: 3, col: 6 },
  8: { row: 4, col: 6 },
  9: { row: 5, col: 6 },
  10: { row: 6, col: 6 },
  11: { row: 6, col: 5 },
  12: { row: 6, col: 4 },
  13: { row: 6, col: 3 },
  14: { row: 6, col: 2 },
  15: { row: 6, col: 1 },
  16: { row: 5, col: 1 },
  17: { row: 4, col: 1 },
  18: { row: 3, col: 1 },
  19: { row: 2, col: 1 },
};

// Direction flow around the perimeter (clockwise 1 -> 20)
const TILE_FLOW: { [key: number]: { arrow: string; label: string; angle: string } } = {
  0: { arrow: '➔', label: 'Kanan', angle: 'text-amber-600' },
  1: { arrow: '➔', label: 'Kanan', angle: 'text-amber-600' },
  2: { arrow: '➔', label: 'Kanan', angle: 'text-amber-600' },
  3: { arrow: '➔', label: 'Kanan', angle: 'text-amber-600' },
  4: { arrow: '➔', label: 'Kanan', angle: 'text-amber-600' },
  5: { arrow: '↳', label: 'Pusing Bawah', angle: 'text-rose-600' },
  6: { arrow: '↓', label: 'Bawah', angle: 'text-amber-600' },
  7: { arrow: '↓', label: 'Bawah', angle: 'text-amber-600' },
  8: { arrow: '↓', label: 'Bawah', angle: 'text-amber-600' },
  9: { arrow: '↓', label: 'Bawah', angle: 'text-amber-600' },
  10: { arrow: '↲', label: 'Pusing Kiri', angle: 'text-rose-600' },
  11: { arrow: '←', label: 'Kiri', angle: 'text-amber-600' },
  12: { arrow: '←', label: 'Kiri', angle: 'text-amber-600' },
  13: { arrow: '←', label: 'Kiri', angle: 'text-amber-600' },
  14: { arrow: '←', label: 'Kiri', angle: 'text-amber-600' },
  15: { arrow: '↰', label: 'Pusing Atas', angle: 'text-rose-600' },
  16: { arrow: '↑', label: 'Atas', angle: 'text-amber-600' },
  17: { arrow: '↑', label: 'Atas', angle: 'text-amber-600' },
  18: { arrow: '↑', label: 'Atas', angle: 'text-amber-600' },
  19: { arrow: '↱', label: 'Ke Mula', angle: 'text-emerald-600' },
};

export function Board({
  players,
  currentPlayerIndex,
  onRollDice,
  isRolling,
  isMoving,
  movementState,
  currentRound,
  totalRounds,
  onOpenHowToPlay,
  onOpenBreathing,
}: BoardProps) {
  const currentPlayer = players[currentPlayerIndex] || players[0];
  const themeIndex = Math.min(Math.max(currentRound - 1, 0), ROUND_THEMES.length - 1);
  const currentTheme = ROUND_THEMES[themeIndex];

  const renderTileIcon = (tile: BoardTile) => {
    switch (tile.iconName) {
      case 'Flag':
        return <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />;
      case 'Feather':
        return <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />;
      case 'CloudRain':
        return <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />;
      case 'Wind':
        return <Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />;
      case 'Moon':
        return <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />;
      case 'Eye':
        return <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500" />;
      case 'Smile':
        return <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />;
      default:
        return <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-3 flex flex-col items-center">
      {/* Top Status Bar: Rounds, Themes, Players, Ratio badge, Action buttons */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-2 sm:mb-3 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs">
            Pusingan {currentRound} / {totalRounds}
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1 shadow-2xs">
            {currentTheme.badge}
          </span>
          <span className="text-[11px] font-semibold text-slate-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 hidden sm:inline-flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Nisbah 4:3 • Searah Jam (1 ➔ 20)</span>
          </span>
        </div>

        {/* Players Mini Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {players.map((p, idx) => {
            const isTurn = idx === currentPlayerIndex;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  isTurn
                    ? 'bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{p.character.emoji}</span>
                <span className="truncate max-w-[70px] hidden sm:inline">
                  {p.name}
                </span>
                <span className="text-amber-700 ml-0.5">{p.stars}⭐</span>
              </div>
            );
          })}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenBreathing}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold text-xs flex items-center gap-1 transition-colors border border-cyan-300 cursor-pointer"
            title="Latihan Bernafas Segera"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Latihan Nafas</span>
          </button>
          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1 transition-colors border border-amber-300 cursor-pointer"
            title="Panduan Cara Bermain"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cara Bermain</span>
          </button>
        </div>
      </div>

      {/* 4:3 Monopoly Grid Board Container */}
      <div
        id="emotionopoly-board-4-3"
        className="w-full aspect-[4/3] min-h-[460px] sm:min-h-[540px] md:min-h-[620px] max-h-[84vh] grid grid-cols-6 grid-rows-6 gap-1 sm:gap-2 bg-gradient-to-br from-amber-50/90 via-sky-50/60 to-rose-50/70 p-1.5 sm:p-3 rounded-3xl border-4 border-amber-400 shadow-2xl relative select-none"
      >
        {/* Render 20 Perimeter Tiles */}
        {BOARD_TILES.map((tile) => {
          const pos = TILE_GRID_POSITIONS[tile.id];
          if (!pos) return null;

          const tileNum = tile.id + 1; // 1 to 20
          const flow = TILE_FLOW[tile.id] || { arrow: '➔', label: 'Seterusnya', angle: 'text-amber-600' };
          const isCorner = [0, 5, 10, 15].includes(tile.id);
          const playersHere = players.filter((p) => p.position === tile.id);

          const isCurrentPlayerStationary =
            currentPlayer.position === tile.id && !isMoving;
          const isTargetTile = movementState?.targetPos === tile.id;
          const isPathTile = movementState?.pathTiles?.includes(tile.id);
          const isSteppingHere = isMoving && currentPlayer.position === tile.id;

          return (
            <div
              key={tile.id}
              className={`relative rounded-xl sm:rounded-2xl flex flex-col justify-between p-1 sm:p-1.5 transition-all overflow-hidden border-2 ${
                isTargetTile
                  ? 'ring-4 ring-amber-500 shadow-xl scale-[1.03] z-30 bg-amber-50 border-amber-500 animate-pulse'
                  : isSteppingHere
                  ? 'ring-3 ring-cyan-500 shadow-lg scale-[1.02] z-25 bg-cyan-50 border-cyan-500'
                  : isCurrentPlayerStationary
                  ? 'ring-3 ring-amber-400 shadow-md z-20 bg-white border-amber-400'
                  : isPathTile
                  ? 'border-amber-300 bg-amber-50/70 shadow-xs'
                  : `${tile.borderColor} bg-white/95 shadow-2xs`
              }`}
              style={{
                gridRow: pos.row,
                gridColumn: pos.col,
              }}
            >
              {/* Header Color Strip with Tile Number and Direction Arrow */}
              <div
                className="w-full rounded-t-lg -mt-1 -mx-1 mb-1 px-1 py-0.5 flex items-center justify-between text-[8px] sm:text-[9px] font-black text-white"
                style={{ backgroundColor: tile.color }}
              >
                <span className="bg-black/30 px-1 py-0.2 rounded text-[7px] sm:text-[8px] tracking-tight">
                  #{tileNum}
                </span>
                <span
                  className="bg-white/30 text-white px-1 py-0.2 rounded font-mono font-bold leading-none"
                  title={`Arah ke Petak seterusnya: ${flow.label}`}
                >
                  {flow.arrow}
                </span>
              </div>

              {/* Target / Step Highlight Badge */}
              {isTargetTile && (
                <div className="absolute top-4 right-1 z-20 bg-amber-500 text-white text-[7px] sm:text-[8px] font-black px-1 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                  <Target className="w-2.5 h-2.5" />
                  <span>SASARAN</span>
                </div>
              )}

              {/* Tile Content */}
              <div className="flex flex-col items-center text-center justify-center flex-1 my-auto px-0.5">
                <div className="mb-0.5">{renderTileIcon(tile)}</div>
                <p className="text-[8px] sm:text-[10px] md:text-[11px] font-black text-slate-800 leading-tight line-clamp-2">
                  {tile.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[7px] sm:text-[9px] font-extrabold text-amber-700 bg-amber-100/80 px-1 rounded">
                    +{tile.starReward}⭐
                  </span>
                  {isCorner && (
                    <span className="text-[6.5px] sm:text-[8px] font-bold text-slate-500 bg-slate-100 px-1 rounded hidden sm:inline">
                      Zon Khas
                    </span>
                  )}
                </div>
              </div>

              {/* Player Tokens on this tile */}
              <div className="min-h-[20px] sm:min-h-[24px] flex items-center justify-center flex-wrap gap-0.5 mt-0.5 pt-0.5 border-t border-slate-100">
                {playersHere.map((p) => {
                  const isThisPlayerTurn = p.id === currentPlayer.id;
                  return (
                    <motion.div
                      key={p.id}
                      layoutId={`player-token-${p.id}`}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md border-2 cursor-pointer relative ${
                        isThisPlayerTurn
                          ? 'border-amber-400 ring-2 ring-amber-300'
                          : 'border-white'
                      }`}
                      style={{ backgroundColor: p.character.color }}
                      title={`${p.name} (${p.character.name}) di Petak #${tileNum}`}
                    >
                      <span>{p.character.emoji}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Center Hub Area (Spans row 2 to 5, col 2 to 5) */}
        <div
          className="rounded-3xl p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/95 via-amber-50/80 to-cyan-50/90 border-2 border-amber-200/80 shadow-inner relative overflow-hidden"
          style={{
            gridRow: '2 / span 4',
            gridColumn: '2 / span 4',
          }}
        >
          {/* Subtle Emotion Orbs in Center */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
            {CHARACTERS.map((char) => (
              <span
                key={char.id}
                className="text-sm sm:text-xl md:text-2xl hover:scale-125 transition-transform cursor-default"
                title={char.name}
              >
                {char.emoji}
              </span>
            ))}
          </div>

          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            <span className="text-amber-500">Emotion</span>
            <span className="text-cyan-600">opoly</span>
          </h2>

          {/* Movement Direction Compass Banner */}
          <div className="flex items-center gap-1.5 my-1 px-2.5 py-0.5 rounded-full bg-slate-100/90 border border-slate-200 text-[9px] sm:text-xs text-slate-600 font-semibold">
            <Compass className="w-3 h-3 text-cyan-600 shrink-0 animate-spin" style={{ animationDuration: '12s' }} />
            <span>Arah Gerakan: Searah Jam (1 ➔ 20)</span>
          </div>

          {/* Dynamic Center Display: Either Live Movement Progress OR Dice Roller */}
          {isMoving && movementState ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm my-2 p-2.5 sm:p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-white shadow-lg border-2 border-amber-300"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Footprints className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-bounce" />
                <span className="font-black text-xs sm:text-sm">
                  {currentPlayer.name} Sedang Melangkah!
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold bg-white/20 rounded-xl px-2 py-1 flex items-center justify-center gap-1.5">
                <span>Dadu: 🎲 {movementState.diceValue}</span>
                <span>•</span>
                <span>
                  Sasaran: Petak #{movementState.targetPos + 1} (
                  {BOARD_TILES[movementState.targetPos]?.title})
                </span>
              </div>
              <p className="text-[10px] text-amber-100 mt-1 font-medium">
                Baki langkah: {movementState.stepsRemaining}
              </p>
            </motion.div>
          ) : (
            <div className="w-full">
              {/* Center Embedded Dice Roller */}
              <DiceRoller
                currentPlayer={currentPlayer}
                onRoll={onRollDice}
                isRolling={isRolling}
                disabled={isRolling || isMoving}
              />
            </div>
          )}

          {/* Footer Encouragement Quote */}
          <div className="mt-1 sm:mt-2 px-3 py-1 rounded-full bg-white/80 border border-amber-200 text-[9px] sm:text-xs text-slate-600 font-medium flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 shrink-0" />
            <span className="truncate max-w-xs">
              "{currentPlayer.character.motto}"
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

