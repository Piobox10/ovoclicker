
import { Decimal } from 'decimal.js';
import { MissionDefinition, MissionRarity, MissionReward, DailyMission, ActiveTemporaryBuffState } from '../types';

// Helper to create a unique ID for a mission instance
const createMissionInstanceId = (defId: string, rarity: MissionRarity, dateSeed: string, index: number): string => {
  return `${defId}_${rarity.toLowerCase()}_${dateSeed.replace(/\//g, '-')}_${index}`;
};

// --- Mission Reward Temporary Buff Definitions ---
export const MISSION_REWARD_BUFFS: { [key: string]: Omit<ActiveTemporaryBuffState, 'remainingDuration' | 'source'> } = {
  modExpBoost_small: {
    id: 'missionBuff_modExp_S',
    name: 'Impulso de EXP Modular (P)',
    description: '+25% Ganho de EXP Modular por 5 minutos.',
    icon: 'fas fa-angle-double-up',
    effect: { modularExpGainMultiplierBonus: new Decimal(0.25) }, 
  },
  clickPowerBoost_medium: {
    id: 'missionBuff_clickPower_M',
    name: 'Toque Fortalecido (M)',
    description: '+100% PI/Clique por 10 minutos.',
    icon: 'fas fa-hand-sparkles',
    effect: { clicksPerClickMultiplierBonus: new Decimal(1.00) }, 
  },
  ippsBoost_epic: {
    id: 'missionBuff_ipps_E',
    name: 'Fluxo Cósmico Aprimorado (E)',
    description: '+75% PI/Segundo por 15 minutos.',
    icon: 'fas fa-tachometer-alt-fast',
    effect: { ippsMultiplierBonus: new Decimal(0.75) }, 
  }
};

export const MISSION_RARITY_COLORS: { [key in MissionRarity]: { text: string, border: string, bg: string, iconText?: string } } = {
  'Common': { text: 'text-slate-300', border: 'border-slate-500', bg: 'bg-slate-700/50', iconText: 'text-slate-400' },
  'Rare': { text: 'text-sky-400', border: 'border-sky-600', bg: 'bg-sky-800/50', iconText: 'text-sky-300' },
  'Epic': { text: 'text-purple-400', border: 'border-purple-600', bg: 'bg-purple-800/50', iconText: 'text-purple-300' },
};


// --- Mission Definitions ---
export const MISSION_DEFINITIONS: MissionDefinition[] = [
  {
    definitionId: 'click_times_run',
    metricToTrack: 'userClicks_thisRun', 
    baseIcon: 'fas fa-hand-pointer',
    possibleRarities: ['Common', 'Rare'],
    generateDetails: (rarity) => {
      let targetValue: Decimal;
      let reward: MissionReward;
      let description: string;

      switch (rarity) {
        case 'Common':
          targetValue = new Decimal(300);
          reward = { type: 'modularEXP', value: new Decimal(50), description: '+50 EXP Mod.' };
          description = `Clique no Ovo ${targetValue.toString()} vezes nesta rodada.`;
          break;
        case 'Rare':
        default: 
          targetValue = new Decimal(1000);
          reward = { type: 'modularEXP', value: new Decimal(200), description: '+200 EXP Mod.' };
          description = `Clique no Ovo ${targetValue.toString()} vezes nesta rodada.`;
          break;
      }
      return { description, targetValue, reward };
    },
  },
  {
    definitionId: 'spend_mod_exp',
    metricToTrack: 'modularEXPSpent_thisRun',
    baseIcon: 'fas fa-shopping-cart',
    possibleRarities: ['Common', 'Rare', 'Epic'],
    generateDetails: (rarity) => {
      let targetValue: Decimal;
      let reward: MissionReward;
      let description: string;

      switch (rarity) {
        case 'Common':
          targetValue = new Decimal(500);
          reward = { type: 'modularEXP', value: new Decimal(100), description: '+100 EXP Mod.' };
          description = `Gaste ${targetValue.toString()} EXP Modular.`;
          break;
        case 'Rare':
          targetValue = new Decimal(2000);
          reward = { 
            type: 'temporaryBuff', 
            buffId: MISSION_REWARD_BUFFS.modExpBoost_small.id, 
            value: new Decimal(1), 
            buffDuration: new Decimal(300), 
            description: MISSION_REWARD_BUFFS.modExpBoost_small.description
          };
          description = `Gaste ${targetValue.toString()} EXP Modular.`;
          break;
        case 'Epic':
        default:
          targetValue = new Decimal(5000);
          reward = { type: 'modularEXP', value: new Decimal(750), description: '+750 EXP Mod.' };
          description = `Gaste ${targetValue.toString()} EXP Modular.`;
          break;
      }
      return { description, targetValue, reward };
    },
  },
  {
    definitionId: 'activate_ability_times',
    metricToTrack: 'abilityActivated_any_thisRun',
    baseIcon: 'fas fa-bolt',
    possibleRarities: ['Common', 'Rare'],
    generateDetails: (rarity) => {
      let targetValue: Decimal;
      let reward: MissionReward;
      let description: string;

      switch (rarity) {
        case 'Common':
          targetValue = new Decimal(3);
          reward = { type: 'modularEXP', value: new Decimal(75), description: '+75 EXP Mod.' };
          description = `Ative uma habilidade ${targetValue.toString()} vezes.`;
          break;
        case 'Rare':
        default:
          targetValue = new Decimal(7);
           reward = { 
            type: 'temporaryBuff', 
            buffId: MISSION_REWARD_BUFFS.clickPowerBoost_medium.id, 
            value: new Decimal(1), 
            buffDuration: new Decimal(600), 
            description: MISSION_REWARD_BUFFS.clickPowerBoost_medium.description
          };
          description = `Ative uma habilidade ${targetValue.toString()} vezes.`;
          break;
      }
      return { description, targetValue, reward };
    },
  },
  {
    definitionId: 'transcend_count',
    metricToTrack: 'transcendenceCompleted_thisRun', 
    baseIcon: 'fas fa-infinity',
    possibleRarities: ['Epic'], 
    generateDetails: (rarity) => { 
      const targetValue = new Decimal(1);
      const reward: MissionReward = { 
        type: 'temporaryBuff', 
        buffId: MISSION_REWARD_BUFFS.ippsBoost_epic.id, 
        value: new Decimal(1),
        buffDuration: new Decimal(900), 
        description: MISSION_REWARD_BUFFS.ippsBoost_epic.description
      };
      const description = `Transcenda pelo menos ${targetValue.toString()} vez hoje.`;
      return { description, targetValue, reward };
    },
  },
  {
    definitionId: 'defeat_enemies_embryo',
    metricToTrack: 'enemiesDefeatedWithEmbryo_thisRun', 
    baseIcon: 'fas fa-dna',
    possibleRarities: ['Common', 'Rare'],
    generateDetails: (rarity) => {
      let targetValue: Decimal;
      let reward: MissionReward;
      let description: string;
      switch (rarity) {
        case 'Common':
          targetValue = new Decimal(10);
          reward = { type: 'modularEXP', value: new Decimal(100), description: '+100 EXP Mod.'};
          description = `Derrote ${targetValue.toString()} inimigos com o Embrião.`;
          break;
        case 'Rare':
        default:
          targetValue = new Decimal(25);
          reward = { type: 'modularEXP', value: new Decimal(300), description: '+300 EXP Mod.'};
          description = `Derrote ${targetValue.toString()} inimigos com o Embrião.`;
          break;
      }
      return { description, targetValue, reward };
    }
  },
  {
    definitionId: 'craft_items_X_times',
    metricToTrack: 'itemsCrafted_thisRun',
    baseIcon: 'fas fa-tools',
    possibleRarities: ['Common', 'Rare', 'Epic'],
    generateDetails: (rarity) => {
      let targetValue: Decimal;
      let reward: MissionReward;
      let description: string;
      switch (rarity) {
        case 'Common':
          targetValue = new Decimal(1);
          reward = { type: 'modularEXP', value: new Decimal(150), description: '+150 EXP Mod.' };
          description = `Crie ${targetValue.toString()} item na Oficina.`;
          break;
        case 'Rare':
          targetValue = new Decimal(3);
          reward = { type: 'modularEXP', value: new Decimal(500), description: '+500 EXP Mod.' };
          description = `Crie ${targetValue.toString()} itens na Oficina.`;
          break;
        case 'Epic':
        default:
          targetValue = new Decimal(5);
          reward = { 
            type: 'temporaryBuff', 
            buffId: MISSION_REWARD_BUFFS.modExpBoost_small.id, // Example, can be a new crafting-related buff
            value: new Decimal(1), 
            buffDuration: new Decimal(600), // 10 minutes
            description: `${MISSION_REWARD_BUFFS.modExpBoost_small.description} (Recompensa de Criação Épica)`
          };
          description = `Crie ${targetValue.toString()} itens na Oficina.`;
          break;
      }
      return { description, targetValue, reward };
    },
  }
];
