export type CharacterId =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'disgust'
  | 'anxiety'
  | 'envy'
  | 'ennui';

export interface Character {
  id: CharacterId;
  name: string; // e.g. "Joy (Riang)"
  englishName: string;
  malayName: string;
  color: string; // Tailwind color class or hex
  accentColor: string;
  bgLight: string;
  borderClass: string;
  textClass: string;
  emoji: string;
  description: string;
  motto: string;
  elementIcon: string;
}

export interface Player {
  id: number;
  name: string;
  character: Character;
  position: number; // 0 to TotalTiles - 1
  stars: number; // Bintang Emosi
  calmCardsCount: number;
  challengeCardsCount: number;
  badges: string[];
}

export type TileType =
  | 'start'
  | 'emotion_joy'
  | 'emotion_sadness'
  | 'emotion_anger'
  | 'emotion_fear'
  | 'emotion_anxiety'
  | 'emotion_disgust'
  | 'emotion_envy'
  | 'emotion_ennui'
  | 'kad_tenang'
  | 'kad_cabaran'
  | 'pulau_tenang' // Rest zone
  | 'pentas_luahan' // Expression zone
  | 'bilik_kawalan'; // HQ Riley

export interface BoardTile {
  id: number;
  title: string;
  type: TileType;
  characterId?: CharacterId;
  shortDesc: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconName: string;
  starReward: number;
  question?: string;
  questionsByRound?: string[];
  tip?: string;
  tipsByRound?: string[];
}

export interface KadTenang {
  id: string;
  title: string;
  characterId: CharacterId;
  category: 'pernafasan' | 'afirmasi' | 'grounding' | 'pergerakan';
  instruction: string;
  durationSeconds?: number;
  starsEarned: number;
  quote: string;
}

export interface KadCabaran {
  id: string;
  title: string;
  characterId: CharacterId;
  category: 'lakonan' | 'kongsi_kisah' | 'soalan_jujur' | 'kebaikan';
  scenario: string;
  actionRequired: string;
  starsEarned: number;
  cheerMessage: string;
}

export interface MovementState {
  diceValue: number;
  initialPos: number;
  targetPos: number;
  currentPos: number;
  stepsRemaining: number;
  pathTiles: number[];
}

export type GamePhase =
  | 'setup'
  | 'playing'
  | 'rolling'
  | 'moving'
  | 'action_tile'
  | 'action_card_tenang'
  | 'action_card_cabaran'
  | 'breathing_guide'
  | 'game_over';
