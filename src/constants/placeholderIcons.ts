import { PlaceholderType } from '../types/placeholders';

export const placeholderIcons: Record<PlaceholderType, { emoji: string; label: string }> = {
  trees: { emoji: '🌲', label: 'Trees' },
  rock: { emoji: '🪨', label: 'Rock' },
  water: { emoji: '💧', label: 'Water' },
  pikemen: { emoji: '⚔️', label: 'Pikemen' },
  shield: { emoji: '🛡️', label: 'Shield' },
  sword: { emoji: '🗡️', label: 'Sword' },
  hero: { emoji: '⭐', label: 'Hero' },
  champion: { emoji: '👑', label: 'Champion' },
  cavalry: { emoji: '🐴', label: 'Cavalry' },
  monster: { emoji: '👹', label: 'Monster' },
  mage: { emoji: '🧙', label: 'Mage' },
  archer: { emoji: '🏹', label: 'Archer' },
  construct: { emoji: '🏗️', label: 'Construct' },
};