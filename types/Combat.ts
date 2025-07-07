
import { Decimal } from 'decimal.js';

// ActiveBattleEffect removed as it was specific to AutoBattler.

// AutoBattlerCombatantStats removed. Enemy type will define its own stats.

export interface EnemyStatusEffect {
    type: 'poison' | 'stun' | 'chaos_damage' | 'chaos_heal_player' | 'silence'; // 'silence' for future if enemies get abilities
    durationSeconds: Decimal;
    potency?: Decimal; // e.g., poison damage per tick, stun duration extension
    tickIntervalSeconds?: Decimal; // for DoTs like poison
    lastTickTimestamp?: number; // for DoTs
    appliedByPlayer?: boolean; // To differentiate player-applied poisons for stat scaling
}

export interface Enemy {
    id: string;
    name: string;
    icon: string;
    isBoss?: boolean;
    
    // Effective Combat Stats
    currentHp: Decimal;
    maxHp: Decimal;
    attack: Decimal;
    defense: Decimal;
    speed: Decimal; 
    critChance: Decimal; // 0 to 1
    critDamageMultiplier: Decimal; // e.g., 2 for 2x
    dodgeChance: Decimal; // 0 to 1

    // Base values for scaling, distinct from effective combat stats
    baseAttack: Decimal;
    baseDefense: Decimal;
    baseSpeed: Decimal;
    baseCritChance: Decimal;
    baseCritDamageMultiplier: Decimal;
    baseDodgeChance: Decimal;
    
    // New combat mechanics
    attackIntervalSeconds: Decimal;
    attackTimerSeconds: Decimal;
    activeStatusEffects: EnemyStatusEffect[];
}
