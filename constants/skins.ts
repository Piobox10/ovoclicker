
import { Decimal } from 'decimal.js';
import { SkinDefinition, SkinCssVariables, MetaUpgrade } from '../types';

export const DEFAULT_CSS_VARIABLES: SkinCssVariables = { 
  // Backgrounds
  '--bg-primary': '#0f172a', // slate-900
  '--bg-secondary': '#1e293b', // slate-800
  '--bg-panel-primary': '#1e293b', // slate-800 (main panels)
  '--bg-panel-secondary': '#0f172a', // slate-900 (modals, headers, sub-panels)
  '--bg-panel-accent': '#ef4444', // red-600 (example for combat panel)
  '--bg-interactive': '#334155', // slate-700 (inputs, unselected tabs)
  '--bg-interactive-hover': '#475569', // slate-600

  // Texts
  '--text-primary': '#e2e8f0', // slate-200
  '--text-secondary': '#94a3b8', // slate-400
  '--text-accent': '#818cf8', // indigo-400
  '--text-accent-hover': '#a5b4fc', // indigo-300
  '--text-emphasized': '#f59e0b', // amber-500
  '--text-on-button-primary': '#ffffff',

  // Borders
  '--border-primary': '#334155', // slate-700
  '--border-secondary': '#475569', // slate-600
  '--border-accent': '#6366f1', // indigo-500
  '--border-interactive': '#4b5563', // gray-600

  // Buttons
  '--button-primary-bg': '#4f46e5', // indigo-600
  '--button-primary-hover-bg': '#4338ca', // indigo-700
  '--button-secondary-bg': '#374151', // gray-700
  '--button-secondary-hover-bg': '#4b5563', // gray-600
  '--button-disabled-bg': '#4b5563', // gray-600
  '--button-disabled-text': '#9ca3af', // gray-400

  // Scrollbar
  '--scrollbar-thumb': '#4338ca', // indigo-700
  '--scrollbar-track': '#1e293b', // slate-800
  
  // Focus Rings
  '--focus-ring-color': '#818cf8', // indigo-400

  // Specific UI element accents
  '--egg-canvas-border': '#6366f1', // indigo-500
  '--egg-canvas-shadow': 'rgba(79,70,229,0.5)', // indigo-600 with opacity
  '--egg-stage-text-color': '#c7d2fe', // indigo-200
  
  '--modal-backdrop-color': 'rgba(0, 0, 0, 0.75)',

  // Mission Rarity Colors
  '--mission-common-bg': 'rgba(51, 65, 85, 0.6)', 
  '--mission-common-border': '#475569', 
  '--mission-common-text': '#d1d5db', 
  '--mission-common-icon-text': '#9ca3af', 

  '--mission-rare-bg': 'rgba(56, 189, 248, 0.4)', 
  '--mission-rare-border': '#0284c7', 
  '--mission-rare-text': '#7dd3fc', 
  '--mission-rare-icon-text': '#38bdf8', 

  '--mission-epic-bg': 'rgba(168, 85, 247, 0.4)', 
  '--mission-epic-border': '#9333ea', 
  '--mission-epic-text': '#d8b4fe', 
  '--mission-epic-icon-text': '#c084fc', 
  
  // Panel Titles (Default)
  '--title-regular-upgrades': '#a5b4fc', // indigo-300
  '--title-transcendence': '#c4b5fd', // violet-300 
  '--title-special-upgrades': '#fcd34d', // amber-300
  '--title-egg-forms': '#6ee7b7', // emerald-300
  '--title-active-traits': '#38bdf8', // sky-400
  '--title-active-abilities': '#f87171', // red-400
  '--title-legendary-secret': '#fde047', // yellow-300
  '--title-secrets-subheader': '#ef4444', // red-500
  '--title-achievements': '#facc15', // yellow-400
  '--title-combat-panel': '#fecaca', // red-200
  '--title-embryo-panel': '#bef264', // lime-300
  '--title-run-stats': '#94a3b8', // slate-400
  '--title-summary-panel': '#7dd3fc', // sky-300
  '--title-et-bonuses': '#a78bfa', // purple-400
  '--title-et-permanent': '#2dd4bf', // teal-400
  '--title-cosmic-bank': '#a78bfa', // purple-400
  '--title-crafting-workshop': '#fb923c', // orange-400
  '--title-hidden-discoveries': '#f59e0b', // amber-500 
  '--title-meta-upgrades': '#fbbf24', // amber-400


  // Embryo Panel Specifics (Defaults)
  '--bg-embryo-panel': '#059669', // emerald-600
  '--border-embryo-panel': '#047857', // emerald-700
  '--progressbar-exp-fill': 'linear-gradient(to right, #a3e635, #22c55e)', // lime-400 to green-500
  '--progressbar-hp-fill': '#ef4444', // red-500
};

export const SKIN_DEFINITIONS: SkinDefinition[] = [
  {
    id: 'default',
    name: "Padrão Cósmico",
    description: "O visual clássico e familiar do Ovo Clicker.",
    icon: 'fas fa-paint-brush',
    cost: new Decimal(0),
    cssVariables: DEFAULT_CSS_VARIABLES,
    backgroundStyle: 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-primary))',
    previewColor: DEFAULT_CSS_VARIABLES['--bg-primary'],
  },
  {
    id: 'cosmicVoid',
    name: "Vazio Cósmico",
    description: "Mergulhe na profunda escuridão do espaço infinito.",
    icon: 'fas fa-star',
    cost: new Decimal(1000000), // 1M PI
    cssVariables: {
      ...DEFAULT_CSS_VARIABLES, 
      '--bg-primary': '#030712', 
      '--bg-secondary': '#111827', 
      '--bg-panel-primary': '#111827', 
      '--bg-panel-secondary': '#030712', 
      '--bg-panel-accent': '#581c87', 
      '--bg-interactive': '#1f2937', 
      '--bg-interactive-hover': '#374151', 
      '--text-primary': '#d1d5db', 
      '--text-secondary': '#9ca3af', 
      '--text-accent': '#c084fc', 
      '--text-accent-hover': '#a855f7', 
      '--text-emphasized': '#facc15', 
      '--border-primary': '#1f2937', 
      '--border-secondary': '#374151', 
      '--border-accent': '#9333ea', 
      '--button-primary-bg': '#7e22ce', 
      '--button-primary-hover-bg': '#6b21a8', 
      '--scrollbar-thumb': '#9333ea', 
      '--scrollbar-track': '#1f2937', 
      '--focus-ring-color': '#c084fc', 
      '--egg-canvas-border': '#9333ea', 
      '--egg-canvas-shadow': 'rgba(147, 51, 234, 0.5)', 
      '--egg-stage-text-color': '#e9d5ff', 
      '--modal-backdrop-color': 'rgba(10, 0, 20, 0.85)',
      '--title-regular-upgrades': '#d8b4fe', 
      '--title-transcendence': '#f0abfc', 
      '--title-special-upgrades': '#fde047', 
      '--title-egg-forms': '#6ee7b7', 
      '--title-active-traits': '#7dd3fc', 
      '--title-active-abilities': '#fda4af', 
      '--title-legendary-secret': '#fcd34d', 
      '--title-secrets-subheader': '#fb7185', 
      '--title-achievements': '#facc15', 
      '--title-combat-panel': '#e9d5ff', 
      '--title-embryo-panel': '#a7f3d0', 
      '--title-run-stats': '#9ca3af', 
      '--title-summary-panel': '#7dd3fc', 
      '--title-et-bonuses': '#c084fc', 
      '--title-et-permanent': '#5eead4', 
      '--title-cosmic-bank': '#d8b4fe', 
      '--title-crafting-workshop': '#e879f9', 
      '--title-hidden-discoveries': '#d8b4fe', 
      '--title-meta-upgrades': '#e9d5ff', // void theme for meta
      '--bg-embryo-panel': '#1e1b4b', // deep indigo
      '--border-embryo-panel': '#3730a3', // indigo
      '--progressbar-exp-fill': '#a855f7', // purple-600
      '--progressbar-hp-fill': '#7e22ce', // purple-700
    },
    backgroundStyle: 'radial-gradient(ellipse at bottom, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
    previewColor: '#030712',
  },
  {
    id: 'emeraldDawn',
    name: "Alvorecer Esmeralda",
    description: "Um tema fresco e vibrante, inspirado na natureza e crescimento.",
    icon: 'fas fa-leaf',
    cost: new Decimal(1500000),
    cssVariables: {
      ...DEFAULT_CSS_VARIABLES,
      '--bg-primary': '#064e3b', 
      '--bg-secondary': '#057a55', 
      '--bg-panel-primary': '#047857', 
      '--bg-panel-secondary': '#065f46', 
      '--bg-panel-accent': '#be185d', 
      '--bg-interactive': '#022c22', 
      '--bg-interactive-hover': '#014737',
      '--text-primary': '#a7f3d0', 
      '--text-secondary': '#6ee7b7', 
      '--text-accent': '#34d399', 
      '--text-accent-hover': '#10b981', 
      '--text-emphasized': '#fef08a', 
      '--border-primary': '#057a55', 
      '--border-secondary': '#069668', 
      '--border-accent': '#10b981', 
      '--button-primary-bg': '#10b981', 
      '--button-primary-hover-bg': '#059669', 
      '--scrollbar-thumb': '#10b981', 
      '--scrollbar-track': '#065f46', 
      '--focus-ring-color': '#6ee7b7', 
      '--egg-canvas-border': '#10b981', 
      '--egg-canvas-shadow': 'rgba(16, 185, 129, 0.5)', 
      '--egg-stage-text-color': '#d1fae5', 
      '--modal-backdrop-color': 'rgba(0, 20, 10, 0.8)',
      '--title-regular-upgrades': '#6ee7b7', 
      '--title-transcendence': '#86efac', 
      '--title-special-upgrades': '#fef08a', 
      '--title-egg-forms': '#5eead4', 
      '--title-active-traits': '#5eead4', 
      '--title-active-abilities': '#fda4af', 
      '--title-legendary-secret': '#fde047', 
      '--title-secrets-subheader': '#fb7185', 
      '--title-achievements': '#facc15', 
      '--title-combat-panel': '#fbcfe8', 
      '--title-embryo-panel': '#d1fae5', 
      '--title-run-stats': '#6ee7b7', 
      '--title-summary-panel': '#5eead4', 
      '--title-et-bonuses': '#a7f3d0', 
      '--title-et-permanent': '#34d399', 
      '--title-cosmic-bank': '#86efac', 
      '--title-crafting-workshop': '#2dd4bf', 
      '--title-hidden-discoveries': '#86efac', 
      '--title-meta-upgrades': '#a7f3d0', // emerald theme for meta
      '--bg-embryo-panel': '#065f46', // emerald-800
      '--border-embryo-panel': '#047857', // emerald-700
      '--progressbar-exp-fill': '#34d399', // emerald-400
      '--progressbar-hp-fill': '#10b981', // emerald-500
    },
    backgroundStyle: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
    previewColor: '#064e3b',
  },
  {
    id: 'pastelPinkDream',
    name: "Sonho Rosa Pastel",
    description: "Um tema suave e encantador em tons de rosa pastel.",
    icon: 'fas fa-heart',
    cost: new Decimal(2000000), 
    cssVariables: {
      ...DEFAULT_CSS_VARIABLES,
      '--bg-primary': '#fdf2f8', 
      '--bg-secondary': '#fce7f3', 
      '--bg-panel-primary': '#fce7f3', 
      '--bg-panel-secondary': '#fdf2f8', 
      '--bg-panel-accent': '#c026d3', 
      '--bg-interactive': '#fbcfe8', 
      '--bg-interactive-hover': '#f9a8d4', 
      '--text-primary': '#9d174d', 
      '--text-secondary': '#831843', 
      '--text-accent': '#db2777', 
      '--text-accent-hover': '#be185d', 
      '--text-emphasized': '#c026d3', 
      '--text-on-button-primary': '#fff1f2', 
      '--border-primary': '#f9a8d4', 
      '--border-secondary': '#fbcfe8', 
      '--border-accent': '#ec4899', 
      '--border-interactive': '#f472b6', 
      '--button-primary-bg': '#ec4899', 
      '--button-primary-hover-bg': '#db2777', 
      '--button-secondary-bg': '#f472b6', 
      '--button-secondary-hover-bg': '#f9a8d4', 
      '--button-disabled-bg': '#fce7f3', 
      '--button-disabled-text': '#fda4af', 
      '--scrollbar-thumb': '#ec4899', 
      '--scrollbar-track': '#fbcfe8', 
      '--focus-ring-color': '#f472b6', 
      '--egg-canvas-border': '#ec4899', 
      '--egg-canvas-shadow': 'rgba(236, 72, 153, 0.4)', 
      '--egg-stage-text-color': '#831843', 
      '--modal-backdrop-color': 'rgba(250, 200, 220, 0.75)',
      '--mission-common-bg': 'rgba(253, 230, 242, 0.8)', 
      '--mission-common-border': '#fbcfe8', 
      '--mission-common-text': '#9d174d',   
      '--mission-common-icon-text': '#be185d', 
      '--mission-rare-bg': 'rgba(249, 168, 212, 0.7)', 
      '--mission-rare-border': '#f472b6', 
      '--mission-rare-text': '#831843',   
      '--mission-rare-icon-text': '#9d174d', 
      '--mission-epic-bg': 'rgba(236, 72, 153, 0.6)', 
      '--mission-epic-border': '#db2777', 
      '--mission-epic-text': '#fff1f2',   
      '--mission-epic-icon-text': '#fdf2f8', 
      '--title-regular-upgrades': '#be185d', 
      '--title-transcendence': '#9d174d', 
      '--title-special-upgrades': '#db2777', 
      '--title-egg-forms': '#c026d3', 
      '--title-active-traits': '#500724', // pink-950
      '--title-active-abilities': '#7f1d1d', 
      '--title-legendary-secret': '#9d174d', 
      '--title-secrets-subheader': '#831843', 
      '--title-achievements': '#be185d', 
      '--title-combat-panel': '#fff1f2', 
      '--title-embryo-panel': '#4c0519', // pink-950 for very dark pink
      '--title-run-stats': '#9d174d', 
      '--title-summary-panel': '#831843', 
      '--title-et-bonuses': '#9d174d', 
      '--title-et-permanent': '#831843', 
      '--title-cosmic-bank': '#9d174d', 
      '--title-crafting-workshop': '#c026d3', 
      '--title-hidden-discoveries': '#db2777', 
      '--title-meta-upgrades': '#f472b6', // pink theme for meta
      '--bg-embryo-panel': '#fbcfe8', // pink-200
      '--border-embryo-panel': '#f9a8d4', // pink-300
      '--progressbar-exp-fill': '#ec4899', // pink-500
      '--progressbar-hp-fill': '#f472b6', // pink-400
    },
    backgroundStyle: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)',
    previewColor: '#f9a8d4', 
  },
  {
    id: 'crimsonRoyalty',
    name: "Realeza Carmesim",
    description: "Um tema majestoso com tons de vermelho profundo e ouro brilhante.",
    icon: 'fas fa-crown',
    cost: new Decimal(2500000), 
    cssVariables: {
      ...DEFAULT_CSS_VARIABLES,
      '--bg-primary': '#450a0a', 
      '--bg-secondary': '#7f1d1d', 
      '--bg-panel-primary': '#7f1d1d', 
      '--bg-panel-secondary': '#991b1b', 
      '--bg-panel-accent': '#78350f', 
      '--bg-interactive': '#fee2e2', 
      '--bg-interactive-hover': '#fecaca', 
      '--text-primary': '#fef3c7', 
      '--text-secondary': '#fde68a', 
      '--text-accent': '#f59e0b', 
      '--text-accent-hover': '#d97706', 
      '--text-emphasized': '#facc15', 
      '--text-on-button-primary': '#fef3c7', 
      '--border-primary': '#b91c1c', 
      '--border-secondary': '#991b1b', 
      '--border-accent': '#f59e0b', 
      '--border-interactive': '#fca5a5', 
      '--button-primary-bg': '#b91c1c', 
      '--button-primary-hover-bg': '#991b1b', 
      '--button-secondary-bg': '#f59e0b', 
      '--button-secondary-hover-bg': '#d97706', 
      '--button-disabled-bg': '#fee2e2', 
      '--button-disabled-text': '#7f1d1d', 
      '--scrollbar-thumb': '#f59e0b', 
      '--scrollbar-track': '#7f1d1d', 
      '--focus-ring-color': '#facc15', 
      '--egg-canvas-border': '#f59e0b', 
      '--egg-canvas-shadow': 'rgba(245, 158, 11, 0.4)', 
      '--egg-stage-text-color': '#fef9c3', 
      '--modal-backdrop-color': 'rgba(50, 0, 0, 0.85)',
      '--mission-common-bg': 'rgba(127, 29, 29, 0.7)', 
      '--mission-common-border': '#991b1b', 
      '--mission-common-text': '#fde68a',   
      '--mission-common-icon-text': '#fef3c7', 
      '--mission-rare-bg': 'rgba(185, 28, 28, 0.6)', 
      '--mission-rare-border': '#b91c1c', 
      '--mission-rare-text': '#fef9c3',   
      '--mission-rare-icon-text': '#fde68a', 
      '--mission-epic-bg': 'rgba(245, 158, 11, 0.5)', 
      '--mission-epic-border': '#d97706', 
      '--mission-epic-text': '#450a0a',   
      '--mission-epic-icon-text': '#7f1d1d', 
      '--title-regular-upgrades': '#fcd34d', 
      '--title-transcendence': '#fde047', 
      '--title-special-upgrades': '#facc15', 
      '--title-egg-forms': '#f59e0b', 
      '--title-active-traits': '#eab308', 
      '--title-active-abilities': '#fef3c7', 
      '--title-legendary-secret': '#fde68a', 
      '--title-secrets-subheader': '#fbbf24', 
      '--title-achievements': '#facc15', 
      '--title-combat-panel': '#fef9c3', 
      '--title-embryo-panel': '#fde047', 
      '--title-run-stats': '#fde68a', 
      '--title-summary-panel': '#fcd34d', 
      '--title-et-bonuses': '#fde047', 
      '--title-et-permanent': '#facc15', 
      '--title-cosmic-bank': '#fde047', 
      '--title-crafting-workshop': '#ca8a04', 
      '--title-hidden-discoveries': '#fcd34d', 
      '--title-meta-upgrades': '#f5b041', // gold/orange for meta
      '--bg-embryo-panel': '#7f1d1d', // red-900
      '--border-embryo-panel': '#991b1b', // red-800
      '--progressbar-exp-fill': '#f59e0b', // amber-500
      '--progressbar-hp-fill': '#ef4444', // red-500
    },
    backgroundStyle: 'radial-gradient(ellipse at center, var(--bg-primary), var(--bg-secondary) 70%)',
    previewColor: '#7f1d1d', 
  },
];

// Placeholder for INITIAL_META_UPGRADES
export const INITIAL_META_UPGRADES: MetaUpgrade[] = [
  {
    id: 'meta_habilidade_forca',
    name: 'Força da Habilidade Aprimorada',
    description: 'Aumenta a força base de todas as habilidades ativas em +2% por nível.',
    cost: new Decimal(500),
    maxLevel: new Decimal(10),
    purchased: new Decimal(0),
    costMultiplier: new Decimal(2),
    icon: 'fas fa-fist-raised',
    category: 'Habilidades',
    effect: { activeAbilityStrengthBonusPerLevel: new Decimal(0.02) },
  },
  {
    id: 'meta_sintoniaFormal',
    name: 'Sintonia Formal Transcendente',
    description: 'Ganha +1 ET adicional por Forma de Ovo ativa ao transcender (por nível).',
    cost: new Decimal(1000),
    maxLevel: new Decimal(5),
    purchased: new Decimal(0),
    costMultiplier: new Decimal(3),
    icon: 'fas fa-link',
    category: 'Formas',
    effect: { etPerActiveFormOnTranscend: new Decimal(1) }
  },
  {
    id: 'meta_chipComumBoost',
    name: 'Ressonador de Chip Comum',
    description: 'Aumenta a eficácia de Chips de Embrião Comuns em +10% por nível.',
    cost: new Decimal(300),
    maxLevel: new Decimal(5),
    purchased: new Decimal(0),
    costMultiplier: new Decimal(1.8),
    icon: 'fas fa-microchip',
    category: 'Chips',
    effect: { chipEffectivenessMultiplier: { rarity: 'Common', multiplier: new Decimal(0.10) } }
  },
  {
    id: 'meta_maestriaTracos',
    name: 'Maestria de Traços Essenciais',
    description: 'Aumenta a eficácia de todos os traços em +5% por nível se 3+ traços estiverem ativos.',
    cost: new Decimal(1200),
    maxLevel: new Decimal(4),
    purchased: new Decimal(0),
    costMultiplier: new Decimal(2.5),
    icon: 'fas fa-brain-circuit',
    category: 'Traços',
    effect: { traitEffectivenessMultiplier: { conditionMinTraits: 3, multiplier: new Decimal(0.05) } }
  },
  {
    id: 'meta_amplificadorPassivoGlobal',
    name: 'Amplificador Passivo Global',
    description: 'Aumenta toda a produção passiva (IPPS) em +1% por nível.',
    cost: new Decimal(2000),
    maxLevel: new Decimal(20),
    purchased: new Decimal(0),
    costMultiplier: new Decimal(1.5),
    icon: 'fas fa-chart-line',
    category: 'Produção',
    effect: { globalIppsMultiplierPerLevel: new Decimal(0.01) }
  }
];
