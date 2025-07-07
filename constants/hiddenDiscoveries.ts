
import { Decimal } from 'decimal.js';
import { HiddenDiscoveryDefinition, GameState, EggForm, Trait, SkinDefinition, Achievement } from '../types';
// Removed problematic import: import { ..., SKIN_DEFINITIONS as BASE_SKIN_DEFINITIONS_FROM_MODULES, ... } from '../constants';
import { EGG_FORMS_DATA, TRAITS, ACHIEVEMENTS, EGG_STAGES } from '../constants'; // Keep other necessary constants
import { DEFAULT_CSS_VARIABLES } from '../constants/skins'; // Import DEFAULT_CSS_VARIABLES directly
import { formatNumber, playSound } from '../utils';

// --- Define Secret Rewards ---

export const SECRET_EGG_FORM_SILENT: EggForm = {
  id: 'silentEgg',
  name: 'Ovo Silente',
  description: 'Uma forma de ovo que emana tranquilidade e foco interior.',
  activePassive: 'Bônus Ativo: Aumenta o ganho de Essência Transcendente em +10%.',
  collectionBonusDescription: 'Bônus de Coleção: +0.5% PI Global.',
  unlockCondition: 'Descoberto através da Ascensão Silenciosa.',
  stageRequired: 0, // No stage requirement for unlocking, but for display/activation if needed
  icon: 'fas fa-moon', // Example icon
  activeBonus: { bonusETMultiplier: new Decimal(1.1) },
  collectionBonus: { incubationPowerMultiplier: new Decimal(1.005) },
  isLegendary: false, // Or true if it's very special
};

export const SECRET_TRAIT_AUTOPHAGY: Trait = {
  id: 'autophagyTrait',
  name: 'Autofagia',
  description: 'Converte a dor do embrião em poder. Aumenta PI/S em +0.05% para cada 1% de HP faltando no Embrião (máx +5% PI/S).',
  effect: { ippsBonusPerMissingHpPercent: new Decimal(0.0005), maxIppsBonusFromAutophagy: new Decimal(0.05) },
  icon: 'fas fa-heart-broken', // Example icon
};

export const SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER: Achievement = {
    id: 'attributeMasterAch',
    name: 'Mestre dos Atributos',
    description: 'Você dominou a arte de equilibrar diversos traços em sua jornada.',
    bonusDescription: 'Concede +10 Essência Transcendente ao ser descoberto.',
    icon: 'fas fa-medal', // Example icon
    condition: (gs) => false, // Condition managed by discovery system
    unlocked: false,
    bonus: { etGainAdditive: new Decimal(10) } // ET gain is handled by discovery reward function
};

// SECRET_SKIN_PRISMATIC_SHELL was removed


// --- Hidden Discovery Definitions ---

export const INITIAL_HIDDEN_DISCOVERY_DEFINITIONS: HiddenDiscoveryDefinition[] = [
  {
    id: 'silentAscension',
    defaultName: '???',
    defaultDescription: 'Desconhecido',
    defaultIcon: 'fas fa-question-circle',
    revealedName: 'Ascensão Silenciosa',
    revealedDescription: 'Você transcendeu sem tocar. A verdadeira forma do silêncio desperta.',
    revealedIcon: SECRET_EGG_FORM_SILENT.icon,
    triggerCondition: (gs) => gs.justTranscended && gs.totalClicksThisRun.isZero(), // Updated condition
    rewardEffect: (gs, setGs, showMessage) => {
      if (!gs.unlockedEggForms.includes(SECRET_EGG_FORM_SILENT.id)) {
        setGs(prev => ({
          ...prev,
          unlockedEggForms: [...new Set([...prev.unlockedEggForms, SECRET_EGG_FORM_SILENT.id])]
        }));
        // showMessage is now called by useHiddenDiscoveries hook upon discovery
      }
    },
  },
  {
    id: 'sacrificialCore',
    defaultName: '???',
    defaultDescription: 'Desconhecido',
    defaultIcon: 'fas fa-question-circle',
    revealedName: 'Coração que Sangra',
    revealedDescription: 'O núcleo aceita a dor como combustível.',
    revealedIcon: SECRET_TRAIT_AUTOPHAGY.icon,
    triggerCondition: (gs) => gs.totalClicksThisRun.gte(100), // Changed condition
    rewardEffect: (gs, setGs, showMessage) => {
      if (!gs.unlockedTraits.includes(SECRET_TRAIT_AUTOPHAGY.id)) {
        setGs(prev => ({
          ...prev,
          unlockedTraits: [...new Set([...prev.unlockedTraits, SECRET_TRAIT_AUTOPHAGY.id])]
        }));
        // showMessage is now called by useHiddenDiscoveries hook
      }
    },
  },
  {
    id: 'xpHoarder',
    defaultName: '???',
    defaultDescription: 'Desconhecido',
    defaultIcon: 'fas fa-question-circle',
    revealedName: 'O Ovo Não Rompido',
    revealedDescription: 'Contenção é uma forma de força. Você ganhou o buff passivo "Reservatório Psíquico": +5% de ganho de EXP Modular.',
    revealedIcon: 'fas fa-brain', // Example icon
    triggerCondition: (gs) => gs.modularEXP.gt(1000000) && !gs.spentModularEXPThisRun,
    rewardEffect: (gs, setGs, showMessage) => {
      setGs(prev => ({ ...prev, reservatorioPsiquicoActive: true }));
      // showMessage for buff activation is handled by useHiddenDiscoveries if needed, or here
      showMessage('Buff Passivo "Reservatório Psíquico" ativado permanentemente!', 3000);
    },
  },
  {
    id: 'perfectRun', // Renamed for clarity
    defaultName: '???',
    defaultDescription: 'Desconhecido',
    defaultIcon: 'fas fa-question-circle',
    revealedName: 'Corrida Imaculada',
    revealedDescription: 'Você alcançou a transcendência sem melhorias regulares ou dano ao embrião. Sua capacidade de traços aumentou.',
    revealedIcon: 'fas fa-shield-alt',
    triggerCondition: (gs) => 
        gs.justTranscended && // Check for transcendence event
        gs.currentStageIndex >= EGG_STAGES.findIndex(s => s.name === 'Ovo Transcendente') && 
        !gs.hasPurchasedRegularUpgradeThisRun &&
        !gs.embryoTookDamageThisRun, 
    rewardEffect: (gs, setGs, showMessage) => {
      setGs(prev => ({ ...prev, maxActiveTraits: prev.maxActiveTraits + 1 }));
      showMessage('Limite máximo de Traços Ativos aumentado em +1!', 3000);
    },
  },
  {
    id: 'traitMaster', // Renamed for clarity
    defaultName: '???',
    defaultDescription: 'Desconhecido',
    defaultIcon: 'fas fa-question-circle',
    revealedName: 'Harmonia Interior',
    revealedDescription: 'Dominar múltiplos traços revelou uma nova harmonia. Você ganhou +10 ET e uma conquista secreta.',
    revealedIcon: SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER.icon,
    triggerCondition: (gs) => gs.justTranscended && gs.activeTraits.length >= 4, // Updated condition
    rewardEffect: (gs, setGs, showMessage) => {
      let newUnlockedAchievements = gs.unlockedAchievements;
      if (!gs.unlockedAchievements.includes(SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER.id)) {
        newUnlockedAchievements = [...new Set([...gs.unlockedAchievements, SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER.id])];
      }
      setGs(prev => ({
        ...prev,
        transcendentEssence: prev.transcendentEssence.plus(10),
        unlockedAchievements: newUnlockedAchievements,
        achievementsData: prev.achievementsData.map(ach => 
            ach.id === SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER.id ? {...ach, unlocked: true} : ach
        ),
      }));
      showMessage('+10 Essência Transcendente ganha!', 2000);
    },
  },
  // eggFormCollectorAll (Prisma de Formas) was removed
];
