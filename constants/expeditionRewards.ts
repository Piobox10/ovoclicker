import { Decimal } from 'decimal.js';
import { GameState, ExpeditionRewardOption, BattleEgg } from '../types';

type SetGameStateFunction = React.Dispatch<React.SetStateAction<GameState>>;

// --- Reward Pool Definition ---
export const EXPEDITION_REWARD_POOL: ExpeditionRewardOption[] = [
  // Comum
  {
    id: 'resonant_shell',
    name: "Concha Ressonante",
    description: "Todos os ovos da sua equipe recebem +5% de HP Máximo para o resto da expedição.",
    type: "buff passivo",
    rarity: "comum",
    icon: "fas fa-shield-heart text-green-300",
    apply: (gameState: GameState) => {
      const newTeam = gameState.eggTeamBattleState.playerTeam.map(egg => {
        const hpBoost = egg.maxHp.times(0.05).floor();
        return {
          ...egg,
          maxHp: egg.maxHp.plus(hpBoost),
          currentHp: egg.currentHp.plus(hpBoost)
        };
      });
      return {
        ...gameState,
        eggTeamBattleState: { ...gameState.eggTeamBattleState, playerTeam: newTeam }
      };
    }
  },
  {
    id: 'stable_crack',
    name: "Rachadura Estável",
    description: "Todos os ovos recebem +10% de defesa, mas -5% de dano.",
    type: "buff defensivo",
    rarity: "comum",
    icon: "fas fa-shield text-gray-400",
    apply: (gameState: GameState) => {
      const newTeam = gameState.eggTeamBattleState.playerTeam.map(egg => ({
        ...egg,
        currentDefense: egg.currentDefense.times(1.10),
        currentAttack: egg.currentAttack.times(0.95)
      }));
      return {
        ...gameState,
        eggTeamBattleState: { ...gameState.eggTeamBattleState, playerTeam: newTeam }
      };
    }
  },

  // Incomum
  {
    id: 'split_shell',
    name: "Casca Fendida",
    description: "Aumenta o dano de todos os ovos em +20%, mas todos perdem -10% de defesa.",
    type: "modificador",
    rarity: "incomum",
    icon: "fas fa-bolt text-yellow-400",
    apply: (gameState: GameState) => {
      const newTeam = gameState.eggTeamBattleState.playerTeam.map(egg => ({
        ...egg,
        currentAttack: egg.currentAttack.times(1.20),
        currentDefense: egg.currentDefense.times(0.90)
      }));
      return {
        ...gameState,
        eggTeamBattleState: { ...gameState.eggTeamBattleState, playerTeam: newTeam }
      };
    }
  },
  {
    id: 'living_spores',
    name: "Esporos Vivos",
    description: "Inimigos derrotados causam 5 de dano a todos os inimigos adjacentes.",
    type: "efeito ofensivo",
    rarity: "incomum",
    icon: "fas fa-biohazard text-lime-400",
    apply: (gameState: GameState) => {
      // This is a passive effect. We'll add a buff to the state that the battle system can check.
      const newBuff = { id: 'living_spores_passive', name: 'Esporos Vivos', description: 'Inimigos derrotados causam dano em área.', icon: 'fas fa-biohazard', remainingDuration: new Decimal(99), effect: {}, source: 'expedition_choice' as const };
      return { ...gameState, eggTeamBattleState: { ...gameState.eggTeamBattleState, expeditionTeamBuffs: [...gameState.eggTeamBattleState.expeditionTeamBuffs, newBuff] }};
    }
  },

  // Raro
  {
    id: 'strategic_focus',
    name: "Foco Estratégico",
    description: "Se houver 2 ou menos ovos na equipe, ambos ganham +15% de velocidade e +10% de dano.",
    type: "condicional",
    rarity: "raro",
    icon: "fas fa-users-viewfinder text-sky-400",
    apply: (gameState: GameState) => {
        if (gameState.eggTeamBattleState.playerTeam.filter(e => e.currentHp.gt(0)).length <= 2) {
            const newTeam = gameState.eggTeamBattleState.playerTeam.map(egg => ({
                ...egg,
                currentSpeed: egg.currentSpeed.times(1.15),
                currentAttack: egg.currentAttack.times(1.10)
            }));
            return { ...gameState, eggTeamBattleState: { ...gameState.eggTeamBattleState, playerTeam: newTeam }};
        }
        return gameState; // No effect if condition not met
    }
  },
  {
    id: 'corruption_ritual',
    name: "Ritual de Corrupção",
    description: "Escolha um ovo da equipe para se corromper: ganha +40% dano, mas recebe o dobro de dano.",
    type: "escolha dramática",
    rarity: "raro",
    icon: "fas fa-skull-crossbones text-purple-400",
    apply: (gameState: GameState, targetEggId?: string) => {
        if (!targetEggId) return gameState; // Should not happen with the new logic
        const newTeam = gameState.eggTeamBattleState.playerTeam.map(egg => {
            if (egg.instanceId === targetEggId) {
                const newBuff = { instanceId: `corruption-debuff-${Date.now()}`, definitionId: 'se_custom_corruption_vulnerability', name: 'Corrompido', icon: 'fas fa-skull text-red-500', description: 'Recebe dano dobrado.', type: 'debuff' as const, effectType: 'stat_change_multiply' as const, remainingDurationTurns: 99, currentPotency: new Decimal(2), statToChange: 'incomingDamageMultiplier' as const };
                return {
                    ...egg,
                    currentAttack: egg.currentAttack.times(1.40),
                    statusEffects: [...egg.statusEffects, newBuff]
                };
            }
            return egg;
        });
        return { ...gameState, eggTeamBattleState: { ...gameState.eggTeamBattleState, playerTeam: newTeam }};
    }
  },

  // Épico
  {
    id: 'condensed_energy',
    name: "Casulo de Energia Condensada",
    description: "Começa cada combate com +10 de recurso para habilidades (por ovo).",
    type: "buff de abertura",
    rarity: "épico",
    icon: "fas fa-battery-full text-blue-300",
    apply: (gameState: GameState) => {
       const newBuff = { id: 'condensed_energy_passive', name: 'Energia Condensada', description: '+10 recurso no início de cada combate.', icon: 'fas fa-battery-full', remainingDuration: new Decimal(99), effect: {}, source: 'expedition_choice' as const };
       return { ...gameState, eggTeamBattleState: { ...gameState.eggTeamBattleState, expeditionTeamBuffs: [...gameState.eggTeamBattleState.expeditionTeamBuffs, newBuff] }};
    }
  },

  // Lendário
  {
    id: 'symbiotic_bond',
    name: "Vínculo Simbiótico",
    description: "Sempre que um ovo usa uma habilidade, outro aliado aleatório recupera 5% de HP.",
    type: "buff reativo",
    rarity: "lendário",
    icon: "fas fa-hand-holding-heart text-pink-400",
    apply: (gameState: GameState) => {
       const newBuff = { id: 'symbiotic_bond_passive', name: 'Vínculo Simbiótico', description: 'Cura aliados ao usar habilidades.', icon: 'fas fa-hand-holding-heart', remainingDuration: new Decimal(99), effect: {}, source: 'expedition_choice' as const };
       return { ...gameState, eggTeamBattleState: { ...gameState.eggTeamBattleState, expeditionTeamBuffs: [...gameState.eggTeamBattleState.expeditionTeamBuffs, newBuff] }};
    }
  }
];
