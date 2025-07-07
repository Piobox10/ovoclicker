import { Decimal } from 'decimal.js';
import { AbilityDefinition } from '../types';

export const ABILITY_DEFINITIONS: AbilityDefinition[] = [
  // --- Generic Abilities ---
  {
    id: 'ab_basic_attack',
    name: 'Ataque Básico',
    description: 'Um ataque físico simples que causa dano menor.',
    icon: 'fas fa-fist-raised',
    targetType: 'single_enemy',
    effects: [{ type: 'damage', baseValue: new Decimal(10) }],
    resourceCost: new Decimal(0),
    cooldownTurns: 0,
  },
  {
    id: 'ab_strong_hit',
    name: 'Golpe Forte',
    description: 'Um ataque físico concentrado que causa dano moderado.',
    icon: 'fas fa-hammer',
    targetType: 'single_enemy',
    effects: [{ type: 'damage', baseValue: new Decimal(25) }],
    resourceCost: new Decimal(10),
    cooldownTurns: 1,
  },
  {
    id: 'ab_minor_heal',
    name: 'Cura Menor',
    description: 'Restaura uma pequena quantidade de HP a um aliado.',
    icon: 'fas fa-heart',
    targetType: 'single_ally',
    effects: [{ type: 'heal', baseValue: new Decimal(20) }],
    resourceCost: new Decimal(15),
    cooldownTurns: 2,
  },
  {
    id: 'ab_team_heal_small',
    name: 'Cura em Grupo (P)',
    description: 'Restaura uma pequena quantidade de HP a todos os aliados.',
    icon: 'fas fa-users-medical',
    targetType: 'all_allies',
    effects: [{ type: 'heal', baseValue: new Decimal(15) }],
    resourceCost: new Decimal(30),
    cooldownTurns: 3,
  },

  // --- Draconic Egg Abilities ---
  {
    id: 'ab_draconic_fireball',
    name: 'Bola de Fogo Dracônica',
    description: 'Lança uma bola de fogo que causa dano e pode aplicar Queimadura.',
    icon: 'fas fa-fire-alt',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(18) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_burn_dot_minor', chance: new Decimal(0.75) }
    ],
    resourceCost: new Decimal(20),
    cooldownTurns: 2,
  },
  {
    id: 'ab_draconic_tail_sweep',
    name: 'Varredura de Cauda',
    description: 'Atinge todos os inimigos com a cauda, causando dano e reduzindo sua defesa.',
    icon: 'fas fa-wind',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(12) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_defense_debuff_minor' }
    ],
    resourceCost: new Decimal(25),
    cooldownTurns: 3,
  },

  // --- Void Egg Abilities ---
  {
    id: 'ab_void_mind_blast',
    name: 'Explosão Mental do Vazio',
    description: 'Ataca a mente de um inimigo, causando dano e potencialmente Atordoando.',
    icon: 'fas fa-brain',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(15) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_stun_short', chance: new Decimal(0.4) }
    ],
    resourceCost: new Decimal(22),
    cooldownTurns: 3,
  },
  {
    id: 'ab_void_energy_siphon',
    name: 'Sifão de Energia do Vazio',
    description: 'Drena uma pequena quantidade de recurso do inimigo.',
    icon: 'fas fa-atom',
    targetType: 'single_enemy',
    effects: [
      { type: 'resource_drain_flat', baseValue: new Decimal(10) },
      { type: 'damage', baseValue: new Decimal(5) } 
    ],
    resourceCost: new Decimal(10),
    cooldownTurns: 2,
  },

  // --- Rock Egg Abilities ---
  {
    id: 'ab_rock_harden_shell',
    name: 'Endurecer Casca Rochosa',
    description: 'Aumenta significativamente a própria defesa por alguns turnos.',
    icon: 'fas fa-shield-alt',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_major' }],
    resourceCost: new Decimal(15),
    cooldownTurns: 4,
  },
  {
    id: 'ab_rock_quake_stomp',
    name: 'Pisada Sísmica',
    description: 'Causa dano a todos os inimigos e pode reduzir sua velocidade.',
    icon: 'fas fa-shoe-prints',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_speed_debuff_minor', chance: new Decimal(0.6) }
    ],
    resourceCost: new Decimal(28),
    cooldownTurns: 3,
  },

  // --- Fungal Egg Abilities ---
  {
    id: 'ab_fungal_paralyzing_spores',
    name: 'Esporos Paralizantes',
    description: 'Libera uma nuvem de esporos que podem impedir o inimigo de agir.',
    icon: 'fas fa-lungs-virus',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(8) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_rooted_ability_lock', chance: new Decimal(0.40) }
    ],
    resourceCost: new Decimal(18), 
    cooldownTurns: 3,
  },
  {
    id: 'ab_fungal_mycelial_infestation',
    name: 'Infestação Micelial',
    description: 'Infecta um inimigo com esporos persistentes que causam dano ao longo do tempo e drenam recurso.',
    icon: 'fas fa-bacterium',
    targetType: 'single_enemy',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_infested_dot' },
      { type: 'resource_drain_flat', baseValue: new Decimal(5) } 
    ],
    resourceCost: new Decimal(25), 
    cooldownTurns: 3,
  },

  // --- Blades Egg Abilities ---
  {
    id: 'ab_blades_quick_cut',
    name: 'Corte Rápido',
    description: 'Um corte veloz que atinge antes da maioria das ações.',
    icon: 'fas fa-bolt-lightning', 
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(12) }, 
      { type: 'apply_status', statusEffectDefinitionId: 'se_bleeding_dot', chance: new Decimal(0.30) }
    ],
    resourceCost: new Decimal(15), 
    cooldownTurns: 2,
  },
  {
    id: 'ab_blades_unstable_blade',
    name: 'Lâmina Instável',
    description: 'Um golpe descontrolado que causa dano enorme... mas pode machucar o usuário.',
    icon: 'fas fa-burst', 
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(35) },
      { type: 'self_damage', baseValue: new Decimal(5) }
    ],
    resourceCost: new Decimal(30), 
    cooldownTurns: 4,
  },

  // --- Necrotic Egg Abilities ---
  {
    id: 'ab_necrotic_entropy_touch',
    name: 'Toque da Entropia',
    description: 'Um ataque que consome a essência vital do inimigo e o deixa enfraquecido.',
    icon: 'fas fa-hand-holding-skull', 
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(20) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_weakened_attack_debuff' }
    ],
    resourceCost: new Decimal(22), 
    cooldownTurns: 3,
  },
  {
    id: 'ab_necrotic_evoke_ghoul',
    name: 'Evocar Carniçal',
    description: 'Cria um carniçal temporário que causa dano automaticamente por 2 turnos.',
    icon: 'fas fa-ghost',
    targetType: 'self', 
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_ghoul_presence_caster_buff' }],
    resourceCost: new Decimal(40), 
    cooldownTurns: 5,
  },

  // --- Floral Egg Abilities ---
  {
    id: 'ab_floral_pollen_rain',
    name: 'Chuva de Pólen',
    description: 'Espalha pólen curativo sobre todos os aliados, removendo um debuff.',
    icon: 'fas fa-seedling',
    targetType: 'all_allies',
    effects: [
      { type: 'heal', baseValue: new Decimal(18) },
      { type: 'cleanse_debuffs', cleanseCount: 1 }
    ],
    resourceCost: new Decimal(28), 
    cooldownTurns: 3,
  },
  {
    id: 'ab_floral_protective_roots',
    name: 'Raízes Protetoras',
    description: 'Invoca raízes que protegem um aliado, absorvendo dano.',
    icon: 'fas fa-shield-heart', 
    targetType: 'single_ally',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_sap_barrier_shield' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_minor', chance: new Decimal(0.50) }
    ],
    resourceCost: new Decimal(25), 
    cooldownTurns: 3,
  },

  // --- Glacial Egg Abilities ---
  {
    id: 'ab_glacial_freezing_frost',
    name: 'Geada Congelante',
    description: 'Ataca todos os inimigos com uma onda de frio intenso.',
    icon: 'fas fa-snowflake',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_frozen_stun', chance: new Decimal(0.40) }
    ],
    resourceCost: new Decimal(25), 
    cooldownTurns: 4,
  },
  {
    id: 'ab_glacial_ice_wall',
    name: 'Muralha de Gelo',
    description: 'Cria uma barreira de gelo que reduz o dano recebido por todos os aliados e aumenta sua defesa.',
    icon: 'fas fa-igloo',
    targetType: 'all_allies',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_team_damage_reduction_buff' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_minor' }
    ],
    resourceCost: new Decimal(30), 
    cooldownTurns: 5,
  },

  // --- Mirrored Egg Abilities ---
  {
    id: 'ab_mirrored_instinctive_reflection',
    name: 'Reflexo Instintivo',
    description: 'Copia o último buff ou debuff aplicado em campo e reflete no alvo oposto.',
    icon: 'fas fa-circle-half-stroke', 
    targetType: 'custom_logic', // Target decided by game logic based on last status
    effects: [
      { type: 'custom_logic', customEffectId: 'instinctive_reflection' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_disoriented_accuracy_debuff', chance: new Decimal(1) } // Applied to an enemy based on logic
    ],
    resourceCost: new Decimal(25), // Reflexo
    cooldownTurns: 4,
  },
  {
    id: 'ab_mirrored_energy_mirror',
    name: 'Espelho de Energia',
    description: 'Cria um escudo mágico que reflete parte do dano recebido de volta ao atacante.',
    icon: 'fas fa-magic', // Generic magic icon
    targetType: 'self',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_energy_mirror_reflect_buff' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_minor' }
    ],
    resourceCost: new Decimal(20), // Reflexo
    cooldownTurns: 3,
  },

  // --- Volcanic Egg Abilities ---
  {
    id: 'ab_volcanic_eruption',
    name: 'Erupção Ardente',
    description: 'Detona magma em área, causando dano brutal a todos os inimigos.',
    icon: 'fas fa-volcano',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(22) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_burn_dot_medium' }
    ],
    resourceCost: new Decimal(35), // Magma
    cooldownTurns: 4,
  },
  {
    id: 'ab_volcanic_magma_fissure',
    name: 'Fenda Magmática',
    description: 'Ataca um inimigo com um jato de magma concentrado.',
    icon: 'fas fa-fire-smoke',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(30) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_stun_short', chance: new Decimal(0.60) }
    ],
    resourceCost: new Decimal(28), // Magma
    cooldownTurns: 3,
  },

  // --- Illusory Egg Abilities ---
  {
    id: 'ab_illusory_visual_distortion',
    name: 'Distorção Visual',
    description: 'Dificulta a mira do inimigo, reduzindo drasticamente sua precisão.',
    icon: 'fas fa-eye-slash',
    targetType: 'single_enemy',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_blurred_vision_accuracy_debuff' },
      // Cleanse accuracy buffs could be added as another effect or handled in logic
    ],
    resourceCost: new Decimal(20), // Névoa
    cooldownTurns: 2,
  },
  {
    id: 'ab_illusory_image_refraction',
    name: 'Refração de Imagem',
    description: 'O ovo se duplica ilusoriamente, aumentando esquiva por tempo limitado e refletindo dano.',
    icon: 'fas fa-clone',
    targetType: 'self',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_evasion_buff_major' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_energy_mirror_reflect_buff', reflectionPercentage: new Decimal(0.10) } // Apply a weaker reflect
    ],
    resourceCost: new Decimal(30), // Névoa
    cooldownTurns: 4,
  },

  // --- Radioactive Egg Abilities ---
  {
    id: 'ab_radioactive_toxic_pulse',
    name: 'Pulso Tóxico',
    description: 'Emite um pulso que infecta todos os inimigos com dano residual e reduz seu ataque.',
    icon: 'fas fa-biohazard',
    targetType: 'all_enemies',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_radiated_dot_resource_degen' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_attack_debuff_minor' }
    ],
    resourceCost: new Decimal(28), // Radiação
    cooldownTurns: 3,
  },
  {
    id: 'ab_radioactive_unstable_fusion',
    name: 'Fusão Instável',
    description: 'Libera uma onda de radiação que consome a si mesmo, causando grande dano.',
    icon: 'fas fa-atom-simple', // Simpler atom
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(35) },
      { type: 'modify_max_hp', maxHpReductionPercentage: new Decimal(0.10) } // Reduce self max HP by 10%
    ],
    resourceCost: new Decimal(35), // Radiação
    cooldownTurns: 4,
  },

  // --- Nocturnal Egg Abilities ---
  {
    id: 'ab_nocturnal_binding_shadow',
    name: 'Sombra Vinculante',
    description: 'Liga o inimigo com sombras vivas, impedindo movimentação rápida e silenciando.',
    icon: 'fas fa-link-slash', // Broken link
    targetType: 'single_enemy',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_speed_debuff_major' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_silence_ability_lock', chance: new Decimal(0.40) }
    ],
    resourceCost: new Decimal(25), // Trevas
    cooldownTurns: 3,
  },
  {
    id: 'ab_nocturnal_twilight_flight',
    name: 'Voo Crepuscular',
    description: 'Esquiva do próximo ataque e se reposiciona, ganhando prioridade no próximo turno.',
    icon: 'fas fa-bat', // Bat icon
    targetType: 'self',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_guaranteed_evasion_buff' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_initiative_plus_buff' }
    ],
    resourceCost: new Decimal(20), // Trevas
    cooldownTurns: 4,
  },

  // --- Common New Egg Abilities ---
  {
    id: 'ab_gravel_rolling_impact',
    name: 'Impacto Rolante',
    description: 'Causa 14 de dano e tem 30% de chance de empurrar o inimigo para o final da fila de turnos.',
    icon: 'fas fa-bowling-ball',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(14) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_delay_turn_short', chance: new Decimal(0.30) }
    ],
    resourceCost: new Decimal(18), // Vigor
    cooldownTurns: 2,
  },
  {
    id: 'ab_gravel_rustic_fortification',
    name: 'Fortificação Rústica',
    description: 'Aumenta a própria defesa em 25% por 2 turnos.',
    icon: 'fas fa-shield-virus',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_25_2t' }],
    resourceCost: new Decimal(15), // Vigor
    cooldownTurns: 3,
  },
  {
    id: 'ab_sprout_healing_dew',
    name: 'Orvalho Curativo',
    description: 'Restaura 15 de HP a um aliado.',
    icon: 'fas fa-hand-holding-droplet',
    targetType: 'single_ally',
    effects: [{ type: 'heal', baseValue: new Decimal(15) }],
    resourceCost: new Decimal(12), // Seiva
    cooldownTurns: 1,
  },
  {
    id: 'ab_sprout_invigorating_seed',
    name: 'Semente Revigorante',
    description: 'Concede 10 de recurso a um aliado com recurso abaixo de 50%.',
    icon: 'fas fa-seedling',
    targetType: 'single_ally',
    effects: [{ type: 'custom_logic', customEffectId: 'grant_resource_conditional', baseValue: new Decimal(10) }], // baseValue for resource amount
    resourceCost: new Decimal(20), // Seiva
    cooldownTurns: 3,
  },
  {
    id: 'ab_kinetic_sudden_burst',
    name: 'Surto Repentino',
    description: 'Ataca duas vezes, cada golpe causando 8 de dano.',
    icon: 'fas fa-angles-right',
    targetType: 'single_enemy',
    effects: [{ type: 'damage', baseValue: new Decimal(8), hits: 2 } as any], // Using 'hits' property
    resourceCost: new Decimal(20), // Energia
    cooldownTurns: 2,
  },
  {
    id: 'ab_kinetic_rapid_displacement',
    name: 'Deslocamento Rápido',
    description: 'Aumenta a própria velocidade em 20% por 2 turnos.',
    icon: 'fas fa-person-running',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_speed_buff_20_2t' }],
    resourceCost: new Decimal(15), // Energia
    cooldownTurns: 3,
  },
  {
    id: 'ab_coral_protective_mantle',
    name: 'Manto Protetor',
    description: 'Reduz 20% do dano recebido por todos os aliados no próximo turno.',
    icon: 'fas fa-shield-heart',
    targetType: 'all_allies',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_team_damage_reduction_20_1t' }],
    resourceCost: new Decimal(22), // Maré
    cooldownTurns: 3,
  },
  {
    id: 'ab_coral_saline_resonance',
    name: 'Ressonância Salina',
    description: 'Causa 10 de dano e tem 40% de chance de reduzir o ataque do inimigo em 15% por 2 turnos.',
    icon: 'fas fa-water-arrow-down',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_attack_debuff_15_2t', chance: new Decimal(0.40) }
    ],
    resourceCost: new Decimal(18), // Maré
    cooldownTurns: 2,
  },
  {
    id: 'ab_marrow_instinctive_strike',
    name: 'Golpe Instintivo',
    description: 'Causa 16 de dano com 25% de chance de aplicar Sangramento Leve (3 dano/turno por 2 turnos).',
    icon: 'fas fa-bone-break',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(16) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_bleeding_3dmg_2t', chance: new Decimal(0.25) }
    ],
    resourceCost: new Decimal(20), // Instinto
    cooldownTurns: 2,
  },
  {
    id: 'ab_marrow_danger_alert',
    name: 'Alerta de Perigo',
    description: 'Aumenta a evasão do usuário em 30% por 1 turno.',
    icon: 'fas fa-triangle-exclamation',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_evasion_buff_30_1t' }],
    resourceCost: new Decimal(15), // Instinto
    cooldownTurns: 3,
  },

  // --- Uncommon New Egg Abilities ---
  {
    id: 'ab_whisper_dream_confusion',
    name: 'Confusão Onírica',
    description: 'Causa 10 de dano e tem 50% de chance de aplicar "Confuso" (50% de errar o alvo por 2 turnos).',
    icon: 'fas fa-brain-arrow-curved-right text-purple-300',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_confused_50_miss_2t', chance: new Decimal(0.50) }
    ],
    resourceCost: new Decimal(20), // Eco Psíquico
    cooldownTurns: 2,
  },
  {
    id: 'ab_whisper_mental_residue',
    name: 'Resíduo Mental',
    description: 'Aplica "Eco Psíquico" em um inimigo (recebe 5 de dano ao usar qualquer habilidade por 3 turnos).',
    icon: 'fas fa-head-side-brain text-indigo-300',
    targetType: 'single_enemy',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_psychic_echo_5dmg_on_ability_3t' }],
    resourceCost: new Decimal(25), // Eco Psíquico
    cooldownTurns: 3,
  },
  {
    id: 'ab_skeletal_ghost_tooth',
    name: 'Dente Fantasma',
    description: 'Causa 15 de dano com 50% de chance de aplicar "Sangramento" (6 de dano por 2 turnos).',
    icon: 'fas fa-tooth text-slate-300',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(15) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_bleeding_6dmg_2t', chance: new Decimal(0.50) }
    ],
    resourceCost: new Decimal(18), // Necroenergia
    cooldownTurns: 2,
  },
  {
    id: 'ab_skeletal_cracked_shell',
    name: 'Casca Rachada',
    description: 'Reduz a própria defesa em 10% e aumenta o ataque em 30% por 2 turnos.',
    icon: 'fas fa-bone-break text-red-400',
    targetType: 'self',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_self_defense_debuff_10_2t_skeletal' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_self_attack_buff_30_2t_skeletal' }
    ],
    resourceCost: new Decimal(22), // Necroenergia
    cooldownTurns: 3,
  },
  {
    id: 'ab_moss_regrowth',
    name: 'Recrescimento',
    description: 'Aplica "Regeneração Leve" (restaura 6 de HP por 3 turnos) a um aliado.',
    icon: 'fas fa-spa text-green-400',
    targetType: 'single_ally',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_regen_6hp_3t' }],
    resourceCost: new Decimal(15), // Seiva Viva
    cooldownTurns: 2,
  },
  {
    id: 'ab_moss_mossy_grip',
    name: 'Aderência Musgosa',
    description: 'Reduz a velocidade de um inimigo em 30% por 2 turnos e aplica "Lentidão".',
    icon: 'fas fa-hand-holding-seedling text-lime-400',
    targetType: 'single_enemy',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_speed_debuff_30_2t_moss' }],
    resourceCost: new Decimal(20), // Seiva Viva
    cooldownTurns: 3,
  },
  {
    id: 'ab_spark_accelerated_discharge',
    name: 'Descarga Acelerada',
    description: 'Causa 20 de dano com 25% de chance de causar crítico (dano dobrado).',
    icon: 'fas fa-bolt text-yellow-300',
    targetType: 'single_enemy',
    effects: [{ type: 'damage', baseValue: new Decimal(20), critChance: new Decimal(0.25), critMultiplier: new Decimal(2) } as any],
    resourceCost: new Decimal(22), // Carga
    cooldownTurns: 2,
  },
  {
    id: 'ab_spark_electric_crackle',
    name: 'Estalo Elétrico',
    description: 'Causa 8 de dano e tem 25% de chance de paralisar o inimigo por 1 turno.',
    icon: 'fas fa-strikethrough text-sky-300',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(8) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_paralysis_1t_spark', chance: new Decimal(0.25) }
    ],
    resourceCost: new Decimal(18), // Carga
    cooldownTurns: 3,
  },
  {
    id: 'ab_petrified_active_immobility',
    name: 'Imobilidade Ativa',
    description: 'Recebe 50% menos dano no próximo turno, mas não pode agir nesse turno.',
    icon: 'fas fa-person-dots-from-line text-stone-400',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_active_immobility_dmg_reduct_50_1t_skip_turn' }],
    resourceCost: new Decimal(15), // Rocha Interna
    cooldownTurns: 4, // Longer cooldown due to powerful effect + drawback
  },
  {
    id: 'ab_petrified_basalt_shell',
    name: 'Casca de Basalto',
    description: 'Aumenta a própria defesa em 40% por 2 turnos e aplica "Raiz".',
    icon: 'fas fa-shield-halved text-gray-400',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_defense_buff_40_2t_petrified' }],
    resourceCost: new Decimal(20), // Rocha Interna
    cooldownTurns: 3,
  },
  // --- Epic New Egg Abilities ---
  {
    id: 'ab_lightning_chain_shot',
    name: 'Disparo em Corrente',
    description: 'Causa 14 de dano, saltando para até 2 alvos adjacentes (dano reduzido em 25% por salto).',
    icon: 'fas fa-bolt-auto text-yellow-400',
    targetType: 'single_enemy', 
    effects: [{ type: 'custom_logic', customEffectId: 'chain_damage', baseValue: new Decimal(14), chainTargets: 2, chainDamageReductionPerJump: new Decimal(0.25) } as any],
    resourceCost: new Decimal(25), // Carga
    cooldownTurns: 3,
  },
  {
    id: 'ab_lightning_paralytic_shock',
    name: 'Choque Paralítico',
    description: 'Causa 20 de dano com 50% de chance de atordoar o alvo por 1 turno.',
    icon: 'fas fa-bolt-lightning text-yellow-500',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(20) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_paralysis_1t_spark', chance: new Decimal(0.50) }
    ],
    resourceCost: new Decimal(30), // Carga
    cooldownTurns: 4,
  },
  {
    id: 'ab_umbral_shadow_cover',
    name: 'Cobertura Sombria',
    description: 'Reduz o dano recebido por todos os aliados em 20% por 2 turnos.',
    icon: 'fas fa-user-shield text-slate-400',
    targetType: 'all_allies',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_team_damage_reduction_20_2t' }],
    resourceCost: new Decimal(28), // Sombra
    cooldownTurns: 4,
  },
  {
    id: 'ab_umbral_light_drain',
    name: 'Dreno de Luz',
    description: 'Causa 15 de dano e aplica "Visão Reduzida" (acerto -25%) por 2 turnos.',
    icon: 'fas fa-eye-slash text-gray-500',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(15) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_accuracy_debuff_25_2t' }
    ],
    resourceCost: new Decimal(22), // Sombra
    cooldownTurns: 3,
  },
  {
    id: 'ab_psychic_neural_confusion',
    name: 'Confusão Neural',
    description: 'Causa 10 de dano e tem 40% de chance de inverter a ação do inimigo no próximo turno.',
    icon: 'fas fa-brain-circuit text-purple-400',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_action_confusion_40_1t', chance: new Decimal(0.40) }
    ],
    resourceCost: new Decimal(30), // Psi
    cooldownTurns: 4,
  },
  {
    id: 'ab_psychic_clairvoyance',
    name: 'Clarividência',
    description: 'Revela a habilidade que o inimigo usará e reduz sua efetividade em 50%.',
    icon: 'fas fa-eye text-sky-400',
    targetType: 'single_enemy',
    effects: [
      { type: 'custom_logic', customEffectId: 'clairvoyance_debuff' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_enemy_effectiveness_reduced_50_1t' }
    ],
    resourceCost: new Decimal(25), // Psi
    cooldownTurns: 3,
  },
  {
    id: 'ab_obsidian_reflection',
    name: 'Reflexão Obsidiana',
    description: 'Retorna 50% do dano recebido durante 1 turno.',
    icon: 'fas fa-gem text-black',
    targetType: 'self',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_damage_reflection_50_1t' }],
    resourceCost: new Decimal(20), // Tenacidade
    cooldownTurns: 3,
  },
  {
    id: 'ab_obsidian_contained_fury',
    name: 'Fúria Contida',
    description: 'Recebe +15% de dano por 2 turnos, mas explode com um ataque de 30 dano AoE ao final.',
    icon: 'fas fa-fire-flame-curved text-red-600',
    targetType: 'self',
    effects: [
      { type: 'apply_status', statusEffectDefinitionId: 'se_self_damage_taken_increase_15_2t' },
      { type: 'apply_status', statusEffectDefinitionId: 'se_delayed_explosion_marker_30dmg_2t' }
    ],
    resourceCost: new Decimal(25), // Tenacidade
    cooldownTurns: 4,
  },
  {
    id: 'ab_vortex_chaotic_swirl',
    name: 'Torvelinho Caótico',
    description: 'Ataca aleatoriamente entre 1 a 3 inimigos com 10 de dano cada.',
    icon: 'fas fa-tornado text-cyan-400',
    targetType: 'custom_logic',
    effects: [{ type: 'custom_logic', customEffectId: 'random_multi_target_damage', baseValue: new Decimal(10), minTargets: 1, maxTargets: 3 } as any],
    resourceCost: new Decimal(28), // Impulso
    cooldownTurns: 3,
  },
  {
    id: 'ab_vortex_discharge',
    name: 'Descarregar Vórtice',
    description: 'Gasta todo o recurso para causar dano igual ao dobro da quantidade gasta (máx 120).',
    icon: 'fas fa-burst text-cyan-500',
    targetType: 'single_enemy',
    effects: [{ type: 'custom_logic', customEffectId: 'resource_dump_damage', damageBasedOnResourceSpentMultiplier: new Decimal(2), maxResourceBasedDamage: new Decimal(120) } as any],
    resourceCost: new Decimal(10), // Impulso (Minimum cost, consumes all)
    cooldownTurns: 4,
  },

  // --- Boss Chrono-Wyrm Abilities (Expedition) ---
  {
    id: 'ab_chrono_wyrm_temporal_burst',
    name: 'Explosão Temporal',
    description: 'Causa dano massivo a um alvo e pode conceder um turno extra ao Chrono-Wyrm.',
    icon: 'fas fa-hourglass-half text-purple-300',
    targetType: 'single_enemy',
    effects: [
        { type: 'damage', baseValue: new Decimal(50) },
        // Turn extra logic is handled in the battle loop effect for this ability
    ],
    resourceCost: new Decimal(30),
    cooldownTurns: 3,
  },
  {
    id: 'ab_chrono_wyrm_reality_warp',
    name: 'Distorção da Realidade',
    description: 'Causa dano a todos os inimigos e tem chance de aplicar Atordoamento ou Velocidade Reduzida.',
    icon: 'fas fa-arrows-rotate text-purple-300',
    targetType: 'all_enemies',
    effects: [
        { type: 'damage', baseValue: new Decimal(25) },
        { type: 'apply_status', statusEffectDefinitionId: 'se_stun_short', chance: new Decimal(0.25) },
        { type: 'apply_status', statusEffectDefinitionId: 'se_speed_debuff_major', chance: new Decimal(0.25) }
    ],
    resourceCost: new Decimal(40),
    cooldownTurns: 4,
  },
  {
    id: 'ab_chrono_wyrm_entropic_roar',
    name: 'Rugido Entrópico',
    description: 'Aplica um debuff de redução de ataque em todos os inimigos e cura o Chrono-Wyrm baseado no número de alvos afetados.',
    icon: 'fas fa-volume-up text-purple-300',
    targetType: 'all_enemies', // Also affects self for heal
    effects: [
        { type: 'apply_status', statusEffectDefinitionId: 'se_attack_debuff_minor' }, // Assuming se_attack_debuff_minor exists
        { type: 'custom_logic', customEffectId: 'chrono_wyrm_heal_per_target', baseValue: new Decimal(15) } // Heal 15 per target
    ],
    resourceCost: new Decimal(35),
    cooldownTurns: 5,
  },
  // New Legendary Egg Abilities
  {
    id: 'ab_chrono_rewind',
    name: 'Rebobinar',
    description: 'Cura 30 de HP e remove até 2 debuffs recentes do alvo.',
    icon: 'fas fa-history text-teal-400',
    targetType: 'single_ally',
    effects: [
      { type: 'heal', baseValue: new Decimal(30) },
      { type: 'cleanse_debuffs', cleanseCount: 2 }
    ],
    resourceCost: new Decimal(25), // Tempo
    cooldownTurns: 3,
  },
  {
    id: 'ab_chrono_anomaly',
    name: 'Anomalia Temporal',
    description: 'Causa 10 de dano a todos os inimigos e os impede de usar habilidades com recarga no próximo turno.',
    icon: 'fas fa-clock-rotate-left text-sky-400',
    targetType: 'all_enemies',
    effects: [
      { type: 'damage', baseValue: new Decimal(10) },
      { type: 'apply_status', statusEffectDefinitionId: 'se_cooldown_lock_1t', chance: new Decimal(1) }
    ],
    resourceCost: new Decimal(30), // Tempo
    cooldownTurns: 4,
  },
  {
    id: 'ab_ruin_growing_corruption',
    name: 'Corrupção Crescente',
    description: 'Aplica Ruína a um inimigo, causando dano crescente por turno.',
    icon: 'fas fa-viruses text-purple-500',
    targetType: 'single_enemy',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_ruin_stacking_dot' }],
    resourceCost: new Decimal(15), // Corrupção
    cooldownTurns: 1,
  },
  {
    id: 'ab_ruin_cadaveric_explosion',
    name: 'Explosão Cadavérica',
    description: 'Causa dano em área, aumentado por cada inimigo afetado por Ruína.',
    icon: 'fas fa-bomb text-red-600',
    targetType: 'all_enemies',
    effects: [{ type: 'custom_logic', customEffectId: 'cadaveric_explosion_damage', baseValue: new Decimal(15) }],
    resourceCost: new Decimal(35), // Corrupção
    cooldownTurns: 4,
  },
  {
    id: 'ab_abyssal_gaze',
    name: 'Olhar do Abismo',
    description: 'Causa 20 de dano, remove 1 buff e tem 30% de chance de Silenciar o inimigo.',
    icon: 'fas fa-eye text-indigo-600',
    targetType: 'single_enemy',
    effects: [
      { type: 'damage', baseValue: new Decimal(20) },
      { type: 'custom_logic', customEffectId: 'abyssal_gaze_dispel' }, 
      { type: 'apply_status', statusEffectDefinitionId: 'se_silence_abyssal_1t', chance: new Decimal(0.30) }
    ],
    resourceCost: new Decimal(25), // Essência Abissal
    cooldownTurns: 3,
  },
  {
    id: 'ab_abyssal_entropy',
    name: 'Entropia Rastejante',
    description: 'Aplica Corrosão Abissal, causando dano baseado no HP máximo do inimigo.',
    icon: 'fas fa-skull text-blue-900',
    targetType: 'single_enemy',
    effects: [{ type: 'apply_status', statusEffectDefinitionId: 'se_abyssal_corrosion_dot_percent' }],
    resourceCost: new Decimal(30), // Essência Abissal
    cooldownTurns: 4,
  },
  {
    id: 'ab_chimera_random_mutation',
    name: 'Mutação Aleatória',
    description: 'Troca seus atributos com um aliado aleatório por 2 turnos.',
    icon: 'fas fa-random text-pink-500',
    targetType: 'custom_logic',
    effects: [{ type: 'custom_logic', customEffectId: 'chimera_stat_swap' }],
    resourceCost: new Decimal(10), // Impulso
    cooldownTurns: 5,
  },
  {
    id: 'ab_chimera_charge',
    name: 'Investida Quimérica',
    description: 'Causa dano variável (5-30) e aplica um efeito negativo aleatório (veneno, queimadura, atordoamento ou sangramento leve).',
    icon: 'fas fa-question-circle text-orange-500',
    targetType: 'single_enemy',
    effects: [{ type: 'custom_logic', customEffectId: 'chimera_random_damage_effect', baseValue: new Decimal(5), maxValue: new Decimal(30) } as any],
    resourceCost: new Decimal(20), // Impulso
    cooldownTurns: 2,
  },


  // Placeholder for undefined abilities
  {
    id: 'placeholder_undefined_ability',
    name: 'Habilidade Indefinida',
    description: 'Esta habilidade não foi definida.',
    icon: 'fas fa-question-circle',
    targetType: 'self',
    effects: [],
    resourceCost: new Decimal(0),
    cooldownTurns: 0,
  },
];
