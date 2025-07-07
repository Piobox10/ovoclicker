
import { Decimal } from 'decimal.js';

export interface SkinCssVariables {
  // Backgrounds
  '--bg-primary': string; // Main page background part 1
  '--bg-secondary': string; // Main page background part 2
  '--bg-panel-primary': string; // e.g., current slate-900 for main panels
  '--bg-panel-secondary': string; // e.g., current slate-800 for modals, headers, sub-panels
  '--bg-panel-accent': string; // For highlighted panels or sections, e.g., combat panel
  '--bg-interactive': string; // Background for interactive elements like inputs, unselected tabs
  '--bg-interactive-hover': string;

  // Texts
  '--text-primary': string; // Primary text color (e.g., slate-100, slate-200)
  '--text-secondary': string; // Secondary text color (e.g., slate-300, slate-400)
  '--text-accent': string; // Main accent color for titles, icons (e.g., violet-400)
  '--text-accent-hover': string; // Hover for accent text
  '--text-emphasized': string; // For important numbers or highlights (e.g., amber-300)
  '--text-on-button-primary': string; // Text color on primary buttons

  // Borders
  '--border-primary': string; // Primary border for panels (e.g., slate-700)
  '--border-secondary': string; // Secondary border (e.g., slate-600)
  '--border-accent': string; // Accent border (e.g., violet-500)
  '--border-interactive': string; // Border for inputs

  // Buttons
  '--button-primary-bg': string; // Primary button background
  '--button-primary-hover-bg': string;
  '--button-secondary-bg': string; // For less prominent actions
  '--button-secondary-hover-bg': string;
  '--button-disabled-bg': string;
  '--button-disabled-text': string;

  // Scrollbar
  '--scrollbar-thumb': string;
  '--scrollbar-track': string;
  
  // Focus Rings
  '--focus-ring-color': string;

  // Specific UI element accents (can be expanded)
  '--egg-canvas-border': string;
  '--egg-canvas-shadow': string; // For the inset shadow
  '--egg-stage-text-color': string; // For text like "Próxima: ..." on canvas
  
  '--modal-backdrop-color': string; // e.g., 'rgba(0, 0, 0, 0.75)'

  // Mission Rarity Colors (more specific overrides)
  '--mission-common-bg': string;
  '--mission-common-border': string;
  '--mission-common-text': string;
  '--mission-common-icon-text': string;

  '--mission-rare-bg': string;
  '--mission-rare-border': string;
  '--mission-rare-text': string;
  '--mission-rare-icon-text': string;

  '--mission-epic-bg': string;
  '--mission-epic-border': string;
  '--mission-epic-text': string;
  '--mission-epic-icon-text': string;

  // Panel Titles
  '--title-regular-upgrades': string; 
  '--title-transcendence': string;
  '--title-special-upgrades': string;
  '--title-egg-forms': string;
  '--title-active-traits': string;
  '--title-active-abilities': string;
  '--title-legendary-secret': string;
  '--title-secrets-subheader': string;
  '--title-achievements': string;
  '--title-combat-panel': string;
  '--title-embryo-panel': string;
  '--title-run-stats': string;
  '--title-summary-panel': string;
  '--title-et-bonuses': string;
  '--title-et-permanent': string;
  '--title-cosmic-bank': string;
  '--title-crafting-workshop': string; 
  '--title-hidden-discoveries': string; 
  '--title-meta-upgrades': string; // Added for Meta Upgrades panel


  // Embryo Panel Specifics
  '--bg-embryo-panel': string;
  '--border-embryo-panel': string;
  '--progressbar-exp-fill': string;
  '--progressbar-hp-fill': string;
}

export interface SkinDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; 
  cost: Decimal; 
  cssVariables: SkinCssVariables;
  backgroundStyle: string; 
  previewColor?: string; 
}