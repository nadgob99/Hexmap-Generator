import { Mode } from '../types/modes';
import { PlaceholderType } from '../types/placeholders';

export interface ModeConfig {
  label: string;
  tools: string[];
  placeholders?: PlaceholderType[];
}

export const modeConfigs: Record<Mode, ModeConfig> = {
  basic: {
    label: 'Basic Mode',
    tools: ['select', 'paint', 'erase', 'draw'],
  },
  ageOfWonders: {
    label: 'Age of Wonders',
    tools: ['select', 'paint', 'erase', 'draw', 'placeholder'],
    placeholders: [
      'trees', 'rock', 'water',
      'pikemen', 'shield', 'sword', 'hero', 'champion', 'cavalry',
      'monster', 'mage', 'archer', 'construct',
    ],
  },
};