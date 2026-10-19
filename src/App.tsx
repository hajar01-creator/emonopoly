/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Player, GamePhase, KadTenang, KadCabaran, BoardTile, MovementState } from './types';
import { BOARD_TILES } from './data/boardTiles';
import { KAD_TENANG_LIST, KAD_CABARAN_LIST } from './data/cards';
import { PlayerSetup } from './components/PlayerSetup';
import { Board } from './components/Board';
import { CardModal } from './components/CardModal';
import { TileModal } from './components/TileModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { BreathingExercise } from './components/BreathingExercise';
import { EndGameModal } from './components/EndGameModal';
import { playStepSound, playStarSound } from './utils/audio';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(5);

  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [movementState, setMovementState] = useState<MovementState | null>(null);

  const [activeCard, setActiveCard] = useState<KadTenang | KadCabaran | null>(null);
  const [isCardTenang, setIsCardTenang] = useState<boolean>(true);
  const [activeTile, setActiveTile] = useState<BoardTile | null>(null);

  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showBreathingQuick, setShowBreathingQuick] = useState<boolean>(false);
  const [passStartNotice, setPassStartNotice] = useState<string | null>(null);

  // Handle Game Setup submission
  const handleStartGame = (initializedPlayers: Player[], rounds: number) => {
    setPlayers(initializedPlayers);
    setTotalRounds(rounds);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setPhase('playing');
  };

  // Handle Dice Roll & Step-by-Step Moving Animation
  const handleRollDice = (diceValue: number) => {
    if (isRolling || isMoving || phase !== 'playing') return;

    setIsRolling(false);
    setIsMoving(true);

    const player = players[currentPlayerIndex];
    const initialPos = player.position;
    const totalTiles = BOARD_TILES.length; // 20
    const finalPos = (initialPos + diceValue) % totalTiles;

    const pathTiles: number[] = [];
    for (let i = 1; i <= diceValue; i++) {
      pathTiles.push((initialPos + i) % totalTiles);
    }

    setMovementState({
      diceValue,
      initialPos,
      targetPos: finalPos,
      currentPos: initialPos,
      stepsRemaining: diceValue,
      pathTiles,
    });

    let stepsTaken = 0;
    let currentStepPos = initialPos;
    let passedStart = false;

    const moveInterval = setInterval(() => {
      stepsTaken++;
      currentStepPos = (currentStepPos + 1) % totalTiles;
      playStepSound();

      setMovementState({
        diceValue,
        initialPos,
        targetPos: finalPos,
        currentPos: currentStepPos,
        stepsRemaining: diceValue - stepsTaken,
        pathTiles,
      });

      // Check if passed Mula (Tile 0)
      if (currentStepPos === 0 && stepsTaken < diceValue) {
        passedStart = true;
      }

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === currentPlayerIndex ? { ...p, position: currentStepPos } : p
        )
      );

      if (stepsTaken >= diceValue) {
        clearInterval(moveInterval);
        setIsMoving(false);
        setMovementState(null);

        // If passed start, give bonus 2 stars
        if (passedStart || currentStepPos === 0) {
          playStarSound();
          setPassStartNotice(`Tahniah! ${player.name} melintasi petak MULA (+2 ⭐)`);
          setPlayers((prev) =>
            prev.map((p, idx) =>
              idx === currentPlayerIndex ? { ...p, stars: p.stars + 2 } : p
            )
          );
          setTimeout(() => setPassStartNotice(null), 3000);
        }

        // Trigger action on final landed tile
        const targetTile = BOARD_TILES[finalPos];
        handleTileLanded(targetTile);
      }
    }, 280);
  };

  // Trigger modal depending on tile type
  const handleTileLanded = (tile: BoardTile) => {
    if (tile.type === 'kad_tenang') {
      // Pick random Kad Tenang
      const randomIndex = Math.floor(Math.random() * KAD_TENANG_LIST.length);
      const randomCard = KAD_TENANG_LIST[randomIndex];
      setActiveCard(randomCard);
      setIsCardTenang(true);
      setPhase('action_card_tenang');
    } else if (tile.type === 'kad_cabaran') {
      // Pick random Kad Cabaran
      const randomIndex = Math.floor(Math.random() * KAD_CABARAN_LIST.length);
      const randomCard = KAD_CABARAN_LIST[randomIndex];
      setActiveCard(randomCard);
      setIsCardTenang(false);
      setPhase('action_card_cabaran');
    } else {
      // Landed on Emotion Zone or Corner tile
      setActiveTile(tile);
      setPhase('action_tile');
    }
  };

  // Complete Tile or Card modal action and advance turn
  const handleCompleteAction = (starsEarned: number) => {
    // Update player stars
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== currentPlayerIndex) return p;
        return {
          ...p,
          stars: p.stars + starsEarned,
          calmCardsCount: isCardTenang && activeCard ? p.calmCardsCount + 1 : p.calmCardsCount,
          challengeCardsCount: !isCardTenang && activeCard ? p.challengeCardsCount + 1 : p.challengeCardsCount,
        };
      })
    );

    setActiveCard(null);
    setActiveTile(null);

    // Advance turn to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    // Check if a full round of all players has completed
    if (nextPlayerIndex === 0) {
      if (currentRound >= totalRounds) {
        setPhase('game_over');
        return;
      }
      setCurrentRound((r) => r + 1);
    }

    setPhase('playing');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-amber-200">
      {/* Setup Screen */}
      {phase === 'setup' && (
        <PlayerSetup
          onStartGame={handleStartGame}
          onOpenRules={() => setShowHowToPlay(true)}
        />
      )}

      {/* Main Playing Board View */}
      {phase !== 'setup' && (
        <main className="min-h-screen py-3 sm:py-6 px-2 sm:px-4 flex flex-col justify-between bg-gradient-to-b from-amber-50/50 via-slate-50 to-cyan-50/50">
          {/* Notification Banner when passing start */}
          {passStartNotice && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-xl flex items-center gap-2 animate-bounce">
              <span>🚩</span> {passStartNotice}
            </div>
          )}

          <Board
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            onRollDice={handleRollDice}
            isRolling={isRolling}
            isMoving={isMoving}
            movementState={movementState}
            currentRound={currentRound}
            totalRounds={totalRounds}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenBreathing={() => setShowBreathingQuick(true)}
          />

          <footer className="text-center text-xs text-slate-500 py-2">
            Emotionopoly • Permainan Papan Luahan Emosi Murid Sekolah Rendah (Inside Out)
          </footer>
        </main>
      )}

      {/* Kad Tenang or Kad Cabaran Modal */}
      {(phase === 'action_card_tenang' || phase === 'action_card_cabaran') &&
        activeCard && (
          <CardModal
            card={activeCard}
            isTenang={isCardTenang}
            player={players[currentPlayerIndex]}
            onClose={handleCompleteAction}
          />
        )}

      {/* Emotion Tile / Corner Tile Modal */}
      {phase === 'action_tile' && activeTile && (
        <TileModal
          tile={activeTile}
          player={players[currentPlayerIndex]}
          currentRound={currentRound}
          totalRounds={totalRounds}
          onClose={handleCompleteAction}
        />
      )}

      {/* Quick Breathing Exercise Helper Modal */}
      {showBreathingQuick && (
        <BreathingExercise
          title="Zon Bernafas Segera"
          initialStarsReward={1}
          onComplete={() => {
            setShowBreathingQuick(false);
            playStarSound();
          }}
        />
      )}

      {/* How to Play Rules Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Game Over Celebration Screen */}
      {phase === 'game_over' && (
        <EndGameModal
          players={players}
          onRestart={() => setPhase('setup')}
        />
      )}
    </div>
  );
}
