
import { Decimal } from 'decimal.js';
import {
    EggStage, RegularUpgrade, TranscendentalBonus, SpecialUpgrade, EggForm, Achievement, Trait, ActiveAbility as GameActiveAbility, GameState, EtPermanentUpgrade, GameEvent, TranscendenceMilestoneInfo, LegendaryUpgrade, SecretRuptureUpgrade, Enemy, EmbryoUpgrade, EmbryoLevelMilestone, EmbryoStats, EmbryoItem, EmbryoItemRarity, EmbryoEquipmentSlotKey, GameEventOption, CosmicBankResourceType, ActiveTemporaryBuffState, TranscendenceInfoModalData, BankedResourceInfo, MissionRarity, SkinDefinition, MetaUpgrade, EnemyStatusEffect, BattleEggRarity, BattleStatusEffectInstance, BattleEgg, FloatingText,
    CollectibleEggDisplayRarity,
    GameDataForAchievementCheck,
    BattleAbilityInstance, 
    EggTeamBattlePhase,
    LastStatusApplicationInfo,
    LastAcquiredEggInfo, // Added LastAcquiredEggInfo
    ExpeditionRewardOption, // Added for expedition rewards
    AbilityDefinition, // Added for expedition boss ability
    CollectibleEggDefinition,
    SacredRelicUpgrade
} from './types';
import { ABILITY_DEFINITIONS as ABILITIES_FROM_MODULE } from './constants/abilities';
import { STATUS_EFFECT_DEFINITIONS as STATUS_EFFECTS_FROM_MODULE } from './constants/statusEffects';
import { 
  SKIN_DEFINITIONS,
  INITIAL_META_UPGRADES 
} from './constants/skins';
import { EGG_FRAGMENTS_FOR_RANDOM_ROLL, COLLECTIBLE_EGG_DEFINITIONS, EGG_FRAGMENTS_PER_CLICK, COLLECTIBLE_EGG_RARITY_CHANCES, MAX_ACQUISITION_HISTORY, REROLL_COST_ET, FIXED_EGG_SHOP_COSTS } from './constants/collectibles'; // Added import

import {
  INITIAL_HIDDEN_DISCOVERY_DEFINITIONS,
  SECRET_EGG_FORM_SILENT,
  SECRET_TRAIT_AUTOPHAGY,
  SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER
} from './constants/hiddenDiscoveries';


export interface RankingEntry { rank: number; nickname: string; score: Decimal; }

export const MOCK_RANKING_DATA: RankingEntry[] = [
  { rank: 1, nickname: "OvoMestreSupremo", score: new Decimal("1.23e35") },
  { rank: 2, nickname: "IncubadorLendario", score: new Decimal("9.87e34") },
  { rank: 3, nickname: "DesbravadorCosmico", score: new Decimal("5.55e33") },
  { rank: 4, nickname: "EGGxterminador", score: new Decimal("2.10e32") },
  { rank: 5, nickname: "GemaGalatica", score: new Decimal("8.88e31") },
  { rank: 6, nickname: "Player001", score: new Decimal("1.00e30") },
  { rank: 7, nickname: "AlphaOvo", score: new Decimal("7.50e29") },
  { rank: 8, nickname: "OmegaIncubator", score: new Decimal("3.20e28") },
  { rank: 9, nickname: "RankNoob", score: new Decimal("1.11e27") },
  { rank: 10, nickname: "TestPlayer", score: new Decimal("5.00e26") },
];


export const EGG_STAGES: EggStage[] = [
    { name: 'Ovo da Potencialidade', threshold: new Decimal(0), color: '#fcd34d', description: 'Um ovo em seu estado inicial, cheio de potencial não manifestado. Cada clique nutre sua essência.' },
    { name: 'Ovo do Desabrochar', threshold: new Decimal(100), color: '#8b5cf6', description: 'O ovo começou a desabrochar, suas energias se organizam. Continue nutrindo para a próxima fase de crescimento.' },
    { name: 'Ovo da Manifestação', threshold: new Decimal(500), color: '#ef4444', description: 'Ovo está vibrante, pronto para a plena manifestação. O propósito está se revelando!' },
    { name: 'Ovo da Ascensão', threshold: new Decimal(1500), color: '#34d399', description: 'Ovo está ascendendo, a transformação se aprofunda. Você está no caminho da transcendência!' },
    { name: 'Ovo Transcendente', threshold: new Decimal(2000), color: '#60a5fa', description: 'Parabéns! O ovo transcendeu, completando seu ciclo de transformação. A jornada continua em outro nível!' },
    { name: 'Ovo Cósmico', threshold: new Decimal(10000), color: '#a855f7', description: 'Seu ovo alcançou uma forma cósmica, refletindo o fluxo universal de criação e renovação.' },
    { name: 'Ovo Infinito', threshold: new Decimal(25000), color: '#f472b6', description: 'Ovo se tornou infinito, um símbolo da sua maestria sobre os ciclos da existência.' },
    { name: 'Ovo Estelar', threshold: new Decimal(50000), color: '#fcd34d', description: 'Um ovo que brilha com a luz de mil estrelas, prometendo ganhos além do tempo.' },
    { name: 'Ovo Dimensional', threshold: new Decimal(250000), color: '#8b5cf6', description: 'Um ovo que distorce o espaço-tempo, dobrando a própria realidade da produção.' },
    { name: 'Ovo do Vazio', threshold: new Decimal(1000000), color: '#0f172a', description: 'Um ovo que emana o silêncio do vazio, onde o custo e o esforço se tornam insignificantes.' },
    { name: 'Ovo do Fogo Frio', threshold: new Decimal(5000000), color: '#60a5fa', description: 'Um ovo que arde com uma chama paradoxal, amplificando a energia passiva.' },
    { id: 'stage11BonusEquivalent', name: 'Ovo da Ressonância Eterna', threshold: new Decimal(10000000), color: '#f59e0b', description: 'O ovo ressoa com poder eterno.' },
    { id: 'stage12BonusEquivalent', name: 'Ovo da Distorção de Estado', threshold: new Decimal(25000000), color: '#10b981', description: 'O ovo começa a distorcer a realidade dos custos.' },
    { id: 'stage13BonusEquivalent', name: 'Ovo do Conhecimento Ancestral', threshold: new Decimal(50000000), color: '#ec4899', description: 'O ovo revela sabedoria antiga.' },
    { id: 'stage14BonusEquivalent', name: 'Ovo da Consciência Expandida', threshold: new Decimal(100000000), color: '#0ea5e9', description: 'A consciência do ovo se expande para além dos limites.' },
    { id: 'stage15BonusEquivalent', name: 'Ovo do Núcleo da Realidade', threshold: new Decimal(250000000), color: '#d946ef', description: 'O ovo se torna um núcleo da própria realidade.' },
    { id: 'stage16BonusEquivalent', name: 'Ovo da Fragmentação Total', threshold: new Decimal(1e9), color: '#a855f7', description: 'Permite uma maior complexidade de formas ativas.' },
    { id: 'stage17BonusEquivalent', name: 'Ovo da Chama Sem Origem', threshold: new Decimal(5e9), color: '#f97316', description: 'Uma chama que queima sem combustível, alimentada pelo poder do clique.' },
    { id: 'stage18BonusEquivalent', name: 'Ovo da Espiral Decaída', threshold: new Decimal(10e9), color: '#64748b', description: 'Um ciclo que se alimenta de si mesmo, gerando poder a cada repetição.' },
    { id: 'stage19BonusEquivalent', name: 'Ovo do Eco Inexistente', threshold: new Decimal(50e9), color: '#14b8a6', description: 'Sincroniza suas habilidades com o cosmos, acelerando seu retorno.' },
    { id: 'stage20BonusEquivalent', name: 'Ovo do Silêncio Brilhante', threshold: new Decimal(100e9), color: '#f0f9ff', description: 'O vazio potencializado, trabalhando para você mesmo na sua ausência.' },
    { id: 'stage21BonusEquivalent', name: 'Ovo da Simetria Perfeita', threshold: new Decimal(500e9), color: '#facc15', description: 'Atinge um ritmo perfeito, garantindo poder em intervalos precisos.' },
    { name: 'Ovo do Contato Esquecido', threshold: new Decimal(1e12), color: '#2dd4bf', description: 'Um contato que transcende o tempo, oferecendo compreensão sobre custos universais.' },
    { name: 'Ovo da Cascata Inefável', threshold: new Decimal(5e12), color: '#93c5fd', description: 'Uma torrente de poder puro que emana de cada toque, um eco do infinito.' },
    { name: 'Ovo da Mente Desconectada', threshold: new Decimal(10e12), color: '#f472b6', description: 'A mente do embrião se expande, absorvendo conhecimento de forma acelerada.' },
    { name: 'Ovo da Manifestação Efêmera', threshold: new Decimal(50e12), color: '#fde047', description: 'Dobra a realidade das formas ativas, amplificando seus bônus temporariamente.' },
    { name: 'Ovo do Reflexo Partilhado', threshold: new Decimal(100e12), color: '#e5e7eb', description: 'Um espelho do potencial, com a chance de duplicar cada ganho obtido.' },
    { name: 'Ovo da Irrealidade Pura', threshold: new Decimal(1e15), color: '#a5f3fc', description: 'A realidade se curva, premiando a derrota com poder adicional.' },
    { name: 'Ovo da Centelha Impossível', threshold: new Decimal(10e15), color: '#f9a8d4', description: 'A diversidade de formas gera novas possibilidades.' },
    { name: 'Ovo do Horizonte Fraturado', threshold: new Decimal(100e15), color: '#4b5563', description: 'O tempo perde seu domínio sobre seus ganhos enquanto ausente.' },
    { name: 'Ovo da Verdade Sem Nome', threshold: new Decimal(1e18), color: '#fefce8', description: 'A transcendência se torna mais eficiente, revelando mais essência.' },
    { name: 'Ovo do Abismo Interior', threshold: new Decimal(10e18), color: '#1e293b', description: 'Quanto mais tempo você gasta, mais o abismo lhe recompensa com poder.' },
    { name: 'Ovo da Ressonância Suprema', threshold: new Decimal(100e18), color: '#818cf8', description: 'A sintonia final é alcançada, permitindo que todas as energias coexistam.' },
    { name: 'Ovo do Olho Eterno', threshold: new Decimal(1e21), color: '#fde047', description: 'A percepção transcende a singularidade, abraçando todas as formas de uma só vez.' },
    { name: 'Ovo da Quebra Final', threshold: new Decimal(10e21), color: '#fca5a5', description: 'A forma definitiva, multiplicando todo o poder acumulado.' },
    { name: 'Ovo da Reiteração Fragmentada', threshold: new Decimal(100e21), color: '#d1d5db', description: 'O ciclo pode ser quebrado em troca de poder imediato, mas a um custo.' },
    { name: 'Ovo da Elipse Autoconsumida', threshold: new Decimal('1e24'), color: '#c084fc', description: 'Um ovo que se dobra sobre si mesmo, consumindo sua própria lógica para gerar poder fractal.' },
    { name: 'Ovo da Cera Transdimensional', threshold: new Decimal('10e24'), color: '#fbbf24', description: 'Feito de uma substância que retém ecos do passado, prolongando o poder da transcendência.' },
    { name: 'Ovo da Casca de Cristal', threshold: new Decimal('100e24'), color: '#22d3ee', description: 'Sua casca cristalina absorve a essência da derrota, transformando-a em força perpétua.' },
    { name: 'Ovo do Elo Original', threshold: new Decimal('1e27'), color: '#f43f5e', description: 'A primeira anomalia, o ponto de origem que promete acesso a uma realidade superior.' },
];

export const INITIAL_REGULAR_UPGRADES: RegularUpgrade[] = [
    { id: 'basicIncubator', name: 'Incubadora Básica', description: 'Gera 1 Poder de Incubação por segundo.', baseCost: new Decimal(10), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(1) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-egg' },
    { id: 'blessedTouch', name: 'Toque Abençoado', description: 'Aumenta o Poder de Incubação por clique em 1.', baseCost: new Decimal(20), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(1) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-hand-pointer' },
    { id: 'advancedIncubator', name: 'Incubadora Avançada', description: 'Gera 5 Poder de Incubação por segundo.', baseCost: new Decimal(100), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(5) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-industry' },
    { id: 'divineGuidance', name: 'Orientação Divina', description: 'Aumenta o Poder de Incubação por clique em 5.', baseCost: new Decimal(250), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(5) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-star' },
    { id: 'cosmicForge', name: 'Forja Cósmica', description: 'Gera 25 Poder de Incubação por segundo.', baseCost: new Decimal(1000), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(25) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-fire' },
    { id: 'soulInfusion', name: 'Infusão da Alma', description: 'Aumenta o Poder de Incubação por clique em 20.', baseCost: new Decimal(1500), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(20) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-heart' },
    { id: 'automatedIncubator', name: 'Incubadora Automatizada', description: 'Gera 100 Poder de Incubação por segundo.', baseCost: new Decimal(5000), costMultiplier: new Decimal(1.18), effect: { ipps: new Decimal(100) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-robot', hidden: true },
    {
        id: 'legendaryCore',
        name: 'Núcleo Lendário',
        description: 'Gera 1.000.000 de Poder de Incubação por segundo. Desbloqueado por um marco de transcendência.',
        baseCost: new Decimal(100000000),
        costMultiplier: new Decimal(10),
        effect: { ipps: new Decimal(1000000) },
        purchased: new Decimal(0),
        type: 'ipps',
        icon: 'fas fa-gem', 
        hidden: true 
    },
    { id: 'manoDeAscensao', name: 'Mão da Ascensão', description: 'Cliques têm 5% de chance de se tornarem Super Críticos (5x mais poderosos).', baseCost: new Decimal(7500), costMultiplier: new Decimal(1.25), effect: {}, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-hand-sparkles' },
    { id: 'plasmaVitalico', name: 'Plasma Vitálico', description: 'Aumenta a produção passiva (IPPS) em +20% do seu valor base.', baseCost: new Decimal(12000), costMultiplier: new Decimal(1.3), effect: { bonusPassiveProductionMultiplier: new Decimal(0.20) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-atom' },
    { id: 'matrizIncubacaoFractal', name: 'Matriz de Incubação Fractal', description: 'Aumenta a produção passiva (IPPS) em +2% para cada Forma de Ovo ativa.', baseCost: new Decimal(25000), costMultiplier: new Decimal(1.4), effect: { bonusPassivePerActiveForm: new Decimal(0.02) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-project-diagram' },
    { id: 'toqueEstelar', name: 'Toque Estelar', description: 'Aumenta o poder por clique em +0.75% para cada Traço ativo.', baseCost: new Decimal(18000), costMultiplier: new Decimal(1.35), effect: { bonusClickPerTrait: new Decimal(0.0075) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-star-of-life' },
    { id: 'forjaRessonante', name: 'Forja Ressonante', description: 'Ativar uma Habilidade Ativa dobra a produção passiva por 5 segundos.', baseCost: new Decimal(30000), costMultiplier: new Decimal(1.5), effect: {}, purchased: new Decimal(0), type: 'passive_buff', icon: 'fas fa-cogs' },
    { id: 'toqueTrino', name: 'Toque Trino', description: 'Derrotar um Chefe aumenta o ganho de EXP Modular em +20% por 10 segundos.', baseCost: new Decimal(40000), costMultiplier: new Decimal(1.6), effect: {}, purchased: new Decimal(0), type: 'passive_buff', icon: 'fas fa-trillium' },
    { id: 'fusaoBioquantum', name: 'Fusão Bioquantum', description: 'Ativar uma Habilidade Ativa torna o próximo clique 5x mais poderoso.', baseCost: new Decimal(35000), costMultiplier: new Decimal(1.55), effect: { nextClickMultiplierValue: new Decimal(5) }, purchased: new Decimal(0), type: 'click_buff', icon: 'fas fa-biohazard' },
    { id: 'esporoIncandescente', name: 'Esporo Incandescente', description: 'A cada 10 segundos, aumenta a produção global em +10% por 5 segundos.', baseCost: new Decimal(50000), costMultiplier: new Decimal(1.7), effect: { esporoProductionBuffMultiplier: new Decimal(0.10) }, purchased: new Decimal(0), type: 'passive_buff_cycle', icon: 'fas fa-lightbulb' },
];


export const INITIAL_TRANSCENDENTAL_BONUSES: TranscendentalBonus[] = [
    { id: 'divineSpark', name: 'Centelha Divina', description: 'Aumenta o poder por clique em +8% por nível.', baseCost: new Decimal(1), costMultiplier: new Decimal(1.5), effect: { clicksPerClickMultiplier: new Decimal(0.08) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-bolt' },
    { id: 'cosmicFlow', name: 'Fluxo Cósmico', description: 'Aumenta a produção passiva (IPPS) em +12% por nível.', baseCost: new Decimal(1), costMultiplier: new Decimal(1.5), effect: { ippsMultiplier: new Decimal(0.12) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-wind' },
    { id: 'primordialEssence', name: 'Essência Primordial', description: 'Aumenta a produção global em +1% por nível.', baseCost: new Decimal(5), costMultiplier: new Decimal(2), effect: { incubationPowerMultiplier: new Decimal(0.01) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-atom' },
    { id: 'despertarPsiquico', name: 'Despertar Psíquico', description: 'Reduz o cooldown de habilidades ativas em 1 segundo por nível.', baseCost: new Decimal(10), costMultiplier: new Decimal(2.5), effect: { abilityCooldownReductionPerLevel: new Decimal(1) }, purchased: new Decimal(0), type: 'cooldown_reduction', icon: 'fas fa-brain', maxLevel: new Decimal(5) },
    { id: 'coracaoDaFuria', name: 'Coração da Fúria', description: 'Cada clique aumenta um bônus de IPPS passivo em +0.1% por 5s (máx +20%).', baseCost: new Decimal(15), costMultiplier: new Decimal(3), effect: { furyPassiveBonusPerClick: new Decimal(0.001), maxFuryPassiveBonus: new Decimal(0.20) }, purchased: new Decimal(0), type: 'passive_buff_stacking', icon: 'fas fa-heart-pulse' },
    { id: 'dominioCiclico', name: 'Domínio Cíclico', description: 'Aumenta a produção passiva em +5% a cada 5 transcendências completas.', baseCost: new Decimal(20), costMultiplier: new Decimal(4), effect: { passiveProductionBonusPerXTranscendences: new Decimal(0.05), transcendencesPerBonusCycle: new Decimal(5) }, purchased: new Decimal(0), type: 'transcendence_milestone_bonus', icon: 'fas fa-recycle' },
    { id: 'ressonanciaOvoFractal', name: 'Ressonância do Ovo Fractal', description: 'Aumenta o ganho de EXP Modular em +10% por nível.', baseCost: new Decimal(8), costMultiplier: new Decimal(2.2), effect: { modularEXPGainMultiplierBonus: new Decimal(0.10) }, purchased: new Decimal(0), type: 'exp_gain', icon: 'fas fa-dice-d20' },
];


export const INITIAL_ET_PERMANENT_UPGRADES: EtPermanentUpgrade[] = [
  { id: 'critEggBoost', name: 'Impulso Crítico do Ovo', description: 'Aumenta o multiplicador de dano crítico em x1.1 por nível.', baseCost: new Decimal(100), costMultiplier: new Decimal(5), effect: { criticalDamageMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-meteor', maxLevel: new Decimal(10) },
  { id: 'essenceEfficiency', name: 'Eficiência Essencial', description: 'Aumenta o ganho de Essência Transcendente em +5% por nível.', baseCost: new Decimal(150), costMultiplier: new Decimal(6), effect: { etGainMultiplier: new Decimal(1.05) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-filter-circle-dollar', maxLevel: new Decimal(20) },
  { id: 'gatilhoEmocional', name: 'Gatilho Emocional', description: 'Aumenta a chance de clique crítico em +0.5% por nível.', baseCost: new Decimal(200), costMultiplier: new Decimal(7), effect: { bonusCritChancePerLevel: new Decimal(0.005) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-bolt-lightning', maxLevel: new Decimal(10) },
  { id: 'bancoCosmico', name: 'Banco Cósmico Avançado', description: 'Aumenta os juros do Banco Cósmico em +10% do valor base por nível.', baseCost: new Decimal(500), costMultiplier: new Decimal(10), effect: { bankInterestBonusPerLevel: new Decimal(0.10) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-piggy-bank', maxLevel: new Decimal(5) },
  { id: 'lembrancaDimensional', name: 'Lembrança Dimensional', description: 'Começa cada transcendência com +1000 EXP Modular por nível.', baseCost: new Decimal(300), costMultiplier: new Decimal(8), effect: { startingModularExpPerLevel: new Decimal(1000) }, purchased: new Decimal(0), type: 'et_permanent_fixed', icon: 'fas fa-brain-circuit', maxLevel: new Decimal(15) },
  { id: 'pulsoParalelo', name: 'Pulso Paralelo', description: 'Habilidades Ativas têm 1% de chance por nível de não entrarem em cooldown.', baseCost: new Decimal(1000), costMultiplier: new Decimal(15), effect: { abilityNoCooldownChancePerLevel: new Decimal(0.01) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-infinity', maxLevel: new Decimal(5) },
];

export const INITIAL_SPECIAL_UPGRADES: SpecialUpgrade[] = [
    { id: 'stage2Bonus', name: 'Despertar Inicial', description: 'Aumenta o Poder de Incubação por clique em 5.', stageRequired: 1, effect: { clicksPerClick: new Decimal(5) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-egg' },
    { id: 'stage3Bonus', name: 'Energia Contínua', description: 'Aumenta a produção passiva (IPPS) em 10.', stageRequired: 2, effect: { ipps: new Decimal(10) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-industry' },
    { id: 'stage4Bonus', name: 'Eco Transcendente', description: 'Ganha +5 de Essência Transcendente adicional ao transcender.', stageRequired: 3, effect: { bonusET: new Decimal(5) }, purchased: new Decimal(0), type: 'et', icon: 'fas fa-star' },
    { id: 'stage5Bonus', name: 'Poder Absoluto', description: 'Aumenta a produção global de Poder de Incubação em 10%.', stageRequired: 4, effect: { incubationPowerMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-fire' },
    { id: 'stage6Bonus', name: 'Ciclo Eterno', description: 'Reduz o custo dos Bônus Transcendentais em 5%.', stageRequired: 5, effect: { etCostReduction: new Decimal(0.05) }, purchased: new Decimal(0), type: 'cost_reduction', icon: 'fas fa-sync-alt' },
    { id: 'stage7Bonus', name: 'Pulso Interno', description: 'Aumenta a taxa de PI offline em +5%.', stageRequired: 6, effect: { offlineIncubationRateMultiplier: new Decimal(0.05) }, purchased: new Decimal(0), type: 'offline', icon: 'fas fa-bed' },
    { id: 'stage8Bonus', name: 'Conexão Cósmica', description: 'Aumenta o Poder de Incubação por clique em +5% e a produção passiva (IPPS) em +10%.', stageRequired: 7, effect: { clicksPerClickMultiplier: new Decimal(1.05), ippsMultiplier: new Decimal(1.10) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-satellite-dish' },
    { id: 'stage9Bonus', name: 'Conversão Efêmera', description: 'Converte Ovos Temporários em +10 PI por ovo, uma única vez.', stageRequired: 8, effect: { piPerTemporaryEgg: new Decimal(10) }, purchased: new Decimal(0), type: 'conversion', icon: 'fas fa-exchange-alt' },
    { id: 'stage10Bonus', name: 'Aura do Vazio', description: 'Aumenta a produção global em 50% quando nenhuma Forma de Ovo está ativa.', stageRequired: 9, effect: { globalMultiplier: new Decimal(1.5) }, purchased: new Decimal(0), type: 'conditional_multiplier', icon: 'fas fa-circle-notch' },
    { id: 'stage11Bonus', name: 'Ressonância Eterna Real', description: 'Aumenta o efeito da Essência Transcendente em +1% para cada transcendência.', stageRequired: 10, effect: { transcendenceProductionMultiplier: new Decimal(1.01) }, purchased: new Decimal(0), type: 'scaling_multiplier', icon: 'fas fa-infinity text-yellow-400' },
    { id: 'stage12Bonus', name: 'Distorção de Estado Real', description: 'Reduz o custo de todas as melhorias regulares em 5%.', stageRequired: 11, effect: { upgradeCostReduction: new Decimal(0.05) }, purchased: new Decimal(0), type: 'cost_reduction', icon: 'fas fa-compress-arrows-alt text-green-400' },
    { id: 'stage13Bonus', name: 'Conhecimento Ancestral Real', description: 'Ganha +10 Essência Transcendente. Este bônus é permanente.', stageRequired: 12, effect: { bonusET: new Decimal(10) }, purchased: new Decimal(0), type: 'et_gain', icon: 'fas fa-book-dead text-pink-400' },
    { id: 'stage14Bonus', name: 'Consciência Expandida Real', description: 'Aumenta o ganho global de PI em +25%.', stageRequired: 13, effect: { globalGainMultiplier: new Decimal(1.25) }, purchased: new Decimal(0), type: 'global_gain', icon: 'fas fa-brain text-sky-400' },
    { id: 'stage15Bonus', name: 'Núcleo de Realidade Real', description: 'Desbloqueia a capacidade de quebrar a realidade do ovo, revelando seu potencial máximo.', stageRequired: 14, effect: {}, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-atom text-purple-400' },
    { id: 'stage16Bonus', name: 'Resiliência Fraturada', description: 'Permite utilizar até 3 formas de ovos ativas ao mesmo tempo.', stageRequired: 15, effect: { setMaxActiveEggForms: new Decimal(3) }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-sitemap text-purple-400' },
    { id: 'stage17Bonus', name: 'Influxo Calcinante', description: '+15% de PI por clique permanentemente.', stageRequired: 16, effect: { clicksPerClickMultiplier: new Decimal(1.15) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-fire-alt text-orange-400' },
    { id: 'stage18Bonus', name: 'Distorção Recorrente', description: 'A cada 100 cliques, ganha um bônus de +1% PI/s por 30 segundos (acumulativo até 10x).', stageRequired: 17, effect: { distorcaoRecorrente: true }, purchased: new Decimal(0), type: 'special_effect', icon: 'fas fa-sync-alt text-slate-400' },
    { id: 'stage19Bonus', name: 'Ruído Cósmico Sincronizado', description: 'Reduz em 25% o tempo de recarga de todas as habilidades ativas.', stageRequired: 18, effect: { globalAbilityCooldownMultiplierReduction: new Decimal(0.25) }, purchased: new Decimal(0), type: 'cooldown_reduction', icon: 'fas fa-broadcast-tower text-teal-400' },
    { id: 'stage20Bonus', name: 'Estabilidade no Vácuo', description: 'Multiplica o PI offline em 3x.', stageRequired: 19, effect: { offlineGainMultiplier: new Decimal(3) }, purchased: new Decimal(0), type: 'offline', icon: 'fas fa-bed text-gray-200' },
    { id: 'stage21Bonus', name: 'Pulso da Perfeição', description: 'Garante 1 clique crítico garantido a cada 10 cliques normais.', stageRequired: 20, effect: { pulsoDaPerfeicao: true }, purchased: new Decimal(0), type: 'special_effect', icon: 'fas fa-crosshairs text-yellow-400' },
    { id: 'stage22Bonus', name: 'Compreensão Alienígena', description: 'Reduz o custo dos Bônus Transcendentais em 10%.', stageRequired: 21, effect: { transcendentalBonusCostReduction: new Decimal(0.10) }, purchased: new Decimal(0), type: 'cost_reduction', icon: 'fas fa-user-astronaut text-cyan-400' },
    { id: 'stage23Bonus', name: 'Cascata do Inefável', description: 'Aumenta o Poder de Incubação por clique em 1000.', stageRequired: 22, effect: { clicksPerClick: new Decimal(1000) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-comet text-sky-300' },
    { id: 'stage24Bonus', name: 'Hipermemória Embrionária', description: 'Aumenta o XP ganho por inimigos em +100%.', stageRequired: 23, effect: { embryoExpGainMultiplier: new Decimal(2) }, purchased: new Decimal(0), type: 'exp_gain', icon: 'fas fa-brain-circuit text-emerald-400' },
    { id: 'stage25Bonus', name: 'Amplificação de Realidade', description: 'Todos os bônus de formas ativas de ovos são duplicados nesta run.', stageRequired: 24, effect: { activeEggFormBonusMultiplier: new Decimal(2) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-project-diagram text-fuchsia-400' },
    { id: 'stage26Bonus', name: 'Duplicação Ovoidal', description: '5% de chance por clique de duplicar o PI ganho.', stageRequired: 25, effect: { piDuplicationChance: new Decimal(0.05) }, purchased: new Decimal(0), type: 'special_effect', icon: 'fas fa-copy text-yellow-300' },
    { id: 'stage27Bonus', name: 'Anulação Parcial', description: 'Inimigos derrotados pelo ovo embrionário rendem +50% XP e PI.', stageRequired: 26, effect: { enemyRewardMultiplier: new Decimal(1.5) }, purchased: new Decimal(0), type: 'combat', icon: 'fas fa-ghost text-cyan-200' },
    { id: 'stage28Bonus', name: 'Criação Residuada', description: 'Recebe +1 Ovo Temporário por cada 5 formas de ovo ativas distintas ativadas durante a run.', stageRequired: 27, effect: { bonusTempEggPerXForms: new Decimal(5) }, purchased: new Decimal(0), type: 'conversion', icon: 'fas fa-plus-circle text-pink-300' },
    { id: 'stage29Bonus', name: 'Desconexão do Ciclo', description: 'Remove o limite de ganho de PI offline.', stageRequired: 28, effect: { removesOfflineCap: true }, purchased: new Decimal(0), type: 'offline', icon: 'fas fa-infinity text-slate-300' },
    { id: 'stage30Bonus', name: 'Lógica Reversa', description: 'Aumenta o ganho de ET ao transcender em 25%.', stageRequired: 29, effect: { etGainMultiplier: new Decimal(1.25) }, purchased: new Decimal(0), type: 'et_gain', icon: 'fas fa-retweet text-white' },
    { id: 'stage31Bonus', name: 'Espiral Interna', description: 'A cada 5 minutos de gameplay, ganha +5% de produção total (acumulativo, até 50%).', stageRequired: 30, effect: { espiralInterna: true }, purchased: new Decimal(0), type: 'special_effect', icon: 'fas fa-sync-alt text-gray-500' },
    { id: 'stage32Bonus', name: 'Sintonia de Todas as Coisas', description: 'Buffs temporários nunca se sobrepõem — todos são somados.', stageRequired: 31, effect: { stackableBuffs: true }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-layer-group text-indigo-400' },
    { id: 'stage33Bonus', name: 'Percepção Incandescente', description: 'Libera o uso de todas as formas de ovo ativas ao mesmo tempo.', stageRequired: 32, effect: { allEggFormsActive: true }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-eye text-yellow-300' },
    { id: 'stage34Bonus', name: 'Forma do Inumerável', description: 'Aumenta a produção global em 100%.', stageRequired: 33, effect: { globalProductionMultiplier: new Decimal(2) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-explosion text-rose-400' },
    { id: 'stage35Bonus', name: 'Gatilho Primordial', description: 'Adiciona um botão de uso único que permite sacrificar todas as melhorias atuais para ganhar 1 ovo temporário.', stageRequired: 34, effect: { unlocksPrimordialTrigger: true }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-bomb text-slate-300' },
    { id: 'stage36Bonus', name: 'Visão Fractal', description: 'Toda vez que um clique crítico ocorre, reduz 5s do cooldown de todas habilidades e ativa produção passiva extra por 5s.', stageRequired: 35, effect: { visaoFractal: true }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-eye text-purple-400' },
    { id: 'stage37Bonus', name: 'Abrasão Ressonante', description: 'Aumenta 200% a duração de buffs pós-transcendência.', stageRequired: 36, effect: { postTranscendenceBuffDurationMultiplier: new Decimal(3) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-stopwatch text-amber-400' },
    { id: 'stage38Bonus', name: 'Imortalidade de PI', description: 'Cada inimigo derrotado pelo ovo embrião concede um bônus passivo permanente de +0.05% IPPS até o próximo reset.', stageRequired: 37, effect: { ippsBonusPerEnemyDefeated: new Decimal(0.0005) }, purchased: new Decimal(0), type: 'scaling_multiplier', icon: 'fas fa-infinity text-cyan-400' },
    { id: 'stage39Bonus', name: 'Acesso à Suprarelação', description: 'Desbloqueia um modo final oculto: A Supracamada do Ovo.', stageRequired: 38, effect: { unlocksSuperlayer: true }, purchased: new Decimal(0), type: 'unlock', icon: 'fas fa-link text-rose-500' },
];


export const INITIAL_ACTIVE_ABILITIES: GameActiveAbility[] = [
  { id: 'impactoCritico', name: 'Impacto Crítico', description: 'Seu próximo clique será um acerto crítico.', cost: new Decimal(700000), cooldown: new Decimal(60), icon: 'fas fa-crosshairs', purchased: false, cooldownRemaining: new Decimal(0), effect: { criticalHit: true } },
  { id: 'explosaoIncubadora', name: 'Explosão Incubadora', description: 'Aumenta a produção passiva (IPPS) em 100% por 15 segundos.', cost: new Decimal(750000), cooldown: new Decimal(120), icon: 'fas fa-bomb', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(15), effect: { ippsMultiplier: new Decimal(2) } },
  { id: 'overclockCasca', name: 'Overclock da Casca', description: 'Aumenta o poder por clique em 100% por 10 segundos.', cost: new Decimal(1200000), cooldown: new Decimal(90), icon: 'fas fa-bolt', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(10), effect: { clicksPerClickMultiplier: new Decimal(2) } },
  { id: 'modoFuriaIncubadora', name: 'Modo Fúria Incubadora', description: 'Aumenta o poder por clique em 300% mas zera a produção passiva (IPPS) por 10 segundos.', cost: new Decimal(2000000), cooldown: new Decimal(180), icon: 'fas fa-angry', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(10), effect: { clicksPerClickMultiplier: new Decimal(4), ippsMultiplier: new Decimal(0) } },
  { id: 'ecoCosmico', name: 'Eco Cósmico', description: 'Reativa a última habilidade usada com 50% do seu efeito.', cost: new Decimal(3000000), cooldown: new Decimal(240), icon: 'fas fa-redo-alt', purchased: false, cooldownRemaining: new Decimal(0), effect: { reActivateLast: true } },
];

export const EGG_FORMS_DATA: EggForm[] = [
    { id: 'dragonEgg', name: 'Ovo de Dragão', description: 'Uma casca escamosa que irradia calor intenso.', activePassive: 'Bônus Ativo: +10% PI/Clique.', collectionBonusDescription: 'Bônus de Coleção: +1% Chance Crítica.', unlockCondition: 'Alcance o Estágio "Ovo da Ascensão".', stageRequired: 3, icon: 'fas fa-dragon', activeBonus: { clicksPerClickMultiplier: new Decimal(1.10) }, collectionBonus: { criticalChanceAdditive: new Decimal(0.01) } },
    { id: 'phoenixEgg', name: 'Ovo de Fênix', description: 'Pulsa com a promessa de renascimento e poder eterno.', activePassive: 'Bônus Ativo: +20% PI/Segundo.', collectionBonusDescription: 'Bônus de Coleção: +1% Ganho de ET.', unlockCondition: 'Alcance o Estágio "Ovo Transcendente".', stageRequired: 4, icon: 'fas fa-dove', activeBonus: { ippsMultiplier: new Decimal(1.20) }, collectionBonus: { etGainMultiplier: new Decimal(1.01) } },
    { id: 'cosmicEggForm', name: 'Ovo Cósmico (Forma)', description: 'Reflete as nebulosas e a vastidão do universo.', activePassive: 'Bônus Ativo: +5% Produção Global de PI e +5% Ganho de ET.', collectionBonusDescription: 'Bônus de Coleção: +1% Redução de Custo de Bônus Transcendentais.', unlockCondition: 'Alcance o Estágio "Ovo Cósmico".', stageRequired: 5, icon: 'fas fa-meteor', activeBonus: { incubationPowerMultiplier: new Decimal(1.05), bonusETMultiplier: new Decimal(1.05) }, collectionBonus: { transcendentalBonusCostReduction: new Decimal(0.01) } },
    { id: 'abyssalEgg', name: 'Ovo Abissal', description: 'Emana uma quietude profunda e um poder insondável das profundezas.', activePassive: 'Bônus Ativo: +0.1% PI/S por segundo ocioso (máx +25%).', collectionBonusDescription: 'Bônus de Coleção: Aumenta a taxa de PI offline em +2%.', unlockCondition: 'Alcance o Estágio "Ovo do Vazio".', stageRequired: 9, icon: 'fas fa-water', activeBonus: { idleProductionBonus: { rate: new Decimal(0.001), max: new Decimal(0.25) } }, collectionBonus: { offlineIncubationRateAdditive: new Decimal(0.02) } },
    { id: 'fractalCrystalEgg', name: 'Ovo de Cristal Fractal', description: 'Sua casca reflete a luz em incontáveis padrões geométricos.', activePassive: 'Bônus Ativo: Poder por clique aumenta em +0.3% para cada melhoria regular comprada (máx +35%).', collectionBonusDescription: 'Bônus de Coleção: +1% de chance de não consumir recurso ao usar habilidades.', unlockCondition: 'Possuir 100 de cada melhoria de PI/Clique e PI/S.', stageRequired: 0, icon: 'fas fa-gem', activeBonus: { clickBonusPerRegularUpgrade: new Decimal(0.003), maxClickBonusFromUpgrades: new Decimal(0.35) }, collectionBonus: { abilityNoCostChance: new Decimal(0.01) } },
    { id: 'dreamWeaverEgg', name: 'Ovo Tecelão de Sonhos', description: 'Volutas de névoa onírica emanam de sua superfície suave.', activePassive: 'Bônus Ativo: Reduz o cooldown de todas as habilidades ativas em 5%.', collectionBonusDescription: 'Bônus de Coleção: Aumenta a duração de buffs de habilidades em +1s.', unlockCondition: 'Use 5 habilidades ativas diferentes em uma única run.', stageRequired: 0, icon: 'fas fa-cloud-moon', activeBonus: { globalAbilityCooldownReduction: new Decimal(0.05) }, collectionBonus: { abilityBuffDurationIncrease: new Decimal(1) } },
    { id: 'necroEnergyEgg', name: 'Ovo de Necroenergia', description: 'Energia escura e volátil crepita ao redor deste ovo perturbador.', activePassive: 'Bônus Ativo: Ganha +0.1% de PI/S para cada inimigo derrotado pelo embrião nesta run (máx +20%).', collectionBonusDescription: 'Bônus de Coleção: Aumenta o dano do Embrião em +2%.', unlockCondition: 'Derrote 50 inimigos com o Embrião em uma única run.', stageRequired: 0, icon: 'fas fa-skull-crossbones', activeBonus: { ippsPerEmbryoKill: new Decimal(0.001), maxIppsFromEmbryoKills: new Decimal(0.20) }, collectionBonus: { embryoDamageBonus: new Decimal(0.02) } },
    SECRET_EGG_FORM_SILENT,
];


export const TRAITS: Trait[] = [
    { id: 'swiftClicks', name: 'Cliques Velozes', description: 'Aumenta o Poder de Incubação por clique em 10%.', effect: { clicksPerClickMultiplier: new Decimal(1.10) }, icon: 'fas fa-mouse-pointer' },
    { id: 'steadyGrowth', name: 'Crescimento Estável', description: 'Aumenta a produção passiva (IPPS) em 20%.', effect: { ippsMultiplier: new Decimal(1.20) }, icon: 'fas fa-chart-line' },
    { id: 'transcendentalAffinity', name: 'Afinidade Transcendente', description: 'Aumenta o ganho de Essência Transcendente em 5%.', effect: { etGainMultiplier: new Decimal(1.05) }, icon: 'fas fa-star' },
    { id: 'porousShell', name: 'Casca Porosa', description: 'Reduz o custo da Incubadora Básica em 20%.', effect: { basicIncubatorCostReduction: new Decimal(0.20) }, icon: 'fas fa-egg' },
    { id: 'incansavel', name: 'Incansável', description: 'Aumenta a taxa de PI offline em +10% do valor base.', effect: { offlineGainRateBonus: new Decimal(0.10) }, icon: 'fas fa-bed' },
    { id: 'stoneFurnace', name: 'Forno de Pedra', description: 'A Incubadora Básica produz +2 IPPS adicional por unidade.', effect: { basicIncubatorIppsBonus: new Decimal(2) }, icon: 'fas fa-industry' },
    { id: 'noRushTrait', name: 'Sem Pressa', description: 'Aumenta a produção passiva (IPPS) em 25% mas reduz o poder por clique em 10%.', effect: { passiveIppsMultiplier: new Decimal(1.25), clicksPerClickMultiplier: new Decimal(0.90) }, icon: 'fas fa-hourglass-half' },
    { id: 'frostShell', name: 'Casca Gélida', description: 'Aumenta o poder por clique em 20% mas reduz a produção passiva (IPPS) em 20%. Cliques sem interagir por 5s congelam o bônus.', effect: { clicksPerClickMultiplier: new Decimal(1.20), ippsMultiplierDebuff: new Decimal(0.80) }, icon: 'fas fa-snowflake' },
    { id: 'linkedShells', name: 'Cascas Interligadas', description: 'Ganha +0.5 IPPS para cada tipo único de incubadora de IPPS comprada.', effect: { ippsPerUniqueIncubatorType: new Decimal(0.5) }, icon: 'fas fa-link' },
    { id: 'ancestralBreath', name: 'Sopro Ancestral', description: 'O bônus passivo de transcendência é aumentado em 0.2% adicional para cada run completa.', effect: { transcendencePassiveBonusPerRun: new Decimal(0.002) }, icon: 'fas fa-wind' },
    { id: 'voidParticle', name: 'Partícula do Vazio', description: 'Ao escolher o Caminho da Ruptura, há 3% de chance de descobrir um Segredo da Ruptura adicional.', effect: { bonusSecretDiscoveryChanceOnRupture: new Decimal(0.03) }, icon: 'fas fa-atom' },
    { id: 'quantumCore', name: 'Núcleo Quântico', description: 'A cada 60s, ativa um traço aleatório não possuído por 15s.', effect: {}, icon: 'fas fa-microchip' },
    { id: 'metabolicPulse', name: 'Pulso Metabólico', description: 'O Embrião regenera 2% do HP máximo por segundo enquanto não estiver em combate.', effect: { embryoOutOfCombatRegen: new Decimal(0.02) }, icon: 'fas fa-heartbeat' },
    SECRET_TRAIT_AUTOPHAGY,
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'firstClick', name: 'O Primeiro Passo', description: 'Clique no ovo pela primeira vez.', bonusDescription: '+5% PI por clique.', icon: 'fas fa-mouse-pointer', condition: (game) => game.totalClicksEver.gte(1), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.05) } },
    { id: 'firstUpgrade', name: 'O Despertar do Poder', description: 'Compre sua primeira melhoria.', bonusDescription: '+10% PI/S.', icon: 'fas fa-arrow-up', condition: (game) => game.hasPurchasedRegularUpgradeThisRun, unlocked: false, bonus: { ippsMultiplier: new Decimal(1.10) } },
    { id: 'eggEvolution', name: 'Evolução!', description: 'Alcance o Estágio "Ovo do Desabrochar".', bonusDescription: '+10% Produção Global de PI.', icon: 'fas fa-egg', condition: (game) => game.currentStageIndex >= 1, unlocked: false, bonus: { incubationPowerMultiplier: new Decimal(1.10) } },
    { id: 'millionaireEgg', name: 'Ovo Milionário', description: 'Acumule 1.000.000 de Poder de Incubação.', bonusDescription: 'Aumenta o ganho de Essência Transcendente em 1%.', icon: 'fas fa-coins', condition: (game) => game.incubationPower.gte(1000000), unlocked: false, bonus: { etGainMultiplier: new Decimal(1.01) } },
    { id: 'firstTranscendence', name: 'O Ciclo se Completa', description: 'Transcenda pela primeira vez.', bonusDescription: 'Desbloqueia a Forma de Ovo de Dragão.', icon: 'fas fa-infinity', condition: (game) => game.transcendenceCount.gte(1), unlocked: false, unlocksTrait: 'swiftClicks' },
    { id: 'tenTranscendences', name: 'Mestre dos Ciclos', description: 'Transcenda 10 vezes.', bonusDescription: 'Aumenta o máximo de Traços Ativos em +1.', icon: 'fas fa-sync-alt', condition: (game) => game.transcendenceCount.gte(10), unlocked: false, bonus: { maxActiveTraitsIncrease: new Decimal(1) } },
    { id: 'allEggForms', name: 'Metamorfo', description: 'Desbloqueie todas as Formas de Ovo não lendárias.', bonusDescription: 'Reduz o custo de Bônus Transcendentais em 2%.', icon: 'fas fa-mask', condition: (game) => EGG_FORMS_DATA.filter(f => !f.isLegendary).every(form => game.unlockedEggForms.includes(form.id)), unlocked: false, bonus: { transcendentalBonusCostReduction: new Decimal(0.02) } },
    { id: 'allTraits', name: 'Mente Multifacetada', description: 'Desbloqueie todos os Traços.', bonusDescription: 'Aumenta o Poder de Incubação por clique em 15%.', icon: 'fas fa-brain', condition: (game) => TRAITS.filter(t => t.id !== SECRET_TRAIT_AUTOPHAGY.id).every(trait => game.unlockedTraits.includes(trait.id)), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.15) } },
    { id: 'noUpgradeChallenge', name: 'Poder Interior', description: 'Transcenda sem comprar nenhuma melhoria regular (PI/Clique ou PI/S).', bonusDescription: 'Aumenta o ganho de Essência Transcendente em +10% permanentemente.', icon: 'fas fa-hand-rock', condition: (game) => !game.hasPurchasedRegularUpgradeThisRun && game.transcendenceCount.gte(1), unlocked: false, bonus: { etGainMultiplier: new Decimal(1.10) } },
    { id: 'clickGod', name: 'Deus do Clique', description: 'Alcance 1.000.000.000 de Poder de Incubação por clique.', bonusDescription: 'Aumenta a chance de crítico em +2%.', icon: 'fas fa-hand-pointer', condition: (game) => game.clicksPerClick.gte(1000000000), unlocked: false, bonus: { criticalChanceAdditive: new Decimal(0.02) } },
    { id: 'passiveKing', name: 'Rei Passivo', description: 'Alcance 100.000.000 de Poder de Incubação por segundo.', bonusDescription: 'Aumenta a produção passiva (IPPS) em 15%.', icon: 'fas fa-hourglass-half', condition: (game) => game.ipps.gte(100000000), unlocked: false, bonus: { ippsMultiplier: new Decimal(1.15) } },
    { id: 'completeCycle', name: 'Ciclo Completo', description: 'Complete todos os estágios do ovo.', bonusDescription: 'Reduz o custo de transcendência em 5%.', icon: 'fas fa-certificate', condition: (game) => game.currentStageIndex >= EGG_STAGES.length - 1, unlocked: false, bonus: { transcendenceCostReduction: new Decimal(0.05) } },
    { id: 'ach_plasmaClicks', name: 'Frenesi Plasmático', description: 'Clique 10.000 vezes enquanto o traço Pulso Plasmático estiver ativo.', bonusDescription: 'Efeito do Pulso Plasmático é 2x mais forte.', icon: 'fas fa-bolt', condition: (game) => game.totalClicksThisRun.gte(10000), unlocked: false, bonus: { plasmaPulseMultiplier: new Decimal(2) } }, 
    { id: 'ach_frozenTime', name: 'Tempo Congelado', description: 'Fique ocioso por 10 minutos com o traço Casca Gélida ativo.', bonusDescription: 'Bônus de clique da Casca Gélida não decai com o tempo.', icon: 'fas fa-snowflake', condition: (game) => game.activeIdleTime.gte(600), unlocked: false, bonus: { frostShellNoDecay: true } }, 
    { id: 'ach_rupturePathChosen5', name: 'Seguidor da Ruptura', description: 'Escolha o Caminho da Ruptura 5 vezes.', bonusDescription: 'Aumenta a chance de descobrir um Segredo da Ruptura adicional em +2%.', icon: 'fas fa-meteor', condition: (game) => game.rupturePathChoicesCount.gte(5), unlocked: false, bonus: { bonusSecretDiscoveryChanceOnRupture: new Decimal(0.02) } },
    { id: 'ach_quantumTranscender', name: 'Transcensor Quântico', description: 'Transcenda 10 vezes com pelo menos 5 traços diferentes ativos (incluindo o traço do Núcleo Quântico se ativo).', bonusDescription: 'A duração do traço aleatório do Núcleo Quântico aumenta em 5s.', icon: 'fas fa-atom', condition: (game) => game.runsWithFiveDifferentTraitsCount.gte(10), unlocked: false, bonus: { quantumCoreDurationIncrease: new Decimal(5) } },
    { id: 'ach_allIncubatorTypes', name: 'Magnata da Incubação', description: 'Possua pelo menos um de cada tipo de incubadora de IPPS (não oculta) simultaneamente nesta run.', bonusDescription: 'Reduz o custo de todas as incubadoras de IPPS em 5%.', icon: 'fas fa-industry-alt', condition: (game) => game.incubatorTypesOwnedThisRun.size >= INITIAL_REGULAR_UPGRADES.filter(u => u.type === 'ipps' && !u.hidden).length, unlocked: false, bonus: { ippsUpgradeCostReduction: new Decimal(0.05) } },
    { id: 'ach_20RunsCompleted', name: 'Veterano dos Ciclos', description: 'Complete 20 runs (transcendências).', bonusDescription: 'Aumenta o bônus passivo de transcendência em +0.1% adicional por transcendência.', icon: 'fas fa-history', condition: (game) => game.totalRunsTranscended.gte(20), unlocked: false, bonus: { bonusPerTranscendencePassive: new Decimal(0.001) } },
    { id: 'ach_firstBossDefeated', name: 'Matador de Gigantes', description: 'Derrote o primeiro chefe com o Embrião nesta run.', bonusDescription: 'Aumenta permanentemente o dano do Embrião contra chefes em +5%.', icon: 'fas fa-skull', condition: (game) => game.firstBossDefeatedThisRun, unlocked: false, bonus: { permanentBossDamageBonusEmbryo: new Decimal(0.05) } },
    { id: 'ach_embryoUniqueKills', name: 'Caçador Versátil', description: 'Derrote 3 tipos de inimigos diferentes com o Embrião em uma única run.', bonusDescription: 'Aumenta o ganho de EXP Modular do Embrião em +10%.', icon: 'fas fa-paw-claws', condition: (game) => game.uniqueEnemiesDefeatedThisRunByEmbryo.size >= 3, unlocked: false, bonus: { embryoModularEXPGainBonus: new Decimal(0.10) } },
    { id: 'ach_embryoLevel10ThreeTimes', name: 'Prodígio Recorrente', description: 'Alcance o nível 10 do Embrião em 3 runs diferentes.', bonusDescription: 'O Embrião começa cada run com +500 EXP Modular.', icon: 'fas fa-award', condition: (game) => game.embryoLevel10ReachedCount.gte(3), unlocked: false, bonus: { embryoStartingBonusEXP: new Decimal(500) } },
    { id: 'ach_playedDifferentTimesOfDay', name: 'Vigilante Incansável', description: 'Jogue o jogo em três períodos diferentes do dia (manhã, tarde, noite).', bonusDescription: 'Durante a noite (18:00-05:59), a produção passiva (IPPS) é aumentada em +10% (Servo do Ovo).', icon: 'fas fa-clock', condition: (game) => game.dailyLoginTracker.morning && game.dailyLoginTracker.afternoon && game.dailyLoginTracker.night, unlocked: false, bonus: { nightProductionMultiplier: new Decimal(1.10) } },
    { id: 'industrialIncubation', name: 'Incubação Industrial', description: 'Compre 100 Incubadoras Básicas.', bonusDescription: 'Desbloqueia a Incubadora Automatizada.', icon: 'fas fa-industry', condition: (game) => (game.upgradesData.find(u => u.id === 'basicIncubator')?.purchased.gte(100) ?? false), unlocked: false, unlocksUpgrade: 'automatedIncubator' },
    SECRET_ACHIEVEMENT_ATTRIBUTE_MASTER,
];

export const TRANSCENDENCE_MILESTONES_CONFIG: TranscendenceMilestoneInfo[] = [
    { count: 1, description: "Desbloqueia o uso de Traços.", rewardType: 'MAX_TRAITS_INCREASE', value: 1 },
    { count: 3, description: "Aumenta o máximo de Traços Ativos para 2.", rewardType: 'MAX_TRAITS_INCREASE', value: 1 },
    { count: 5, description: "Desbloqueia a Forma de Ovo de Fênix.", rewardType: 'UNLOCK_EGG_FORM', value: 'phoenixEgg' },
    { count: 7, description: "Aumenta o máximo de Traços Ativos para 3.", rewardType: 'MAX_TRAITS_INCREASE', value: 1 },
    { count: 10, description: "Desbloqueia a Forma de Ovo Cósmico.", rewardType: 'UNLOCK_EGG_FORM', value: 'cosmicEggForm' },
    { count: 15, description: "Aumenta os ganhos de PI offline em x2.", rewardType: 'OFFLINE_GAIN_MULTIPLIER_INCREASE', value: new Decimal(2) },
    { count: 20, description: "Desbloqueia o sistema de Melhorias Lendárias.", rewardType: 'UNLOCK_LEGENDARY_UPGRADE', value: 'illuminatedRuin' } 
];

export const INITIAL_LEGENDARY_UPGRADES: LegendaryUpgrade[] = [
    { id: 'illuminatedRuin', name: 'Ruína Iluminada', description: 'Permite ativar até 2 Formas de Ovo simultaneamente.', icon: 'fas fa-sun', effect: { setMaxActiveEggForms: new Decimal(2) }, unlockedSystem: false, activated: false },
    { id: 'echoingCore', name: 'Núcleo Ecoante', description: 'Habilidades Ativas têm 10% de chance de não consumirem recurso.', icon: 'fas fa-atom', effect: { abilityNoCostChance: new Decimal(0.10) }, unlockedSystem: false, activated: false },
    { id: 'eternalFlame', name: 'Chama Eterna', description: 'Buffs de habilidades ativas duram +20% mais tempo.', icon: 'fas fa-fire', effect: { abilityBuffDurationMultiplier: new Decimal(1.20) }, unlockedSystem: false, activated: false },
    { id: 'devourerEye', name: 'Olho do Devastador', description: 'Inimigos geram +100% XP modular, mas têm o dobro de vida.', icon: 'fas fa-eye', effect: { devourerEyeActive: true }, unlockedSystem: false, activated: false },
    { id: 'unstableFlask', name: 'Ampola da Instabilidade', description: 'A Oficina de Fusão sempre gera itens com pelo menos 1 atributo raro (efeito especial).', icon: 'fas fa-flask', effect: { unstableFlaskActive: true }, unlockedSystem: false, activated: false },
    { id: 'compounderCore', name: 'Núcleo de Capitalização Dimensional', description: 'Cada recurso depositado no banco recebe +1% de rendimento extra por run concluída (stacka).', icon: 'fas fa-coins', effect: { compounderCoreActive: true }, unlockedSystem: false, activated: false },
    { id: 'formShatterer', name: 'Explosor da Burocracia Cósmica', description: 'Permite equipar qualquer quantidade de formas de ovo. Custo de Melhorias Regulares +25% por forma adicional além da base.', icon: 'fas fa-layer-group', effect: { formShattererActive: true }, unlockedSystem: false, activated: false },
];

export const INITIAL_SACRED_RELICS: SacredRelicUpgrade[] = [
  { id: 'coracaoDoCicloPerfeito', name: 'Coração do Ciclo Perfeito', description: 'A cada transcensão, o primeiro minuto de produção tem todos os valores multiplicados por x5.', icon: 'fas fa-sync-alt text-amber-400', obtained: false },
  { id: 'nucleoDoTempoEstagnado', name: 'Núcleo do Tempo Estagnado', description: 'Toda vez que o jogador ficar 5 minutos inativo, o IPPS é multiplicado por +300% por 60s.', icon: 'fas fa-hourglass-half text-sky-400', obtained: false },
  { id: 'incandescenciaDaFenixPrimordial', name: 'Incandescência da Fênix Primordial', description: 'Sempre que uma habilidade é ativada, os próximos 10 cliques são críticos garantidos.', icon: 'fas fa-fire-alt text-orange-500', obtained: false },
  { id: 'coroaDaCascaLendaria', name: 'Coroa da Casca Lendária', description: 'Toda melhoria de estágio agora concede +10% de produção adicional cumulativo.', icon: 'fas fa-crown text-yellow-300', obtained: false },
  { id: 'ovoDoTempoCondensado', name: 'Ovo do Tempo Condensado', description: 'Reduz em 25% todos os tempos de espera de cooldown de habilidades.', icon: 'fas fa-stopwatch-20 text-cyan-400', obtained: false },
  { id: 'codigoDoCofreCosmico', name: 'Código do Cofre Cósmico', description: 'Sempre que transcender, armazena +1% do valor de PI da run anterior no Banco Cósmico.', icon: 'fas fa-vault text-yellow-500', obtained: false },
  { id: 'nucleoDeJurosInfinitos', name: 'Núcleo de Juros Infinitos', description: 'O Banco Cósmico gera +0.05% de PI por segundo, com base no valor total de PI armazenado.', icon: 'fas fa-cubes-stacked text-yellow-400', obtained: false },
  { id: 'eloGeneticoRecorrente', name: 'Elo Genético Recorrente', description: 'Toda vez que o Ovo Embrionário subir de nível, você recebe um bônus permanente de +0.5% de PI/s cumulativo.', icon: 'fas fa-dna text-amber-300', obtained: false },
];

export const INITIAL_SECRET_RUPTURE_UPGRADES: SecretRuptureUpgrade[] = [
    { id: 'firstSecret', name: 'Sussurro da Ruptura', description: 'A cada 1000 cliques, ganha +1 Essência Transcendente.', icon: 'fas fa-comment-dots', effectType: 'etOnSpecificClicks', obtained: false },
    { id: 'inverseFlame', name: 'Chama Inversa', description: 'Quanto menor seu PI (abaixo de 1M), maior seu bônus de produção global (até +100%).', icon: 'fas fa-fire-alt', effectType: 'inversePIProductionBonus', obtained: false, params: { basePIForBonus: new Decimal(1000000), piChunkForBonus: new Decimal(100000), percentPerChunk: new Decimal(0.10)} },
    { id: 'leadKey', name: 'Chave de Chumbo', description: 'Pode ser usada a cada 24 horas para ganhar +1 Ovo Temporário.', icon: 'fas fa-key', effectType: 'unlocksDailyTempEggButton', obtained: false },
    { id: 'titheRitual', name: 'Ritual do Dízimo', description: 'A cada 12 horas, sacrifique 50% dos níveis de todas as Melhorias Regulares para ganhar +1 Ovo Temporário.', icon: 'fas fa-hand-holding-water', effectType: 'unlocksSacrificeRitualButton', obtained: false },
    { id: 'finalEcho', name: 'Eco Final', description: 'Cliques Críticos têm 5% de chance de aplicar seu efeito novamente.', icon: 'fas fa-volume-up', effectType: 'critEchoChance', obtained: false, params: { critEchoTriggerChance: new Decimal(0.05) } },
    { id: 'stellarSparkSecret', name: 'Fagulha Estelar Secreta', description: 'Se ocioso por mais de 60s, a produção passiva aumenta em +100%.', icon: 'fas fa-star-half-alt', effectType: 'longIdlePassiveBoost', obtained: false, params: {idleThresholdSeconds: new Decimal(60), bonusMultiplier: new Decimal(1)} },
    { id: 'theLastTrait', name: 'O Último Traço', description: 'Ao ser descoberto, concede aleatoriamente um Traço ainda não desbloqueado e o ativa.', icon: 'fas fa-question', effectType: 'extraRandomTrait', obtained: false },
];

export const GAME_SAVE_KEY = 'ovoClickerReactGame_EggTeamBattle_ExpeditionSystem_v1.4';
export const FINAL_EGG_THRESHOLD = EGG_STAGES[EGG_STAGES.length - 1].threshold;
export const ESSENCE_PER_PI = new Decimal(10000); 
export const BASE_TRANSCENDENCE_THRESHOLD = new Decimal(50000); 
export const SOFT_CAP_THRESHOLD_CPC = new Decimal(1e12);
export const SOFT_CAP_THRESHOLD_IPPS = new Decimal(1e12);
export const SOFT_CAP_SCALING_FACTOR = new Decimal(0.85);
export const IDLE_TIMEOUT_MS = 60000; 
export const MAX_OFFLINE_SECONDS = new Decimal(28800); // 8 hours
export const FAGULHA_ESTELAR_IDLE_THRESHOLD_SECONDS = new Decimal(60);
export const FAGULHA_ESTELAR_BONUS_MULTIPLIER = new Decimal(1);
export const CHAMA_INVERSA_MAX_PI_FOR_BONUS = new Decimal(1000000);
export const CHAMA_INVERSA_PI_CHUNK = new Decimal(100000);
export const CHAMA_INVERSA_PERCENT_PER_CHUNK = new Decimal(0.10);
export const ESSENCE_PATH_BONUS_ET = new Decimal(5);
export const RUPTURE_PATH_BUFF_DURATION_SECONDS = new Decimal(300); 
export const RUPTure_PATH_BUFF_GLOBAL_MULTIPLIER = new Decimal(2); 
export const TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS = new Decimal(300); 
export const TITHE_RITUAL_COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours
export const TITHE_RITUAL_SACRIFICE_PERCENTAGE = new Decimal(0.50); // 50%
export const LEAD_KEY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
export const REEXPORT_SECRET_TRAIT_AUTOPHAGY = SECRET_TRAIT_AUTOPHAGY;

export const EMBRYO_INITIAL_ICON = 'fas fa-baby-carriage';
export const EMBRYO_BASE_STATS_PER_LEVEL: Partial<EmbryoStats> = {
    maxHp: new Decimal(20),
    attack: new Decimal(2),
    defense: new Decimal(1),
    speed: new Decimal(0.5),
    critChance: new Decimal(0.001), 
    poisonChance: new Decimal(0.0005),
    poisonDurationSeconds: new Decimal(0.1), 
    bossDamageBonus: new Decimal(0.002),
    doubleHitChance: new Decimal(0.0003),
    lifestealRate: new Decimal(0.0001),
    chaosEffectChance: new Decimal(0.0002),
    enemyDelayChance: new Decimal(0.0002),
    damageReflection: new Decimal(0.0001),
    critResistance: new Decimal(0.0003),
    periodicShieldValue: new Decimal(0.5),
    dodgeChance: new Decimal(0.0002),
    overallDamageReduction: new Decimal(0.0001),
    hpRegenPerInterval: new Decimal(0.0005),
    hpRegenPerMinute: new Decimal(0.1), 
    modularExpGainMultiplier: new Decimal(0.001), 
    shieldOnXpFull: new Decimal(5), 
    outgoingDamageMultiplier: new Decimal(0.001), 
    embryoIpps: new Decimal(0.05),
    embryoClicksPerClick: new Decimal(0.05),
    maxShield: new Decimal(5),
    critDamageMultiplier: new Decimal(0),
    positiveChaosEffectDuplicationChance: new Decimal(0),
};
export const EMBRYO_LEVEL_MILESTONES: EmbryoLevelMilestone[] = [
  { level: 1, expRequired: new Decimal(100), icon: 'fas fa-egg-fried', nameSuffix: "Neófito" },
  { level: 5, expRequired: new Decimal(1000), icon: 'fas fa-child', nameSuffix: "Desperto" },
  { level: 10, expRequired: new Decimal(5000), icon: 'fas fa-feather-alt', nameSuffix: "Alado" },
  { level: 15, expRequired: new Decimal(20000), icon: 'fas fa-dragon', nameSuffix: "Dracônico" },
  { level: 20, expRequired: new Decimal(50000), icon: 'fas fa-ghost', nameSuffix: "Etéreo" },
  { level: 25, expRequired: new Decimal(100000), icon: 'fas fa-star-of-life', nameSuffix: "Cósmico"},
  { level: 30, expRequired: new Decimal(250000), icon: 'fas fa-infinity', nameSuffix: "Infinito" }
];
export const INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL = EMBRYO_LEVEL_MILESTONES[0].expRequired;
export const EMBRYO_EXP_SCALING_FACTOR = new Decimal(1.35);

export const INITIAL_EMBRYO_UPGRADES: EmbryoUpgrade[] = [
    { id: 'embryoAttackBoost', name: 'Pulso Ofensivo', description: 'Aumenta o ataque do embrião em +2 por nível.', icon: 'fas fa-sword', baseCost: new Decimal(100), costMultiplier: new Decimal(1.5), purchased: new Decimal(0), effect: { attack: new Decimal(2) }, maxLevel: new Decimal(20) },
    { id: 'embryoDefenseBoost', name: 'Carapaça Reforçada', description: 'Aumenta a defesa do embrião em +1 por nível.', icon: 'fas fa-shield-alt', baseCost: new Decimal(100), costMultiplier: new Decimal(1.5), purchased: new Decimal(0), effect: { defense: new Decimal(1) }, maxLevel: new Decimal(20) },
    { id: 'embryoHpBoost', name: 'Vitalidade Nascente', description: 'Aumenta o HP máximo do embrião em +10 por nível.', icon: 'fas fa-heart', baseCost: new Decimal(100), costMultiplier: new Decimal(1.5), purchased: new Decimal(0), effect: { maxHp: new Decimal(10) }, maxLevel: new Decimal(20) },
    { id: 'embryoCritChance', name: 'Instinto Predatório', description: 'Aumenta a chance de crítico do embrião em +0.5%.', icon: 'fas fa-crosshairs', cost: new Decimal(500), purchased: new Decimal(0), effect: { criticalChanceAdditive: new Decimal(0.005) } },
    { id: 'embryoClickEcho', name: 'Eco da Casca', description: 'Seus cliques têm 5% de chance de ecoar com 50% do poder.', icon: 'fas fa-volume-up', cost: new Decimal(1000), purchased: new Decimal(0), effect: { clickEchoChance: new Decimal(0.05), clickEchoMultiplier: new Decimal(0.5) } },
    { id: 'embryoPassiveIpps', name: 'Sinergia Vital', description: 'O Embrião adiciona +5 PI/S à sua produção.', icon: 'fas fa-link', cost: new Decimal(2000), purchased: new Decimal(0), effect: { ipps: new Decimal(5) } },
    { id: 'embryoEXPMultiplier', name: 'Aprendizado Acelerado', description: 'Aumenta o ganho de EXP Modular do Embrião em 10%.', icon: 'fas fa-graduation-cap', cost: new Decimal(1500), purchased: new Decimal(0), effect: { modularEXPGainMultiplier: new Decimal(0.10) } },
    { id: 'embryoVitalPulse', name: 'Pulso Vital', description: 'Ganha +0.1 IPPS adicional por nível do Embrião.', icon: 'fas fa-heartbeat', cost: new Decimal(2500), purchased: new Decimal(0), effect: { bonusPIPerEmbryoLevel: new Decimal(0.1) } },
    { id: 'embryoUpgradeCostReduction', name: 'Membrana Adaptativa', description: 'Reduz o custo de Melhorias Regulares em 1%.', icon: 'fas fa-tags', cost: new Decimal(3000), purchased: new Decimal(0), effect: { regularUpgradeCostReduction: new Decimal(0.01) } },
];

export const ENEMY_PLACEHOLDER_ICONS = ['fas fa-bug', 'fas fa-spider', 'fas fa-ghost', 'fas fa-eye', 'fas fa-biohazard'];
export const BOSS_PLACEHOLDER_ICONS = ['fas fa-dragon', 'fas fa-pastafarianism', 'fas fa-ankh', 'fas fa-meteor', 'fas fa-chess-king'];
export const BOSS_INTERVAL = new Decimal(5);
export const BASE_ENEMY_HP = new Decimal(100);
export const ENEMY_HP_SCALING_FACTOR = new Decimal(1.2);
export const BOSS_HP_MULTIPLIER = new Decimal(5);
export const COMBAT_FEEDBACK_MESSAGES = ["Golpe!", "Impacto!", "Atingido!", "Corte!", "Pancada!"];
export const ENEMY_EXP_DIVISOR = new Decimal(5); 
export const BOSS_EXP_MULTIPLIER = new Decimal(3); 
export const BASE_ENEMY_ATTACK = new Decimal(10);
export const ENEMY_ATTACK_SCALING_FACTOR = new Decimal(1.1);
export const BASE_ENEMY_DEFENSE = new Decimal(2);
export const ENEMY_DEFENSE_SCALING_FACTOR = new Decimal(1.08);
export const BASE_ENEMY_SPEED = new Decimal(5);
export const ENEMY_SPEED_SCALING_FACTOR = new Decimal(1.05);
export const BASE_ENEMY_CRIT_CHANCE = new Decimal(0.05);
export const BASE_ENEMY_CRIT_DAMAGE_MULTIPLIER = new Decimal(1.5);
export const BASE_ENEMY_DODGE_CHANCE = new Decimal(0.05);
export const BOSS_STAT_MULTIPLIER = new Decimal(1.5);
export const ENEMY_BASE_ATTACK_INTERVAL_SECONDS = new Decimal(3); 

export const INITIAL_EMBRYO_SHOP_ITEMS: EmbryoItem[] = [
    // Existing Items (converted to new cost format)
    { id: 'chip_ataque_c', name: 'Chip de Ataque (C)', description: '+2 Ataque', icon: 'fas fa-fist-raised text-red-400', rarity: 'Common', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(50)}], effects: [{ stat: 'attack', value: new Decimal(2), type: 'flat' }], instanceId: 'shop_chip_ataque_c' },
    { id: 'chip_critico_r', name: 'Chip de Crítico (R)', description: '+3% Chance Crítica', icon: 'fas fa-crosshairs text-yellow-400', rarity: 'Rare', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(250)}], effects: [{ stat: 'critChance', value: new Decimal(0.03), type: 'flat' }], instanceId: 'shop_chip_critico_r' },
    { id: 'chip_defesa_c', name: 'Chip de Defesa (C)', description: '+2 Defesa', icon: 'fas fa-shield-alt text-blue-400', rarity: 'Common', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(50)}], effects: [{ stat: 'defense', value: new Decimal(2), type: 'flat' }], instanceId: 'shop_chip_defesa_c' },
    { id: 'chip_hp_r', name: 'Chip de HP (R)', description: '+20 HP Máx', icon: 'fas fa-heart text-green-400', rarity: 'Rare', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(200)}], effects: [{ stat: 'maxHp', value: new Decimal(20), type: 'flat' }], instanceId: 'shop_chip_hp_r' },
    { id: 'chip_exp_c', name: 'Chip de EXP (C)', description: '+5% Ganho EXP Modular', icon: 'fas fa-flask text-emerald-400', rarity: 'Common', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'modularEXP', amount: new Decimal(100)}], effects: [{ stat: 'modularExpGainMultiplier', value: new Decimal(0.05), type: 'flat' }], instanceId: 'shop_chip_exp_c' },
    { id: 'chip_ipps_r', name: 'Chip de IPPS Embrião (R)', description: '+0.5 IPPS base do Embrião', icon: 'fas fa-robot text-sky-400', rarity: 'Rare', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'modularEXP', amount: new Decimal(300)}], effects: [{ stat: 'embryoIpps', value: new Decimal(0.5), type: 'flat' }], instanceId: 'shop_chip_ipps_r' },
    { id: 'acessorio_velocidade_e', name: 'Amuleto da Brisa (E)', description: '+5 Velocidade, +2% Esquiva', icon: 'fas fa-feather-alt text-cyan-300', rarity: 'Epic', equipmentType: 'SpecialAccessory', storeCategory: 'Especial', cost: [{ currency: 'incubationPower', amount: new Decimal(500000)}], effects: [{ stat: 'speed', value: new Decimal(5), type: 'flat' }, { stat: 'dodgeChance', value: new Decimal(0.02), type: 'flat' }], instanceId: 'shop_acessorio_velocidade_e' },
    { id: 'acessorio_regeneracao_l', name: 'Orbe da Alma Viva (L)', description: '+5% Regeneração de HP por intervalo, +20% HP Máx.', icon: 'fas fa-seedling text-lime-300', rarity: 'Legendary', equipmentType: 'SpecialAccessory', storeCategory: 'Especial', cost: [{ currency: 'transcendentEssence', amount: new Decimal(50)}], effects: [{ stat: 'hpRegenPerInterval', value: new Decimal(0.05), type: 'flat' }, { stat: 'maxHp', value: new Decimal(0.20), type: 'percent_base' }], instanceId: 'shop_acessorio_regeneracao_l' },

    // New Items
    // Ofensivo
    { id: 'espinho_incubador_c', name: 'Espinho Incubador', description: '+5 Ataque', icon: 'fas fa-bone text-red-300', rarity: 'Common', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(100)}], effects: [{ stat: 'attack', value: new Decimal(5), type: 'flat' }], instanceId: 'shop_espinho_incubador_c' },
    { id: 'glandula_toxica_r', name: 'Glândula Tóxica', description: '+10% Chance Veneno, +2s Duração Veneno', icon: 'fas fa-biohazard text-lime-400', rarity: 'Rare', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(300)}], effects: [{ stat: 'poisonChance', value: new Decimal(0.10), type: 'flat' }, { stat: 'poisonDurationSeconds', value: new Decimal(2), type: 'flat' }], instanceId: 'shop_glandula_toxica_r' },
    { id: 'olho_critica_e', name: 'Olho da Crítica', description: '+10% Chance Crítica, +5% Dano Crítico', icon: 'fas fa-eye text-yellow-300', rarity: 'Epic', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(800)}], effects: [{ stat: 'critChance', value: new Decimal(0.10), type: 'flat' }, { stat: 'critDamageMultiplier', value: new Decimal(0.05), type: 'flat' }], instanceId: 'shop_olho_critica_e' },
    { id: 'nucleo_gemeo_espiritual_l', name: 'Núcleo do Gêmeo Espiritual', description: '+25% Chance de Golpe Duplo', icon: 'fas fa-clone text-sky-300', rarity: 'Legendary', equipmentType: 'SpecialAccessory', storeCategory: 'Ofensivo', cost: [{ currency: 'transcendentEssence', amount: new Decimal(10)}, { currency: 'modularEXP', amount: new Decimal(1000)}], effects: [{ stat: 'doubleHitChance', value: new Decimal(0.25), type: 'flat' }], instanceId: 'shop_nucleo_gemeo_espiritual_l' },

    // Defensivo
    { id: 'casca_endurecida_c', name: 'Casca Endurecida', description: '+4 Defesa', icon: 'fas fa-shield-halved text-gray-300', rarity: 'Common', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(100)}], effects: [{ stat: 'defense', value: new Decimal(4), type: 'flat' }], instanceId: 'shop_casca_endurecida_c' },
    { id: 'membrana_reflexiva_r', name: 'Membrana Reflexiva', description: '+10% Reflexão de Dano, +5% Redução de Dano Geral', icon: 'fas fa-shield-virus text-teal-300', rarity: 'Rare', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(500)}], effects: [{ stat: 'damageReflection', value: new Decimal(0.10), type: 'flat' }, { stat: 'overallDamageReduction', value: new Decimal(0.05), type: 'flat' }], instanceId: 'shop_membrana_reflexiva_r' },
    { id: 'sangue_fenix_e', name: 'Sangue de Fênix', description: '+15% Roubo de Vida, +10% Regeneração de HP', icon: 'fas fa-heart-pulse text-rose-300', rarity: 'Epic', equipmentType: 'SpecialAccessory', storeCategory: 'Defensivo', cost: [{ currency: 'modularEXP', amount: new Decimal(1200)}], effects: [{ stat: 'lifestealRate', value: new Decimal(0.15), type: 'flat' }, { stat: 'hpRegenPerInterval', value: new Decimal(0.10), type: 'flat' }], instanceId: 'shop_sangue_fenix_e' },
    { id: 'escudo_ootramita_l', name: 'Escudo de Ootramita', description: '+50 Escudo Máximo, +20 Valor Escudo Periódico', icon: 'fas fa-shield-check text-blue-300', rarity: 'Legendary', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: [{ currency: 'transcendentEssence', amount: new Decimal(30)}, { currency: 'modularEXP', amount: new Decimal(1400)}], effects: [{ stat: 'maxShield', value: new Decimal(50), type: 'flat' }, { stat: 'periodicShieldValue', value: new Decimal(20), type: 'flat' }], instanceId: 'shop_escudo_ootramita_l' },

    // Passivo
    { id: 'incensario_eliptico_c', name: 'Incensário Elíptico', description: '+10% Multiplicador de EXP Modular', icon: 'fas fa-mortar-pestle text-amber-300', rarity: 'Common', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'modularEXP', amount: new Decimal(150)}], effects: [{ stat: 'modularExpGainMultiplier', value: new Decimal(0.10), type: 'flat' }], instanceId: 'shop_incensario_eliptico_c' },
    { id: 'cristal_ovular_r', name: 'Cristal Ovular', description: '+1 IPPS do Embrião', icon: 'fas fa-gem text-white', rarity: 'Rare', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'modularEXP', amount: new Decimal(400)}], effects: [{ stat: 'embryoIpps', value: new Decimal(1), type: 'flat' }], instanceId: 'shop_cristal_ovular_r' },
    { id: 'ampulheta_barreira_e', name: 'Ampulheta da Barreira', description: 'Ganha escudo quando enche a barra de EXP +15 Valor', icon: 'fas fa-hourglass-half text-cyan-300', rarity: 'Epic', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'modularEXP', amount: new Decimal(1000)}], effects: [{ stat: 'shieldOnXpFull', value: new Decimal(15), type: 'flat' }], instanceId: 'shop_ampulheta_barreira_e' },
    { id: 'totem_cascas_l', name: 'Totem das Cascas', description: '+100% EXP Modular, +50% PI por Clique do Embrião', icon: 'fas fa-layer-group text-yellow-300', rarity: 'Legendary', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: [{ currency: 'transcendentEssence', amount: new Decimal(25)}, { currency: 'modularEXP', amount: new Decimal(1300)}], effects: [{ stat: 'modularExpGainMultiplier', value: new Decimal(1.00), type: 'flat' }, { stat: 'embryoClicksPerClick', value: new Decimal(0.50), type: 'percent_base' }], instanceId: 'shop_totem_cascas_l' },

    // Especial
    { id: 'semente_anomalia_r', name: 'Semente da Anomalia', description: '+15% de Chance de Efeito Caótico', icon: 'fas fa-question text-fuchsia-400', rarity: 'Rare', equipmentType: 'SpecialAccessory', storeCategory: 'Especial', cost: [{ currency: 'incubationPower', amount: new Decimal(2000)}, { currency: 'modularEXP', amount: new Decimal(100)}], effects: [{ stat: 'chaosEffectChance', value: new Decimal(0.15), type: 'flat' }], instanceId: 'shop_semente_anomalia_r' },
    { id: 'ampola_tempo_rachado_e', name: 'Ampola de Tempo Rachado', description: '+25% Chance de Atrasar Inimigo, +10 Velocidade', icon: 'fas fa-stopwatch-20 text-indigo-400', rarity: 'Epic', equipmentType: 'SpecialAccessory', storeCategory: 'Especial', cost: [{ currency: 'incubationPower', amount: new Decimal(5000)}, { currency: 'modularEXP', amount: new Decimal(500)}], effects: [{ stat: 'enemyDelayChance', value: new Decimal(0.25), type: 'flat' }, { stat: 'speed', value: new Decimal(10), type: 'flat' }], instanceId: 'shop_ampola_tempo_rachado_e' },
    { id: 'coroa_ouroborus_l', name: 'Coroa de Ouroborus', description: '5% de chance de efeito caótico positivo duplicado', icon: 'fas fa-infinity text-green-300', rarity: 'Legendary', equipmentType: 'SpecialAccessory', storeCategory: 'Especial', cost: [{ currency: 'transcendentEssence', amount: new Decimal(80)}, { currency: 'modularEXP', amount: new Decimal(1000)}], effects: [{ stat: 'positiveChaosEffectDuplicationChance', value: new Decimal(0.05), type: 'flat' }], instanceId: 'shop_coroa_ouroborus_l' },
];

export const RARITY_COLORS_EMBRYO: { [key in EmbryoItemRarity]: { text: string, border: string, bg: string, shadow?: string, nameColor?: string, badgeBg?: string, badgeText?: string } } = {
  'Common': { text: 'text-slate-300', border: 'border-slate-500', bg: 'bg-slate-700/50', shadow: 'shadow-slate-600/30', nameColor: 'text-slate-200', badgeBg: 'bg-slate-600', badgeText: 'text-slate-200' },
  'Uncommon': { text: 'text-green-400', border: 'border-green-600', bg: 'bg-green-800/50', shadow: 'shadow-green-700/30', nameColor: 'text-green-300', badgeBg: 'bg-green-700', badgeText: 'text-green-200' },
  'Rare': { text: 'text-blue-400', border: 'border-blue-600', bg: 'bg-blue-800/50', shadow: 'shadow-blue-700/30', nameColor: 'text-blue-300', badgeBg: 'bg-blue-700', badgeText: 'text-blue-200' },
  'Epic': { text: 'text-purple-400', border: 'border-purple-600', bg: 'bg-purple-800/50', shadow: 'shadow-purple-700/30', nameColor: 'text-purple-300', badgeBg: 'bg-purple-700', badgeText: 'text-purple-200' },
  'Legendary': { text: 'text-orange-400', border: 'border-orange-600', bg: 'bg-orange-800/50', shadow: 'shadow-orange-700/30', nameColor: 'text-orange-300', badgeBg: 'bg-orange-700', badgeText: 'text-orange-200' },
  'Mythic': { text: 'text-red-400', border: 'border-red-600', bg: 'bg-red-800/50', shadow: 'shadow-red-700/40', nameColor: 'text-red-300', badgeBg: 'bg-red-700', badgeText: 'text-red-200' },
  'Ultra-Mythic': { text: 'text-yellow-300', border: 'border-yellow-500', bg: 'bg-yellow-700/50', shadow: 'shadow-yellow-600/50 shadow-lg', nameColor: 'text-yellow-200', badgeBg: 'bg-yellow-600', badgeText: 'text-yellow-100' },
};

export const COLLECTIBLE_EGG_RARITY_STYLES: { [key in CollectibleEggDisplayRarity]: { text: string, border: string, bg: string, shadow?: string, nameColor?: string, badgeBg?: string, badgeText?: string } } = {
  'Comum': { text: 'text-slate-300', border: 'border-slate-500', bg: 'bg-slate-700/50', shadow: 'shadow-slate-600/30', nameColor: 'text-slate-200', badgeBg: 'bg-slate-600', badgeText: 'text-slate-200' },
  'Raro': { text: 'text-sky-400', border: 'border-sky-600', bg: 'bg-sky-800/50', shadow: 'shadow-sky-700/30', nameColor: 'text-sky-300', badgeBg: 'bg-sky-700', badgeText: 'text-sky-200' },
  'Épico': { text: 'text-fuchsia-400', border: 'border-fuchsia-600', bg: 'bg-fuchsia-800/50', shadow: 'shadow-fuchsia-700/30', nameColor: 'text-fuchsia-300', badgeBg: 'bg-fuchsia-700', badgeText: 'text-fuchsia-200' },
  'Lendário': { text: 'text-amber-400', border: 'border-amber-600', bg: 'bg-amber-800/50', shadow: 'shadow-amber-700/40', nameColor: 'text-amber-300', badgeBg: 'bg-amber-700', badgeText: 'text-amber-200' },
  'Mítico': { text: 'text-rose-400', border: 'border-rose-600', bg: 'bg-rose-800/50', shadow: 'shadow-rose-600/50 shadow-lg', nameColor: 'text-rose-300', badgeBg: 'bg-rose-700', badgeText: 'text-rose-200' },
};

export const BATTLE_EGG_RARITY_STYLES: { [key in BattleEggRarity]: { text: string, border: string, bg: string, nameColor?: string } } = {
  'Common': { text: 'text-slate-300', border: 'border-slate-500', bg: 'bg-slate-700/30', nameColor: 'text-slate-200' },
  'Uncommon': { text: 'text-green-400', border: 'border-green-600', bg: 'bg-green-800/30', nameColor: 'text-green-300' },
  'Rare': { text: 'text-blue-400', border: 'border-blue-600', bg: 'bg-blue-800/30', nameColor: 'text-blue-300' },
  'Epic': { text: 'text-purple-400', border: 'border-purple-600', bg: 'bg-purple-800/30', nameColor: 'text-purple-300' },
  'Legendary': { text: 'text-orange-400', border: 'border-orange-600', bg: 'bg-orange-800/30', nameColor: 'text-orange-300' },
  'Mythic': { text: 'text-red-400', border: 'border-red-600', bg: 'bg-red-800/40', nameColor: 'text-red-300' },
  'Ultra-Mythic': { text: 'text-yellow-300', border: 'border-yellow-500', bg: 'bg-yellow-700/50', nameColor: 'text-yellow-200' },
  'Elite': { text: 'text-cyan-300', border: 'border-cyan-500', bg: 'bg-cyan-700/40', nameColor: 'text-cyan-200' },
  'Boss': { text: 'text-rose-400', border: 'border-rose-600', bg: 'bg-rose-800/50', nameColor: 'text-rose-300' },
  'Player': { text: 'text-sky-300', border: 'border-sky-500', bg: 'bg-sky-700/30', nameColor: 'text-sky-200' },
};

// Expedition Constants
export const EXPEDITION_MAX_STAGES = 10; 

// Expedition Rework
export const EXPEDITION_STAGES_CONFIG: { stage: number; name: string; theme: string; enemies: BattleEgg[]; modifiers?: string[] }[] = [
    { 
        stage: 1, name: "Fendas de Gema Invertida", theme: "Fragmentos de incubação instável", 
        enemies: [ 
            { instanceId: 'exp1_e1', definitionId: 'exp_wandering_shell', name: 'Casca Errante', icon: 'fas fa-egg-crack text-stone-400', currentHp: new Decimal(80), maxHp: new Decimal(80), level: 1, rarity: 'Common', baseAttack: new Decimal(10), baseDefense: new Decimal(5), baseSpeed: new Decimal(8), currentAttack: new Decimal(10), currentDefense: new Decimal(5), currentSpeed: new Decimal(8), statusEffects: [{ instanceId:'se_ondeath_1', definitionId: 'se_custom_on_death_explode', name: 'Instável', icon: 'fas fa-bomb', description: 'Explode ao morrer, causando 15 de dano a todos os inimigos.', type: 'debuff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(15)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_basic_attack', name: 'Pancada', icon:'fas fa-fist-raised', currentCooldownTurns: 0}] },
            { instanceId: 'exp1_e2', definitionId: 'exp_ovoid_void', name: 'Vazio Ovoide', icon: 'fas fa-circle-notch text-purple-400', currentHp: new Decimal(65), maxHp: new Decimal(65), level: 1, rarity: 'Common', baseAttack: new Decimal(8), baseDefense: new Decimal(8), baseSpeed: new Decimal(12), currentAttack: new Decimal(8), currentDefense: new Decimal(8), currentSpeed: new Decimal(12), statusEffects: [{ instanceId:'se_dodge_1', definitionId: 'se_custom_dodge_50', name: 'Esquivo', icon: 'fas fa-ghost', description: '50% de chance de esquivar de ataques e habilidades.', type: 'buff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(0.5)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_basic_attack', name: 'Toque Etéreo', icon:'fas fa-hand-sparkles', currentCooldownTurns: 0}] },
        ]
    },
    { 
        stage: 2, name: "Bosque de Esporos Sussurrantes", theme: "Contaminação e veneno", 
        enemies: [
            { instanceId: 'exp2_e1', definitionId: 'exp_voracious_mycelium', name: 'Micélio Voraz', icon: 'fas fa-spaghetti-monster-flying text-lime-500', currentHp: new Decimal(100), maxHp: new Decimal(100), level: 2, rarity: 'Uncommon', baseAttack: new Decimal(12), baseDefense: new Decimal(10), baseSpeed: new Decimal(9), currentAttack: new Decimal(12), currentDefense: new Decimal(10), currentSpeed: new Decimal(9), statusEffects: [{ instanceId:'se_ondeath_2', definitionId: 'se_custom_on_death_poison', name: 'Esporos Finais', icon: 'fas fa-skull-crossbones', description: 'Aplica Veneno a todos os inimigos ao morrer.', type: 'debuff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(0)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_fungal_paralyzing_spores', name: 'Sopro Tóxico', icon:'fas fa-wind', currentCooldownTurns: 0}] },
            { instanceId: 'exp2_e2', definitionId: 'exp_putrid_filament', name: 'Filamento Pútrido', icon: 'fas fa-bacterium text-green-700', currentHp: new Decimal(85), maxHp: new Decimal(85), level: 2, rarity: 'Uncommon', baseAttack: new Decimal(10), baseDefense: new Decimal(12), baseSpeed: new Decimal(11), currentAttack: new Decimal(10), currentDefense: new Decimal(12), currentSpeed: new Decimal(11), statusEffects: [{ instanceId:'se_regen_1', definitionId: 'se_regen_5hp', name: 'Regeneração', icon: 'fas fa-heart-pulse', description: 'Regenera 5 de HP por turno.', type: 'buff', effectType: 'heal_over_time', remainingDurationTurns: 99, currentPotency: new Decimal(5)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_basic_attack', name: 'Toque Pútrido', icon:'fas fa-hand-dots', currentCooldownTurns: 0}] },
        ]
    },
    { 
        stage: 3, name: "Ruínas do Ovo-Esquecido", theme: "Antigos guardiões", 
        enemies: [
            { instanceId: 'exp3_e1', definitionId: 'exp_ancient_guardian', name: 'Guardião Antigo', icon: 'fas fa-shield-halved text-stone-500', currentHp: new Decimal(200), maxHp: new Decimal(200), level: 3, rarity: 'Elite', baseAttack: new Decimal(18), baseDefense: new Decimal(20), baseSpeed: new Decimal(10), currentAttack: new Decimal(18), currentDefense: new Decimal(20), currentSpeed: new Decimal(10), statusEffects: [{ instanceId:'se_armor_1', definitionId: 'se_defense_buff_major', name: 'Armadura Rúnica', icon: 'fas fa-shield-alt', description: 'Defesa massivamente aumentada.', type: 'buff', effectType: 'stat_change_multiply', statToChange: 'defense', currentPotency: new Decimal(0.5), remainingDurationTurns: 99}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_strong_hit', name: 'Golpe de Ruína', icon:'fas fa-hammer', currentCooldownTurns: 0}] },
            { instanceId: 'exp3_e2', definitionId: 'exp_echoing_spirit', name: 'Espírito Ecoante', icon: 'fas fa-ghost text-cyan-300', currentHp: new Decimal(150), maxHp: new Decimal(150), level: 3, rarity: 'Elite', baseAttack: new Decimal(15), baseDefense: new Decimal(15), baseSpeed: new Decimal(14), currentAttack: new Decimal(15), currentDefense: new Decimal(15), currentSpeed: new Decimal(14), statusEffects: [{ instanceId:'se_echo_1', definitionId: 'se_custom_crit_reflect', name: 'Eco Doloroso', icon: 'fas fa-undo', description: 'Reflete 25% do dano de acertos críticos.', type: 'buff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(0.25) }], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_void_mind_blast', name: 'Lamento Etéreo', icon:'fas fa-waveform', currentCooldownTurns: 0}] }
        ],
        modifiers: ['Blindado', 'Ecoante', 'Acelerado']
    },
    { 
        stage: 4, name: "Cripta do Silêncio Branco", theme: "Imobilidade e resistência", 
        enemies: [
            { instanceId: 'exp4_e1', definitionId: 'exp_embryonic_statue', name: 'Estátua Embrionária', icon: 'fas fa-statue text-gray-400', currentHp: new Decimal(140), maxHp: new Decimal(140), level: 4, rarity: 'Rare', baseAttack: new Decimal(15), baseDefense: new Decimal(25), baseSpeed: new Decimal(5), currentAttack: new Decimal(15), currentDefense: new Decimal(25), currentSpeed: new Decimal(5), statusEffects: [{ instanceId:'se_immune_1', definitionId: 'se_custom_immune_dots_stuns', name: 'Impassível', icon: 'fas fa-shield-halved', description: 'Imune a Sangramento, Veneno e Atordoamento.', type: 'buff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(1)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_strong_hit', name: 'Golpe de Mármore', icon:'fas fa-hammer', currentCooldownTurns: 0}] },
            { instanceId: 'exp4_e2', definitionId: 'exp_fossilized_orb', name: 'Orbe Fossilizado', icon: 'fas fa-circle text-stone-500', currentHp: new Decimal(120), maxHp: new Decimal(120), level: 4, rarity: 'Rare', baseAttack: new Decimal(10), baseDefense: new Decimal(15), baseSpeed: new Decimal(10), currentAttack: new Decimal(10), currentDefense: new Decimal(15), currentSpeed: new Decimal(10), statusEffects: [{ instanceId:'se_stacking_atk_1', definitionId: 'se_custom_stacking_attack', name: 'Poder Crescente', icon: 'fas fa-arrow-trend-up', description: 'Ganha +10% de ataque por turno.', type: 'buff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(0.1)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_basic_attack', name: 'Pulso de Energia', icon:'fas fa-wave-pulse', currentCooldownTurns: 0}] },
        ]
    },
    { 
        stage: 5, name: "Templo Fraturado do Elo", theme: "Mini-Chefe", 
        enemies: [
            { instanceId: 'exp5_boss', definitionId: 'exp_cycle_guardian', name: 'Guardião do Ciclo', icon: 'fas fa-sync-alt text-cyan-400', currentHp: new Decimal(300), maxHp: new Decimal(300), level: 6, rarity: 'Elite', baseAttack: new Decimal(25), baseDefense: new Decimal(18), baseSpeed: new Decimal(15), currentAttack: new Decimal(25), currentDefense: new Decimal(18), currentSpeed: new Decimal(15), statusEffects: [{ instanceId:'se_cycle_1', definitionId: 'se_custom_cycle_states', name: 'Ciclo de Batalha', icon: 'fas fa-infinity', description: 'Alterna entre estados de vulnerabilidade e reflexão.', type: 'buff', effectType: 'custom_logic', remainingDurationTurns: 99, currentPotency: new Decimal(1)}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: ABILITIES_FROM_MODULE.filter(a => ['ab_strong_hit', 'ab_draconic_tail_sweep'].includes(a.id)).map(a => ({definitionId: a.id, name: a.name, icon: a.icon, currentCooldownTurns: 0})) },
        ]
    },
    { 
        stage: 6, name: "Pico Vento-Fóssil", theme: "Velocidade e críticos", 
        enemies: [
            { instanceId: 'exp6_e1', definitionId: 'exp_wind_raptor', name: 'Raptor do Vento', icon: 'fas fa-feather-alt text-sky-400', currentHp: new Decimal(180), maxHp: new Decimal(180), level: 6, rarity: 'Rare', baseAttack: new Decimal(20), baseDefense: new Decimal(12), baseSpeed: new Decimal(25), currentAttack: new Decimal(20), currentDefense: new Decimal(12), currentSpeed: new Decimal(25), statusEffects: [], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_kinetic_sudden_burst', name: 'Investida Súbita', icon:'fas fa-bolt', currentCooldownTurns: 0}] },
            { instanceId: 'exp6_e2', definitionId: 'exp_unstable_specter', name: 'Espectro Instável', icon: 'fas fa-ghost text-red-400', currentHp: new Decimal(150), maxHp: new Decimal(150), level: 6, rarity: 'Rare', baseAttack: new Decimal(22), baseDefense: new Decimal(10), baseSpeed: new Decimal(20), currentAttack: new Decimal(22), currentDefense: new Decimal(10), currentSpeed: new Decimal(20), statusEffects: [{ instanceId:'se_crit_chance_1', definitionId: 'se_attack_buff_minor', name: 'Fúria Crítica', icon: 'fas fa-crosshairs', description: 'Ataque aumentado.', type: 'buff', effectType: 'stat_change_multiply', statToChange: 'attack', currentPotency: new Decimal(0.25), remainingDurationTurns: 99}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_blades_unstable_blade', name: 'Lâmina Espectral', icon:'fas fa-sword', currentCooldownTurns: 0}] }
        ],
        modifiers: ['Crítico Frenético', 'Reativo a Dano', 'Acelerado']
    },
    { 
        stage: 7, name: "Forja Caótica", theme: "Dano bruto e instabilidade", 
        enemies: [
            { instanceId: 'exp7_e1', definitionId: 'exp_chaos_forger', name: 'Forjador do Caos', icon: 'fas fa-fire-alt text-orange-500', currentHp: new Decimal(250), maxHp: new Decimal(250), level: 7, rarity: 'Elite', baseAttack: new Decimal(30), baseDefense: new Decimal(15), baseSpeed: new Decimal(18), currentAttack: new Decimal(30), currentDefense: new Decimal(15), currentSpeed: new Decimal(18), statusEffects: [], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_blades_unstable_blade', name: 'Golpe Caótico', icon:'fas fa-burst', currentCooldownTurns: 0}] },
            { instanceId: 'exp7_e2', definitionId: 'exp_unstable_elemental', name: 'Elemental Instável', icon: 'fas fa-atom text-purple-400', currentHp: new Decimal(220), maxHp: new Decimal(220), level: 7, rarity: 'Elite', baseAttack: new Decimal(25), baseDefense: new Decimal(20), baseSpeed: new Decimal(22), currentAttack: new Decimal(25), currentDefense: new Decimal(20), currentSpeed: new Decimal(22), statusEffects: [{ instanceId:'se_random_buff_1', definitionId: 'se_attack_buff_minor', name: 'Energia Flutuante', icon: 'fas fa-random', description: 'Ganha um buff aleatório periodicamente.', type: 'buff', effectType: 'custom_logic', currentPotency: new Decimal(1), remainingDurationTurns: 99}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_basic_attack', name: 'Toque Entrópico', icon:'fas fa-hand-sparkles', currentCooldownTurns: 0}] }
        ]
    },
    { 
        stage: 8, name: "O Pântano da Lentidão Eterna", theme: "Debuffs e veneno em área", 
        enemies: [
            { instanceId: 'exp8_e1', definitionId: 'exp_venomous_ooze', name: 'Lodo Peçonhento', icon: 'fas fa-tint text-lime-500', currentHp: new Decimal(300), maxHp: new Decimal(300), level: 8, rarity: 'Uncommon', baseAttack: new Decimal(20), baseDefense: new Decimal(25), baseSpeed: new Decimal(10), currentAttack: new Decimal(20), currentDefense: new Decimal(25), currentSpeed: new Decimal(10), statusEffects: [], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_fungal_paralyzing_spores', name: 'Nuvem Tóxica', icon:'fas fa-wind', currentCooldownTurns: 0}] },
            { instanceId: 'exp8_e2', definitionId: 'exp_stagnant_shadow', name: 'Sombra Estagnante', icon: 'fas fa-ghost text-slate-500', currentHp: new Decimal(250), maxHp: new Decimal(250), level: 8, rarity: 'Uncommon', baseAttack: new Decimal(28), baseDefense: new Decimal(18), baseSpeed: new Decimal(15), currentAttack: new Decimal(28), currentDefense: new Decimal(18), currentSpeed: new Decimal(15), statusEffects: [], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_necrotic_entropy_touch', name: 'Toque Estagnante', icon:'fas fa-hand-dots', currentCooldownTurns: 0}] }
        ]
    },
    { 
        stage: 9, name: "Santuário Espelhado", theme: "Reflexão de dano e controle", 
        enemies: [
            { instanceId: 'exp9_e1', definitionId: 'exp_mirrored_doppelganger', name: 'Duplicante Espelhado', icon: 'fas fa-clone text-cyan-300', currentHp: new Decimal(350), maxHp: new Decimal(350), level: 9, rarity: 'Elite', baseAttack: new Decimal(35), baseDefense: new Decimal(25), baseSpeed: new Decimal(28), currentAttack: new Decimal(35), currentDefense: new Decimal(25), currentSpeed: new Decimal(28), statusEffects: [{ instanceId:'se_reflect_2', definitionId: 'se_energy_mirror_reflect_buff', name: 'Superfície Espelhada', icon: 'fas fa-shield-reflect', description: 'Reflete 30% do dano recebido.', type: 'buff', effectType: 'damage_reflection_percentage', reflectionPercentage: new Decimal(0.30), currentPotency: new Decimal(0.30), remainingDurationTurns: 99}], isUsingAbility: false, avatarAnimationState: 'idle', abilities: [{definitionId: 'ab_mirrored_instinctive_reflection', name: 'Reflexo Tático', icon:'fas fa-circle-half-stroke', currentCooldownTurns: 0}] },
        ]
    },
    { 
        stage: 10, name: "O Coração do Wyrm Temporal", theme: "Chefe Final", 
        enemies: [
            { instanceId: 'exp10_boss', definitionId: 'boss_chrono_wyrm_def', name: 'Wyrm Cronotemporal', icon: 'fas fa-hourglass-half text-purple-300', currentHp: new Decimal(1000), maxHp: new Decimal(1000), level: 11, rarity: 'Boss', baseAttack: new Decimal(50), baseDefense: new Decimal(30), baseSpeed: new Decimal(40), currentAttack: new Decimal(50), currentDefense: new Decimal(30), currentSpeed: new Decimal(40), statusEffects: [], isUsingAbility: false, avatarAnimationState: 'idle', abilities: ABILITIES_FROM_MODULE.filter(a => ['ab_chrono_wyrm_temporal_burst', 'ab_chrono_wyrm_reality_warp', 'ab_chrono_wyrm_entropic_roar'].includes(a.id)).map(a => ({definitionId: a.id, name: a.name, icon: a.icon, currentCooldownTurns: 0})) },
        ]
    },
];

export const COMBAT_SPEED_OPTIONS = [1, 2, 4];
export const MAX_TEAM_SIZE = 5;
export const MAX_BATTLE_ROUNDS = 50;

export const POST_TRANSCENDENCE_RANDOM_EVENTS: GameEvent[] = [
    {
        id: 'curiousObject',
        name: 'Objeto Curioso',
        description: 'Você encontra um objeto estranho pulsando com uma energia desconhecida.',
        options: [
            {
                text: 'Tocar no objeto',
                consequence: 'Pode lhe conceder poder... ou algo inesperado.',
                applyEffect: (gs, setGs, showMsg) => {
                    const outcome = Math.random();
                    if (outcome < 0.5) {
                        const piGained = gs.incubationPower.times(0.1).plus(1000);
                        setGs(prev => ({ ...prev, incubationPower: prev.incubationPower.plus(piGained) }));
                        showMsg(`O objeto emite uma luz quente! Você ganhou poder extra.`, 2000);
                    } else {
                        setGs(prev => ({ ...prev, curiosoTimer: new Decimal(300) }));
                        showMsg("Uma névoa estranha envolve você. Sua produção passiva está reduzida por 5 minutos.", 3000);
                    }
                }
            },
            {
                text: 'Ignorar',
                consequence: 'É melhor não mexer com o que não se conhece.',
                applyEffect: (gs, setGs, showMsg) => {
                    showMsg("Você ignora o objeto e segue seu caminho, nada acontece.", 2000);
                }
            }
        ]
    }
];

// Local helper to avoid circular dependencies. This should match the one in useEmbryoSystem.
const calculateEmbryoBaseStatsForInitialState = (level: Decimal): EmbryoStats => {
    const baseMaxHp = (EMBRYO_BASE_STATS_PER_LEVEL.maxHp || new Decimal(0)).times(level);
    return {
        currentHp: baseMaxHp, 
        maxHp: baseMaxHp,
        attack: (EMBRYO_BASE_STATS_PER_LEVEL.attack || new Decimal(0)).times(level),
        defense: (EMBRYO_BASE_STATS_PER_LEVEL.defense || new Decimal(0)).times(level),
        speed: (EMBRYO_BASE_STATS_PER_LEVEL.speed || new Decimal(0)).times(level),
        critChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.critChance || new Decimal(0)).times(level)),
        poisonChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.poisonChance || new Decimal(0)).times(level)),
        poisonDurationSeconds: (EMBRYO_BASE_STATS_PER_LEVEL.poisonDurationSeconds || new Decimal(0)).times(level), 
        bossDamageBonus: (EMBRYO_BASE_STATS_PER_LEVEL.bossDamageBonus || new Decimal(0)).times(level),
        doubleHitChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.doubleHitChance || new Decimal(0)).times(level)),
        lifestealRate: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.lifestealRate || new Decimal(0)).times(level)),
        chaosEffectChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.chaosEffectChance || new Decimal(0)).times(level)),
        enemyDelayChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.enemyDelayChance || new Decimal(0)).times(level)),
        damageReflection: (EMBRYO_BASE_STATS_PER_LEVEL.damageReflection || new Decimal(0)).times(level),
        critResistance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.critResistance || new Decimal(0)).times(level)),
        periodicShieldValue: (EMBRYO_BASE_STATS_PER_LEVEL.periodicShieldValue || new Decimal(0)).times(level),
        dodgeChance: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.dodgeChance || new Decimal(0)).times(level)),
        overallDamageReduction: Decimal.min(1, (EMBRYO_BASE_STATS_PER_LEVEL.overallDamageReduction || new Decimal(0)).times(level)),
        hpRegenPerInterval: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerInterval || new Decimal(0)).times(level),
        hpRegenPerMinute: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerMinute || new Decimal(0)).times(level),
        modularExpGainMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.modularExpGainMultiplier || new Decimal(0)).times(level),
        shieldOnXpFull: (EMBRYO_BASE_STATS_PER_LEVEL.shieldOnXpFull || new Decimal(0)).times(level),
        outgoingDamageMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.outgoingDamageMultiplier || new Decimal(0)).times(level),
        embryoIpps: (EMBRYO_BASE_STATS_PER_LEVEL.embryoIpps || new Decimal(0)).times(level),
        embryoClicksPerClick: (EMBRYO_BASE_STATS_PER_LEVEL.embryoClicksPerClick || new Decimal(0)).times(level),
        currentShield: new Decimal(0),
        maxShield: (EMBRYO_BASE_STATS_PER_LEVEL.maxShield || new Decimal(0)).times(level),
        critDamageMultiplier: (EMBRYO_BASE_STATS_PER_LEVEL.critDamageMultiplier || new Decimal(0)).times(level),
        positiveChaosEffectDuplicationChance: (EMBRYO_BASE_STATS_PER_LEVEL.positiveChaosEffectDuplicationChance || new Decimal(0)).times(level),
    };
};

export const INITIAL_GAME_STATE: GameState = {
    incubationPower: new Decimal(0),
    temporaryEggs: new Decimal(1),
    clicksPerClick: new Decimal(2),
    ipps: new Decimal(0),
    effectiveClicksPerClick: new Decimal(2),
    effectiveIpps: new Decimal(0),
    transcendentEssence: new Decimal(0),
    currentStageIndex: 0,
    currentStageData: EGG_STAGES[0],
    nextStageThreshold: EGG_STAGES[1].threshold,
    gameFinished: false,
    animationFrameId: null,
    lastTick: 0,
    maxIncubationPowerAchieved: new Decimal(0),
    userNickname: 'Jogador',
    totalClicksEver: new Decimal(0),
    totalClicksThisRun: new Decimal(0),
    hasPurchasedRegularUpgradeThisRun: false,
    transcendenceCount: new Decimal(0),
    transcendencePassiveBonus: new Decimal(1),
    unlockedEggForms: [],
    activeEggFormIds: [],
    unlockedAchievements: [],
    achievementsData: ACHIEVEMENTS.map(ach => ({ ...ach, bonus: ach.bonus ? { ...ach.bonus } : undefined, effect: ach.effect ? {...ach.effect} : undefined })),
    unlockedTraits: [],
    activeTraits: [],
    maxActiveTraits: 1,
    isSoundEnabled: true,
    isMusicEnabled: false,
    lastPlayedTimestamp: Date.now(),
    offlineIncubationRate: new Decimal(0.1),
    lastClickTime: Date.now(),
    activeIdleTime: new Decimal(0),
    abyssalIdleBonusTime: new Decimal(0),
    transcendenceThreshold: BASE_TRANSCENDENCE_THRESHOLD,
    essencePerPI: ESSENCE_PER_PI,
    finalEggThreshold: FINAL_EGG_THRESHOLD,
    goldenBlessingMultiplier: new Decimal(1),
    criticalClickChance: new Decimal(0.05),
    effectiveCriticalClickChance: new Decimal(0.05),
    softCapThresholdCPC: SOFT_CAP_THRESHOLD_CPC,
    softCapThresholdIPPS: SOFT_CAP_THRESHOLD_IPPS,
    softCapScalingFactor: SOFT_CAP_SCALING_FACTOR,
    currentEventData: null,
    explosaoIncubadoraTimer: new Decimal(0),
    overclockCascaTimer: new Decimal(0),
    impactoCriticoTimer: new Decimal(0),
    furiaIncubadoraTimer: new Decimal(0),
    lastUsedActiveAbilityId: null,
    curiosoTimer: new Decimal(0),
    activeTemporaryBuffs: [],
    transcendenceSpamPenaltyActive: false,
    transcendenceSpamPenaltyDuration: new Decimal(0),
    lastLeadKeyClickTimestamp: 0,
    lastTitheRitualTimestamp: 0,
    upgradesData: INITIAL_REGULAR_UPGRADES.map(upg => ({ ...upg, baseCost: new Decimal(upg.baseCost), costMultiplier: new Decimal(upg.costMultiplier), purchased: new Decimal(0) })),
    transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({ ...b, baseCost: new Decimal(b.baseCost), costMultiplier: new Decimal(b.costMultiplier), purchased: new Decimal(0) })),
    etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(epu => ({ ...epu, baseCost: new Decimal(epu.baseCost), costMultiplier: new Decimal(epu.costMultiplier), purchased: new Decimal(0) })),
    specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({ ...su, purchased: new Decimal(0) })),
    activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({...aa, cost: new Decimal(aa.cost), cooldown: new Decimal(aa.cooldown), cooldownRemaining: new Decimal(0) })),
    legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(lu => ({...lu})),
    sacredRelicsData: INITIAL_SACRED_RELICS.map(sr => ({...sr})),
    secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({...sru})),
    secretRuptureSystemUnlocked: false,
    showNicknameModal: false,
    showTraitModal: false,
    showEventModal: false,
    showAchievementPopup: false,
    achievementPopupData: null,
    showSettingsModal: false,
    showOfflineGainModal: false,
    offlineGainData: null,
    showTranscendenceInfoModal: false,
    transcendenceInfoData: null,
    totalUpgradesPurchasedEver: new Decimal(0),
    activePlayTime: new Decimal(0),
    globalAbilityCooldownMultiplier: new Decimal(1),
    servoDoOvoActiveMultiplier: new Decimal(1),
    mestreDaEvolucaoBonus: new Decimal(0),
    modularEXP: new Decimal(0),
    enemiesDefeatedTotal: new Decimal(0),
    currentEnemy: null,
    combatLog: [],
    embryoLevel: new Decimal(1),
    embryoCurrentEXP: new Decimal(0),
    embryoEXPToNextLevel: INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL,
    embryoIcon: EMBRYO_INITIAL_ICON,
    embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(upg => ({ ...upg, cost: upg.cost ? new Decimal(upg.cost) : undefined, baseCost: upg.baseCost ? new Decimal(upg.baseCost) : undefined, costMultiplier: upg.costMultiplier ? new Decimal(upg.costMultiplier) : undefined, purchased: new Decimal(0) })),
    embryoBaseStats: { ...calculateEmbryoBaseStatsForInitialState(new Decimal(1)) },
    embryoEffectiveStats: { ...calculateEmbryoBaseStatsForInitialState(new Decimal(1)) },
    embryoInventory: [],
    equippedEmbryoItems: { weapon: null, armor: null, passiveChip: null, especial: null },
    embryoShopItems: INITIAL_EMBRYO_SHOP_ITEMS.map(i => ({...i, cost: i.cost.map(c => ({...c, amount: new Decimal(c.amount)}))})),
    showEmbryoInventoryModal: false,
    currentSlotToEquip: null,
    showCombatModal: false,
    showEmbryoModal: false,
    message: null,
    plasmaPulseClickCounter: new Decimal(0),
    lastInteractionTime: Date.now(),
    rupturePathChoicesCount: new Decimal(0),
    runsWithFiveDifferentTraitsCount: new Decimal(0),
    incubatorTypesOwnedThisRun: new Set(),
    totalRunsTranscended: new Decimal(0),
    firstBossDefeatedThisRun: false,
    uniqueEnemiesDefeatedThisRunByEmbryo: new Set(),
    embryoLevel10ReachedCount: new Decimal(0),
    dailyLoginTracker: { morning: false, afternoon: false, night: false },
    quantumCoreActiveRandomTraitId: null,
    quantumCoreActiveRandomTraitDuration: new Decimal(0),
    quantumCoreInternalCooldown: new Decimal(0),
    orbInverseGlobalPIProductionMultiplier: new Decimal(1),
    orbInverseModularEXPGainMultiplier: new Decimal(1),
    orbInverseAbilitiesDisabled: false,
    entropySeedModularEXPGainMultiplier: new Decimal(1),
    entropySeedGlobalPIProductionDebuff: new Decimal(1),
    entropySeedPassiveProductionBuff: new Decimal(1),
    entropySeedSpecialUpgradesDisabled: false,
    dualCoreMaxEggFormsActive: false,
    dualCoreUpgradeCostMultiplier: new Decimal(1),
    dualCoreEXPGainDebuff: new Decimal(1),
    dualCoreETGainDebuff: new Decimal(1),
    fusaoBioquantumNextClickBuff: false,
    abilitiesUsedThisRun: [],
    enemiesDefeatedThisRun: new Decimal(0),
    furyPassiveBonusAmount: new Decimal(0),
    furyPassiveBonusTimer: new Decimal(0),
    forjaRessonanteBuffTimer: new Decimal(0),
    toqueTrinoBuffTimer: new Decimal(0),
    esporoIncandescenteIntervalTimer: new Decimal(0),
    esporoIncandescenteBuffTimer: new Decimal(0),
    hiddenDiscoveriesData: INITIAL_HIDDEN_DISCOVERY_DEFINITIONS.map(def => ({ id: def.id, isDiscovered: false, nameToDisplay: def.defaultName, descriptionToDisplay: def.defaultDescription, iconToDisplay: def.defaultIcon })),
    metaUpgradesUnlocked: false,
    metaUpgradesData: INITIAL_META_UPGRADES.map(mu => ({ ...mu, cost: new Decimal(mu.cost), purchased: new Decimal(0) })),
    cosmicBank: {
        pi: { depositedAmount: new Decimal(0), depositTimestamp: null },
        et: { depositedAmount: new Decimal(0), depositTimestamp: null },
        modularExp: { depositedAmount: new Decimal(0), depositTimestamp: null },
    },
    dailyMissions: [],
    lastMissionGenerationDate: null,
    unlockedSkinIds: ['default'],
    activeSkinId: 'default',
    spentModularEXPThisRun: false,
    embryoTookDamageThisRun: false,
    reservatorioPsiquicoActive: false,
    justTranscended: false,
    fusionSelectedInventoryItemIds: [],
    lastFusedItem: null,
    periodicShieldCycleTimerSeconds: new Decimal(10),
    periodicShieldClickCounter: new Decimal(0),
    collectibleEggs: [],
    eggFragments: new Decimal(0),
    eggFragmentCostForRandomRoll: EGG_FRAGMENTS_FOR_RANDOM_ROLL,
    lastAcquiredCollectibleEggs: [],
    eggTeamBattleState: {
        isActive: false, battleName: 'Batalha Amistosa', currentRound: 0, totalRounds: 10, maxRounds: MAX_BATTLE_ROUNDS, combatSpeed: 1, isPaused: false, roundTimer: 0, roundDuration: 5000,
        enemyTeam: [], playerTeam: [], battleLog: [], floatingTexts: [],
        isTeamSetupActive: false, playerTeamLineup: Array(MAX_TEAM_SIZE).fill(null), selectedInventoryEggInstanceIdForPlacement: null,
        turnOrder: [], currentTurnIndex: 0, currentActingEggId: null, battlePhase: 'setup', isBattleOver: false, winner: null,
        battleStats: { damageDealtByEgg: {}, healingDoneByEgg: {} }, battleRewards: [],
        lastPlayerStatusApplication: null, lastOpponentStatusApplication: null,
        isExpeditionMode: false, currentExpeditionStage: 0, expeditionOutcome: null, 
        expeditionPlayerTeamSnapshot: null, expeditionDamageDealt: new Decimal(0), expeditionEggsDefeated: 0,
        showPostBattleChoiceModal: false,
        availablePostBattleChoices: [],
        acquiredExpeditionUpgrades: [],
        expeditionTeamBuffs: [],
        isAwaitingChoiceTarget: false,
        rewardToApplyOnTarget: null,
    },
    perfectCycleBuffTimer: new Decimal(0),
    stagnantTimeBuffTimer: new Decimal(0),
    phoenixGlowCritClicksRemaining: new Decimal(0),
    eloGeneticoBonusMultiplier: new Decimal(1),
    showSacredRelicChoiceModal: false,
    availableSacredRelicChoices: [],
    distorcaoRecorrenteClickCounter: new Decimal(0),
    distorcaoRecorrenteStacks: new Decimal(0),
    distorcaoRecorrenteTimer: new Decimal(0),
    pulsoDaPerfeicaoClickCounter: new Decimal(0),
    espiralInternaTimer: new Decimal(0),
    espiralInternaStacks: new Decimal(0),
    espiralInternaIntervalTimer: new Decimal(300),
    eggFormsActivatedThisRun: new Set(),
    primordialTriggerUsedThisRun: false,
    showPrimordialTriggerModal: false,
    imortalidadePIBonus: new Decimal(0),
    visaoFractalBuffTimer: new Decimal(0),
};

export { COLLECTIBLE_EGG_DEFINITIONS, EGG_FRAGMENTS_PER_CLICK, COLLECTIBLE_EGG_RARITY_CHANCES, MAX_ACQUISITION_HISTORY, REROLL_COST_ET, FIXED_EGG_SHOP_COSTS };
