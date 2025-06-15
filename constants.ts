
import { Decimal } from 'decimal.js';
import { EggStage, RegularUpgrade, TranscendentalBonus, SpecialUpgrade, EggForm, Achievement, Trait, ActiveAbility, GameState, EtPermanentUpgrade, GameEvent, TranscendenceMilestoneInfo, LegendaryUpgrade, SecretRuptureUpgrade, Enemy, EmbryoUpgrade, EmbryoLevelMilestone, EmbryoStats, EmbryoItem, EmbryoItemRarity, EmbryoEquipmentSlotKey, GameEventOption } from './types'; // Added EmbryoStats, EmbryoItem, GameEventOption

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
    { id: 'stage11BonusEquivalent', name: 'Ressonância Eterna (Estágio 11)', threshold: new Decimal(10000000), color: '#f59e0b', description: 'O ovo ressoa com poder eterno.' },
    { id: 'stage12BonusEquivalent', name: 'Distorção de Estado (Estágio 12)', threshold: new Decimal(25000000), color: '#10b981', description: 'O ovo começa a distorcer a realidade dos custos.' },
    { id: 'stage13BonusEquivalent', name: 'Conhecimento Ancestral (Estágio 13)', threshold: new Decimal(50000000), color: '#ec4899', description: 'O ovo revela sabedoria antiga.' },
    { id: 'stage14BonusEquivalent', name: 'Consciência Expandida (Estágio 14)', threshold: new Decimal(100000000), color: '#0ea5e9', description: 'A consciência do ovo se expande para além dos limites.' },
    { id: 'stage15BonusEquivalent', name: 'Núcleo de Realidade (Estágio Final)', threshold: new Decimal(250000000), color: '#d946ef', description: 'O ovo se torna um núcleo da própria realidade.' },
];

export const INITIAL_REGULAR_UPGRADES: RegularUpgrade[] = [
    { id: 'basicIncubator', name: 'Incubadora Básica', description: 'Gera 1 Poder de Incubação por segundo.', baseCost: new Decimal(10), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(1) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-egg' },
    { id: 'blessedTouch', name: 'Toque Abençoado', description: 'Aumenta o Poder de Incubação por clique em 1.', baseCost: new Decimal(20), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(1) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-hand-pointer' },
    { id: 'advancedIncubator', name: 'Incubadora Avançada', description: 'Gera 5 Poder de Incubação por segundo.', baseCost: new Decimal(100), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(5) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-industry' },
    { id: 'divineGuidance', name: 'Orientação Divina', description: 'Aumenta o Poder de Incubação por clique em 5.', baseCost: new Decimal(250), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(5) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-star' },
    { id: 'cosmicForge', name: 'Forja Cósmica', description: 'Gera 25 Poder de Incubação por segundo.', baseCost: new Decimal(1000), costMultiplier: new Decimal(1.15), effect: { ipps: new Decimal(25) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-fire' },
    { id: 'soulInfusion', name: 'Infusão da Alma', description: 'Aumenta o Poder de Incubação por clique em 20.', baseCost: new Decimal(1500), costMultiplier: new Decimal(1.2), effect: { clicksPerClick: new Decimal(20) }, purchased: new Decimal(0), type: 'clicks', icon: 'fas fa-heart' },
    { id: 'automatedIncubator', name: 'Incubadora Automatizada', description: 'Gera 100 Poder de Incubação por segundo.', baseCost: new Decimal(5000), costMultiplier: new Decimal(1.18), effect: { ipps: new Decimal(100) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-robot', hidden: true },
    { id: 'legendaryCore', name: 'Núcleo Lendário', description: 'Gera 1.000.000 de Poder de Incubação por segundo. Desbloqueado por um marco de transcendência.', baseCost: new Decimal(100000000), costMultiplier: new Decimal(10), effect: { ipps: new Decimal(1000000) }, purchased: new Decimal(0), type: 'ipps', icon: 'fas fa-atom', hidden: true }
];

export const INITIAL_TRANSCENDENTAL_BONUSES: TranscendentalBonus[] = [
    { id: 'ellipseBlessing', name: 'Bênção da Elipse', description: 'Multiplica o Poder por Clique por 1.1 (10% a mais).', baseCost: new Decimal(1), costMultiplier: new Decimal(1.5), effect: { clicksPerClickMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-circle-notch' },
    { id: 'cosmicFlow', name: 'Fluxo Cósmico', description: 'Multiplica o Poder por Segundo por 1.1 (10% a mais).', baseCost: new Decimal(1), costMultiplier: new Decimal(1.5), effect: { ippsMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-infinity' },
    { id: 'eternalSpark', name: 'Faísca Eterna', description: 'Multiplica o Poder por Clique por 1.2 (20% a mais).', baseCost: new Decimal(5), costMultiplier: new Decimal(1.6), effect: { clicksPerClickMultiplier: new Decimal(1.2) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-bolt' },
    { id: 'infinitePulse', name: 'Pulso Infinito', description: 'Multiplica o Poder por Segundo por 1.2 (20% a mais).', baseCost: new Decimal(5), costMultiplier: new Decimal(1.6), effect: { ippsMultiplier: new Decimal(1.2) }, purchased: new Decimal(0), type: 'multiplier', icon: 'fas fa-sync-alt' }
];

export const INITIAL_ET_PERMANENT_UPGRADES: EtPermanentUpgrade[] = [
    { id: 'divineCore', name: 'Núcleo Divino', description: 'Aumenta o Poder por Clique em +1 permanentemente.', baseCost: new Decimal(2), costMultiplier: new Decimal(2), effect: { clicksPerClick: new Decimal(1) }, purchased: new Decimal(0), type: 'et_permanent_fixed', icon: 'fas fa-bolt', maxLevel: new Decimal(100) },
    { id: 'stableFlow', name: 'Fluxo Estável', description: 'Aumenta o Poder por Segundo em +10 permanentemente.', baseCost: new Decimal(3), costMultiplier: new Decimal(2.2), effect: { ipps: new Decimal(10) }, purchased: new Decimal(0), type: 'et_permanent_fixed', icon: 'fas fa-water-lower', maxLevel: new Decimal(100) },
    { id: 'critEggBoost', name: 'Amplificador Crítico', description: 'Aumenta o dano de cliques críticos em +10% por nível.', baseCost: new Decimal(5), costMultiplier: new Decimal(3), effect: { criticalDamageMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-crosshairs', maxLevel: new Decimal(10) },
    { id: 'essenceEfficiency', name: 'Eficiência Essencial', description: 'Aumenta todo ganho de Essência Transcendente em +5%.', baseCost: new Decimal(10), costMultiplier: new Decimal(1.8), effect: { etGainMultiplier: new Decimal(1.05) }, purchased: new Decimal(0), type: 'et_permanent_percentage', icon: 'fas fa-gem', maxLevel: new Decimal(20) },
];


export const INITIAL_SPECIAL_UPGRADES: SpecialUpgrade[] = [
    { id: 'stage1Bonus', name: 'Despertar Inicial', description: 'Aumenta o Poder por Clique em 5 permanentemente.', stageRequired: 1, effect: { clicksPerClick: new Decimal(5) }, purchased: new Decimal(0), type: 'permanent_clicks', icon: 'fas fa-seedling' },
    { id: 'stage2Bonus', name: 'Fluxo Constante', description: 'Aumenta o Poder por Segundo em 10 permanentemente.', stageRequired: 2, effect: { ipps: new Decimal(10) }, purchased: new Decimal(0), type: 'permanent_ipps', icon: 'fas fa-water' },
    { id: 'stage3Bonus', name: 'Visão Ampliada', description: 'Multiplica todo o Poder de Incubação por 1.05.', stageRequired: 3, effect: { incubationPowerMultiplier: new Decimal(1.05) }, purchased: new Decimal(0), type: 'permanent_multiplier', icon: 'fas fa-eye' },
    { id: 'stage4Bonus', name: 'Essência da Transcendência', description: 'Ganha 5 Essência Transcendente extra ao transcender.', stageRequired: 4, effect: { bonusET: new Decimal(5) }, purchased: new Decimal(0), type: 'permanent_et_bonus', icon: 'fas fa-gem' },
    { id: 'stage5Bonus', name: 'Harmonia Cósmica', description: 'Multiplica o Poder por Clique e por Segundo por 1.1.', stageRequired: 5, effect: { clicksPerClickMultiplier: new Decimal(1.1), ippsMultiplier: new Decimal(1.1) }, purchased: new Decimal(0), type: 'permanent_global_multiplier', icon: 'fas fa-globe-americas' },
    { id: 'stage6Bonus', name: 'Ciclo Eterno', description: 'Reduz o custo de todas as Melhorias Transcendentais em 10%.', stageRequired: 6, effect: { etCostReduction: new Decimal(0.10) }, purchased: new Decimal(0), type: 'permanent_et_cost_reduction', icon: 'fas fa-redo-alt' },
    { id: 'stage7Bonus', name: 'Pulsar Interno', description: 'Aumenta os ganhos offline em 25%.', stageRequired: 7, effect: { offlineIncubationRateMultiplier: new Decimal(0.25) }, purchased: new Decimal(0), type: 'permanent_offline_gain', icon: 'fas fa-star-half-alt' },
    { id: 'stage8Bonus', name: 'Ruptura Temporal', description: 'Dobra toda a produção (Poder por Clique e por Segundo).', stageRequired: 8, effect: { globalMultiplier: new Decimal(2) }, purchased: new Decimal(0), type: 'permanent_global_multiplier', icon: 'fas fa-cube' },
    { id: 'stage9Bonus', name: 'Forma Nula', description: 'Troque todos seus ovos temporários por PI (cada ovo temporário = 200 mil PI).', stageRequired: 9, effect: { piPerTemporaryEgg: new Decimal(200000) }, purchased: new Decimal(0), type: 'one_time_egg_conversion', icon: 'fas fa-circle' },
    { id: 'stage10Bonus', name: 'Termodinâmica Reversa', description: 'Multiplica a produção passiva por 1.5.', stageRequired: 10, effect: { ippsMultiplier: new Decimal(1.5) }, purchased: new Decimal(0), type: 'permanent_ipps_multiplier', icon: 'fas fa-thermometer-empty' },
    { id: 'stage11Bonus', name: 'Ressonância Eterna', description: 'Cada clique vale por 3 cliques (multiplica o Poder por Clique por 3).', stageRequired: 11, effect: { clicksPerClickMultiplier: new Decimal(3) }, purchased: new Decimal(0), type: 'permanent_clicks_multiplier', icon: 'fas fa-wave-square' },
    { id: 'stage12Bonus', name: 'Distorção de Estado', description: 'Reduz os custos de todas as melhorias em 50%.', stageRequired: 12, effect: { upgradeCostReduction: new Decimal(0.50) }, purchased: new Decimal(0), type: 'permanent_cost_reduction', icon: 'fas fa-atom' },
    { id: 'stage13Bonus', name: 'Conhecimento Ancestral', description: 'Ganha 100 Essência Transcendente instantaneamente.', stageRequired: 13, effect: { bonusET: new Decimal(100) }, purchased: new Decimal(0), type: 'one_time_et_gain', icon: 'fas fa-brain' },
    { id: 'stage14Bonus', name: 'Consciência Expandida', description: 'Dobra a produção pelo número de vezes que transcendeu neste save.', stageRequired: 14, effect: { transcendenceProductionMultiplier: new Decimal(2) }, purchased: new Decimal(0), type: 'permanent_transcendence_multiplier', icon: 'fas fa-lightbulb' },
    { id: 'stage15Bonus', name: 'Núcleo de Realidade', description: 'Multiplica todo o ganho (Poder por Clique, Poder por Segundo, Essência Transcendente) por 10x.', stageRequired: 15, effect: { globalGainMultiplier: new Decimal(10) }, purchased: new Decimal(0), type: 'permanent_ultimate_multiplier', icon: 'fas fa-globe' }
];

export const EGG_FORMS_DATA: EggForm[] = [
    { id: 'dragonEgg', name: 'Ovo de Dragão', description: 'Um ovo com escamas brilhantes, prometendo poder bruto.', activePassive: 'Bônus Ativo: +20% Poder por Clique.', collectionBonusDescription: 'Bônus de Coleção: +0.5% PI Global.', unlockCondition: 'Desbloqueado ao atingir o estágio "Ovo da Ascensão".', stageRequired: 3, icon: 'fas fa-dragon', activeBonus: { clicksPerClickMultiplier: new Decimal(1.2) }, collectionBonus: { incubationPowerMultiplier: new Decimal(1.005) } },
    { id: 'phoenixEgg', name: 'Ovo de Fênix', description: 'Um ovo que pulsa com energia de renascimento.', activePassive: 'Bônus Ativo: +10% Poder por Segundo.', collectionBonusDescription: 'Bônus de Coleção: +0.5% PI Global.', unlockCondition: 'Desbloqueado ao atingir o estágio "Ovo Cósmico".', stageRequired: 5, icon: 'fas fa-feather-alt', activeBonus: { ippsMultiplier: new Decimal(1.1) }, collectionBonus: { incubationPowerMultiplier: new Decimal(1.005) } },
    { id: 'cosmicEggForm', name: 'Ovo Cósmico (Forma)', description: 'Um ovo que contém as galáxias, refletindo a vastidão.', activePassive: 'Bônus Ativo: +5% Essência Transcendente ao transcender.', collectionBonusDescription: 'Bônus de Coleção: +0.5% PI Global.', unlockCondition: 'Desbloqueado ao atingir o estágio "Ovo Infinito".', stageRequired: 6, icon: 'fas fa-globe-europe', activeBonus: { bonusETMultiplier: new Decimal(1.05) }, collectionBonus: { incubationPowerMultiplier: new Decimal(1.005) } },
    { id: 'abyssalEgg', name: 'Ovo Abissal', description: 'Um ovo que se fortalece no silêncio do abismo.', activePassive: 'Bônus Ativo: Produção aumenta quanto mais tempo sem clicar (+0.5% por segundo sem clicar, até 200%).', collectionBonusDescription: 'Bônus de Coleção: +0.5% PI Global.', unlockCondition: 'Desbloqueado ao atingir o estágio "Núcleo de Realidade (Estágio Final)".', stageRequired: 14, icon: 'fas fa-ghost', activeBonus: { idleProductionBonus: { rate: new Decimal(0.005), max: new Decimal(2) } }, collectionBonus: { incubationPowerMultiplier: new Decimal(1.005) } },
    { id: 'ancientsEgg', name: 'Ovo dos Anciões', description: 'Um ovo lendário que emana sabedoria e poder de eras passadas.', activePassive: 'Bônus Ativo: Todos os bônus de ET Permanentes são 25% mais efetivos.', collectionBonusDescription: 'Bônus de Coleção: +2% PI Global.', unlockCondition: 'Desbloqueado ao atingir 20 transcendências (Antigo Marco).', stageRequired: 0, icon: 'fas fa-scroll', activeBonus: { etPermanentUpgradeEffectiveness: new Decimal(1.25) }, collectionBonus: { incubationPowerMultiplier: new Decimal(1.02) }, isLegendary: true }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    // Existing Achievements
    { id: 'firstClick', name: 'Primeiro Toque', description: 'Clique no ovo pela primeira vez.', bonusDescription: 'Bónus: +1% Poder por Clique (permanente).', icon: 'fas fa-hand-point-up', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(1), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.01) } },
    { id: 'firstTranscendence', name: 'Primeira Transcendência', description: 'Transcendência pela primeira vez.', bonusDescription: 'Bónus: +2% Poder por Segundo (permanente).', icon: 'fas fa-infinity', condition: (game) => game.transcendenceCount.greaterThanOrEqualTo(1), unlocked: false, bonus: { ippsMultiplier: new Decimal(1.02) } },
    { id: 'eggCollector', name: 'Colecionador de Ovos', description: 'Desbloqueie todas as formas de ovo (não lendárias).', bonusDescription: 'Bônus: +3% Poder de Incubação Global (permanente).', icon: 'fas fa-boxes', condition: (game) => EGG_FORMS_DATA.filter(f => !f.isLegendary).every(form => game.unlockedEggForms.includes(form.id)), unlocked: false, bonus: { incubationPowerMultiplier: new Decimal(1.03) } },
    { id: 'noUpgradeChallenge', name: 'Desafio Sem Melhorias', description: 'Alcance o Ovo da Manifestação sem comprar melhorias regulares.', bonusDescription: 'Bónus: +10% Essência Transcendente ganha (permanente).', icon: 'fas fa-ban', condition: (game) => game.currentStageIndex >= 2 && !game.hasPurchasedRegularUpgradeThisRun, unlocked: false, bonus: { etGainMultiplier: new Decimal(1.10) } },
    { id: 'softShell', name: 'Casca Mole', description: 'Tenha 50 incubadoras básicas.', bonusDescription: 'Desbloqueia o traço "Casca Porosa".', icon: 'fas fa-egg', condition: (game) => game.upgrades.find(u => u.id === 'basicIncubator')?.purchased.greaterThanOrEqualTo(50) ?? false, unlocked: false, unlocksTrait: 'porousShell' },
    { id: 'industrialIncubation', name: 'Incubação Industrial', description: 'Tenha um poder de incubação superior a 10.000 em uma run.', bonusDescription: 'Desbloqueia novo tipo de melhoria: Incubadora Automatizada.', icon: 'fas fa-industry', condition: (game) => game.incubationPower.greaterThanOrEqualTo(10000), unlocked: false, unlocksUpgrade: 'automatedIncubator' },
    { id: 'completeCycle', name: 'Ciclo Completo', description: 'Faça 20 transcendências.', bonusDescription: 'Reduz preço mínimo para transcender em 25%.', icon: 'fas fa-redo-alt', condition: (game) => game.transcendenceCount.greaterThanOrEqualTo(20), unlocked: false, effect: { transcendenceCostReduction: new Decimal(0.25) } },
    { id: 'smoothClick', name: 'Clique Suave', description: 'Clique 1.000 vezes em uma única run.', bonusDescription: 'Desbloqueia o traço "Membrana Flexível".', icon: 'fas fa-hand-point-up', condition: (game) => game.totalClicksThisRun.greaterThanOrEqualTo(1000), unlocked: false, unlocksTrait: 'flexibleMembrane' },
    { id: 'cosmicSnap', name: 'Estalo Cósmico', description: 'Dê 1.000.000 de cliques totais.', bonusDescription: 'Desbloqueia o traço: Dedo de Aço.', icon: 'fas fa-fingerprint', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(1000000), unlocked: false, unlocksTrait: 'steelFinger' },
    { id: 'wildFabrication', name: 'Fabricação Selvagem', description: 'Tenha 100 incubadoras básicas.', bonusDescription: 'Desbloqueia o traço "Forno de Pedra".', icon: 'fas fa-hammer', condition: (game) => game.upgrades.find(u => u.id === 'basicIncubator')?.purchased.greaterThanOrEqualTo(100) ?? false, unlocked: false, unlocksTrait: 'stoneFurnace' },
    { id: 'noRush', name: 'Sem Pressa', description: 'Fique 3 horas com o jogo aberto sem clicar.', bonusDescription: 'Aumenta em +50% a eficiência de ganho passivo de poder.', icon: 'fas fa-hourglass-start', condition: (game) => game.activeIdleTime.greaterThanOrEqualTo(new Decimal(3).times(3600)), unlocked: false, unlocksTrait: 'noRushTrait' },
    { id: 'estalinho', name: 'Estalinho', description: 'Clique 10 vezes.', bonusDescription: 'Bônus: +1 PI por clique (permanente).', icon: 'fas fa-hand-point-up', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(10), unlocked: false, bonus: { clicksPerClickAdditive: new Decimal(1) } },
    { id: 'dedinhoAgil', name: 'Dedinho Ágil', description: 'Clique 100 vezes.', bonusDescription: 'Bônus: +5% de chance de clique crítico (permanente).', icon: 'fas fa-fingerprint', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(100), unlocked: false, bonus: { criticalChanceAdditive: new Decimal(0.05) } },
    { id: 'caloIncubador', name: 'Calo Incubador', description: 'Clique 1.000 vezes.', bonusDescription: 'Bônus: +2% multiplicador de PI por clique (permanente).', icon: 'fas fa-hand-rock', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(1000), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.02) } },
    { id: 'estaloRapido', name: 'Estalo Rápido', description: 'Clique 10.000 vezes.', bonusDescription: 'Bônus: +5% poder por clique (permanente).', icon: 'fas fa-bolt', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(10000), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.05) } },
    { id: 'dedoDeTitanio', name: 'Dedo de Titânio', description: 'Clique 100.000 vezes.', bonusDescription: 'Bônus: Cliques críticos diminuem o cooldown de habilidades em 1 segundo.', icon: 'fas fa-gavel', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(100000), unlocked: false, bonus: { abilityCooldownReductionOnCrit: new Decimal(1) } },
    { id: 'oEstaloInfinito', name: 'O Estalo Infinito', description: 'Clique 1.000.000 vezes.', bonusDescription: 'Bônus: Multiplicador global (poder por cliques e poder por segundo) +10% permanente.', icon: 'fas fa-infinity', condition: (game) => game.totalClicksEver.greaterThanOrEqualTo(1000000), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.10), ippsMultiplier: new Decimal(1.10) } },
    { id: 'curioso', name: 'Curioso', description: 'Jogue por 10 minutos.', bonusDescription: 'Bônus: +50% PI/s por 30s ao ativar uma habilidade.', icon: 'fas fa-clock', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(10).times(60)), unlocked: false, bonus: { curiousBuff: { duration: new Decimal(30), multiplier: new Decimal(1.5) } } },
    { id: 'focado', name: 'Focado', description: 'Jogue por 30 minutos.', bonusDescription: 'Bônus: +2% PI/s permanente.', icon: 'fas fa-eye', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(30).times(60)), unlocked: false, bonus: { ippsMultiplier: new Decimal(1.02) } },
    { id: 'incansavel', name: 'Incansável', description: 'Jogue por 2 horas.', bonusDescription: 'Bônus: +10% produção passiva offline.', icon: 'fas fa-battery-half', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(2).times(3600)), unlocked: false, bonus: { offlineIncubationRateBonus: new Decimal(0.10) } },
    { id: 'presoNoLoop', name: 'Preso no Loop', description: 'Jogue por 10 horas.', bonusDescription: 'Bônus: Habilidades têm 10% menos cooldown.', icon: 'fas fa-redo', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(10).times(3600)), unlocked: false, bonus: { abilityCooldownMultiplier: new Decimal(0.90) } },
    { id: 'servoDoOvo', name: 'Servo do Ovo', description: 'Jogue por 24 horas.', bonusDescription: 'Bônus: Multiplica a produção global entre 00:00 e 06:00 por 1.5x.', icon: 'fas fa-moon', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(24).times(3600)), unlocked: false, bonus: { nightProductionMultiplier: new Decimal(1.5) } },
    { id: 'oEscolhido', name: 'O Escolhido', description: 'Jogue por 72 horas.', bonusDescription: 'Bônus: Todas fontes de PI recebem +15% permanente.', icon: 'fas fa-crown', condition: (game) => game.activePlayTime.greaterThanOrEqualTo(new Decimal(72).times(3600)), unlocked: false, bonus: { incubationPowerMultiplier: new Decimal(1.15) } },
    { id: 'primeirosPassos', name: 'Primeiros Passos', description: 'Compre 10 melhorias.', bonusDescription: 'Bônus: -1% no custo de todos melhorias (permanente).', icon: 'fas fa-shoe-prints', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(10), unlocked: false, bonus: { upgradeCostReductionAdditive: new Decimal(0.01) } },
    { id: 'iniciado', name: 'Iniciado', description: 'Compre 50 melhorias.', bonusDescription: 'Bônus: -3% no custo de todos melhorias (permanente).', icon: 'fas fa-star-half-alt', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(50), unlocked: false, bonus: { upgradeCostReductionAdditive: new Decimal(0.03) } },
    { id: 'arquiteto', name: 'Arquiteto', description: 'Compre 200 upgrades.', bonusDescription: 'Bônus: +10% de eficácia de todas melhorias (permanente).', icon: 'fas fa-tools', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(200), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.10), ippsMultiplier: new Decimal(1.10) } },
    { id: 'devotoDaMelhoria', name: 'Devoto da Melhoria', description: 'Compre 500 upgrades.', bonusDescription: 'Bônus: Desbloqueia o traço "Galinheiro" - Começa com 10 incubadoras básicas.', icon: 'fas fa-hand-holding-heart', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(500), unlocked: false, unlocksTrait: 'galinheiro' },
    { id: 'maximizado', name: 'Maximizado', description: 'Compre 1.000 upgrades.', bonusDescription: 'Bônus: Produção geral +10% (permanente).', icon: 'fas fa-chart-line', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(1000), unlocked: false, bonus: { clicksPerClickMultiplier: new Decimal(1.10), ippsMultiplier: new Decimal(1.10) } },
    { id: 'mestreDaEvolucao', name: 'Mestre da Evolução', description: 'Compre 5.000 upgrades.', bonusDescription: 'Bônus: Todos multiplicadores permanentes aumentados em +2%.', icon: 'fas fa-gem', condition: (game) => game.totalUpgradesPurchasedEver.greaterThanOrEqualTo(5000), unlocked: false, bonus: { finalMultiplierBoost: new Decimal(1.02) } },

    // Achievements for new Traits
    { id: 'ach_plasmaClicks', name: 'Energia Cinética', description: 'Clique 10.000 vezes em uma única run.', bonusDescription: 'Desbloqueia o traço "Pulso de Plasma".', icon: 'fas fa-bolt-lightning', condition: (game) => false, unlocked: false, unlocksTrait: 'plasmaPulse' },
    { id: 'ach_frozenTime', name: 'Congelado no Tempo', description: 'Fique 10 minutos sem clicar (em jogo ativo).', bonusDescription: 'Desbloqueia o traço "Casca Gélida".', icon: 'fas fa-snowflake', condition: (game) => false, unlocked: false, unlocksTrait: 'frostShell' },
    { id: 'ach_rupturePathChosen5', name: 'Explorador da Ruptura', description: 'Escolha o Caminho da Ruptura 5 vezes.', bonusDescription: 'Desbloqueia o traço "Partícula do Vazio".', icon: 'fas fa-atom', condition: (game) => false, unlocked: false, unlocksTrait: 'voidParticle' },
    { id: 'ach_quantumTranscender', name: 'Mestre dos Traços', description: 'Transcenda 10 vezes com 5 traços diferentes ativos em cada uma dessas runs.', bonusDescription: 'Desbloqueia o traço "Núcleo Quântico".', icon: 'fas fa-dice-d20', condition: (game) => false, unlocked: false, unlocksTrait: 'quantumCore' },
    { id: 'ach_allIncubatorTypes', name: 'Colecionador de Incubadoras', description: 'Tenha pelo menos 1 de cada tipo de incubadora em uma run.', bonusDescription: 'Desbloqueia o traço "Cascas Interligadas".', icon: 'fas fa-cubes', condition: (game) => false, unlocked: false, unlocksTrait: 'linkedShells' },
    { id: 'ach_20RunsCompleted', name: 'Peregrino Ancestral', description: 'Complete 20 runs (transcendências).', bonusDescription: 'Desbloqueia o traço "Sopro Ancestral".', icon: 'fas fa-mountain', condition: (game) => false, unlocked: false, unlocksTrait: 'ancestralBreath' },
    { id: 'ach_firstBossDefeated', name: 'Caçador de Gigantes', description: 'Derrote o primeiro chefe.', bonusDescription: 'Desbloqueia o traço "Embrião Hipercondutor".', icon: 'fas fa-dragon', condition: (game) => false, unlocked: false, unlocksTrait: 'hyperEgg' },
    { id: 'ach_embryoUniqueKills', name: 'Predador Versátil', description: 'Derrote 3 inimigos diferentes com o Embrião em uma única run.', bonusDescription: 'Desbloqueia o traço "Casca Neuronal".', icon: 'fas fa-brain', condition: (game) => false, unlocked: false, unlocksTrait: 'neuralShell' },
    { id: 'ach_embryoLevel10ThreeTimes', name: 'Mestre Embrionário', description: 'Alcance o nível 10 com o Embrião ao menos 3 vezes.', bonusDescription: 'Desbloqueia o traço "Pulsação Metabólica".', icon: 'fas fa-heartbeat', condition: (game) => false, unlocked: false, unlocksTrait: 'metabolicPulse' },
    { id: 'ach_playedDifferentTimesOfDay', name: 'Guardião do Tempo', description: 'Jogue o jogo em 3 horários diferentes do dia (manhã, tarde e noite).', bonusDescription: 'Desbloqueia o traço "Casca Fototrópica".', icon: 'fas fa-clock', condition: (game) => false, unlocked: false, unlocksTrait: 'phototropicShell' },
];

export const TRAITS: Trait[] = [
    // Existing Traits
    { id: 'doubleClickPower', name: 'Poder de Clique Duplo', description: 'Dobra o Poder por Clique, mas upgrades custam 1.5x mais.', effect: { clicksPerClickMultiplier: new Decimal(2), upgradeCostMultiplier: new Decimal(1.5) }, icon: 'fas fa-hand-sparkles' },
    { id: 'fastIncubation', name: 'Incubação Rápida', description: 'Dobra o Poder por Segundo, mas a Essência Transcendente ganha é 0.8x.', effect: { ippsMultiplier: new Decimal(2), etGainMultiplier: new Decimal(0.8) }, icon: 'fas fa-tachometer-alt' },
    { id: 'essenceHarvest', name: 'Colheita de Essência', description: 'Ganha 1.5x Essência Transcendente, mas o Poder por Clique e por Segundo é 0.7x.', effect: { etGainMultiplier: new Decimal(1.5), clicksPerClickMultiplier: new Decimal(0.7), ippsMultiplier: new Decimal(0.7) }, icon: 'fas fa-gem' },
    { id: 'porousShell', name: 'Casca Porosa', description: 'Preço das incubadoras básicas -50%.', effect: { basicIncubatorCostReduction: new Decimal(0.50) }, icon: 'fas fa-grip-lines' },
    { id: 'flexibleMembrane', name: 'Membrana Flexível', description: 'Cliques geram +10% de Poder de Incubação.', effect: { clicksPerClickMultiplier: new Decimal(1.10) }, icon: 'fas fa-plus-circle' },
    { id: 'steelFinger', name: 'Dedo de Aço', description: 'Cliques têm eficácia dobrada (x2).', effect: { clicksPerClickMultiplier: new Decimal(2.0) }, icon: 'fas fa-fist-raised' },
    { id: 'stoneFurnace', name: 'Forno de Pedra', description: 'Incubadoras básicas ganham +1 IPPS base por unidade.', effect: { basicIncubatorIppsBonus: new Decimal(1) }, icon: 'fas fa-fire-alt' },
    { id: 'noRushTrait', name: 'Sem Pressa', description: 'Aumenta em +50% a eficiência de ganho passivo de poder.', effect: { passiveIppsMultiplier: new Decimal(1.50) }, icon: 'fas fa-couch' },
    { id: 'galinheiro', name: 'Galinheiro', description: 'Começa com 10 incubadoras básicas em cada nova transcendência.', effect: { startingBasicIncubators: new Decimal(10) }, icon: 'fas fa-house-damage' },
    
    // New Traits
    { id: 'plasmaPulse', name: 'Pulso de Plasma', description: 'A cada 100 cliques, um pulso gera 10x o IPPC instantaneamente.', effect: { plasmaPulseTrigger: new Decimal(100), plasmaPulseMultiplier: new Decimal(10) }, icon: 'fas fa-broadcast-tower' }, // Changed icon to avoid duplicate
    { id: 'frostShell', name: 'Casca Gélida', description: 'Reduz o custo de todos upgrades passivos em 20%, mas IPPS é reduzido em 15%.', effect: { ippsUpgradeCostReduction: new Decimal(0.20), ippsMultiplierDebuff: new Decimal(0.85) }, icon: 'fas fa-icicles' }, // Changed icon
    { id: 'voidParticle', name: 'Partícula do Vazio', description: 'Ganha +3% de chance de segredos da ruptura aparecerem.', effect: { secretRuptureChanceBonus: new Decimal(0.03) }, icon: 'fas fa-atom-simple' }, // Changed icon
    { id: 'quantumCore', name: 'Núcleo Quântico', description: 'Aleatoriamente (a cada 60s), ativa um efeito de outro traço que você não possui, por 15s.', effect: { randomTraitActivation: true }, icon: 'fas fa-project-diagram' },
    { id: 'linkedShells', name: 'Cascas Interligadas', description: 'Todas incubadoras produzem +0.1 IPPS para cada tipo de incubadora diferente construída.', effect: { ippsPerUniqueIncubatorType: new Decimal(0.1) }, icon: 'fas fa-link' },
    { id: 'ancestralBreath', name: 'Sopro Ancestral', description: 'Aumenta o bônus base por Transcendência em +20% para cada run anterior completada.', effect: { transcendenceBonusEnhancementPerRun: new Decimal(0.2) }, icon: 'fas fa-wind' },
    { id: 'hyperEgg', name: 'Embrião Hipercondutor', description: 'Aumenta em 30% o ganho de XP do Embrião, mas reduz HP máximo do Embrião em 20%.', effect: { embryoExpGainMultiplier: new Decimal(1.3), embryoMaxHpMultiplier: new Decimal(0.8) }, icon: 'fas fa-charging-station' },
    { id: 'neuralShell', name: 'Casca Neuronal', description: 'O Embrião ganha +15% de chance de crítico, mas -10% de defesa base do Embrião.', effect: { embryoCritChanceBonus: new Decimal(0.15), embryoDefenseMultiplier: new Decimal(0.9) }, icon: 'fas fa-network-wired' },
    { id: 'metabolicPulse', name: 'Pulsação Metabólica', description: 'O Embrião regenera 2% de vida por segundo fora de combate, mas seu XP por inimigo é reduzido em 20%.', effect: { embryoHpRegenOutOfCombat: new Decimal(0.02), embryoExpGainDebuff: new Decimal(0.8) }, icon: 'fas fa-heart-pulse' }, // Changed icon
    { id: 'phototropicShell', name: 'Casca Fototrópica', description: 'O Embrião ganha +10% de todos os atributos (ataque, defesa, velocidade) durante o dia (06h–18h), mas -10% à noite.', effect: { embryoDayNightStatChange: new Decimal(0.10) }, icon: 'fas fa-sun' },
];

export const INITIAL_ACTIVE_ABILITIES: ActiveAbility[] = [
    { id: 'explosaoIncubadora', name: 'Explosão Incubadora', description: 'Multiplica produção por segundo em 3x durante 30s.', cost: new Decimal(1e7), cooldown: new Decimal(5).times(60), icon: 'fas fa-bomb', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(30), effect: { ippsMultiplier: new Decimal(3) } },
    { id: 'overclockCasca', name: 'Overclock de Casca', description: 'Todos cliques nos próximos 15s produzem 5x mais PI.', cost: new Decimal(2.5e7), cooldown: new Decimal(4).times(60), icon: 'fas fa-tachometer-alt', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(15), effect: { clicksPerClickMultiplier: new Decimal(5) } },
    { id: 'pulsoTemporal', name: 'Pulso Temporal', description: 'Adicione 60 segundos de produção passiva instantaneamente.', cost: new Decimal(5e7), cooldown: new Decimal(10).times(60), icon: 'fas fa-hourglass-end', purchased: false, cooldownRemaining: new Decimal(0), effect: { instantIppsGain: new Decimal(60) } },
    { id: 'impactoCritico', name: 'Impacto Crítico', description: 'Garante que todos os cliques nos próximos 20s serão críticos.', cost: new Decimal(8e7), cooldown: new Decimal(8).times(60), icon: 'fas fa-bullseye', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(20), effect: { guaranteedCriticals: true } },
    { id: 'ecoCosmico', name: 'Eco Cósmico', description: 'Reativa automaticamente a última habilidade usada com 50% do efeito original.', cost: new Decimal(1e9), cooldown: new Decimal(10).times(60), icon: 'fas fa-sync-alt', purchased: false, cooldownRemaining: new Decimal(0), effect: { reActivateLast: new Decimal(0.5) } },
    { id: 'modoFuriaIncubadora', name: 'Modo Fúria Incubadora', description: 'Durante 15s, todos os cliques nos próximos 15s são multiplicados por 100 vezes.', cost: new Decimal(5e9), cooldown: new Decimal(15).times(60), icon: 'fas fa-fire-alt', purchased: false, cooldownRemaining: new Decimal(0), tempEffectDuration: new Decimal(15), effect: { clicksPerClickMultiplier: new Decimal(100) } }
];

export const TRANSCENDENCE_MILESTONES_CONFIG: TranscendenceMilestoneInfo[] = [
    { count: 5, rewardType: 'MAX_TRAITS_INCREASE', description: "Slot extra de traço" },
    { count: 10, rewardType: 'UNLOCK_EGG_FORM', value: 'phoenixEgg', description: "Forma 'Ovo de Fênix' desbloqueada" },
    { count: 15, rewardType: 'OFFLINE_GAIN_MULTIPLIER_INCREASE', value: new Decimal(2) , description: "+100% ganho offline" },
    { count: 20, rewardType: 'UNLOCK_LEGENDARY_UPGRADE', value: 'legendaryCore', description: "Upgrade lendário 'Núcleo Lendário' desbloqueado" }
];

export const INITIAL_LEGENDARY_UPGRADES: LegendaryUpgrade[] = [
    {
        id: 'illuminatedRuin',
        name: 'Ruína Iluminada',
        description: 'Permite ativar 2 formas de ovo ao mesmo tempo.',
        icon: 'fas fa-dna',
        effect: { setMaxActiveEggForms: new Decimal(2) },
        unlockedSystem: false,
        activated: false
    }
];

export const INITIAL_SECRET_RUPTURE_UPGRADES: SecretRuptureUpgrade[] = [
    { id: 'finalEcho', name: 'Eco Final', description: 'Seus cliques críticos agora têm 50% de chance de acionar duas vezes.', icon: 'fas fa-bolt-lightning', effectType: 'critEchoChance', obtained: false, params: { critEchoTriggerChance: new Decimal(0.5) } },
    { id: 'memoryOfAllTranscendenceSecret', name: 'Memória de Toda Transcendência', description: 'Ganha +1% de multiplicador global por cada transcendência passada.', icon: 'fas fa-brain', effectType: 'globalMultiplierPerTranscendence', obtained: false },
    { id: 'stellarSparkSecret', name: 'Fagulha Estelar', description: '+250% produção passiva ao ficar mais de 5 minutos sem clicar.', icon: 'fas fa-star-of-life', effectType: 'longIdlePassiveBoost', obtained: false, params: { idleThresholdSeconds: new Decimal(5 * 60), bonusMultiplier: new Decimal(2.5) } },
    { id: 'paradoxCore', name: 'Núcleo Paradoxal', description: 'Ganha 1 ET extra toda vez que clicar exatamente 666 vezes nesta run.', icon: 'fas fa-atom', effectType: 'etOnSpecificClicks', obtained: false },
    { id: 'inverseFlame', name: 'Chama Inversa', description: 'Quanto menor seu PI, maior o bônus de produção (+1% por cada 1.000 PI a menos de 100k PI, até +100%).', icon: 'fas fa-temperature-low', effectType: 'inversePIProductionBonus', obtained: false, params: { basePIForBonus: new Decimal(100000), piChunkForBonus: new Decimal(1000), percentPerChunk: new Decimal(0.01) } },
    { id: 'theLastTrait', name: 'O Último Traço', description: 'Ganha 1 traço aleatório mesmo com slots cheios (ao ser obtido).', icon: 'fas fa-user-plus', effectType: 'extraRandomTrait', obtained: false },
    { id: 'leadKey', name: 'Chave de Chumbo', description: 'Desbloqueia um botão secreto que pode ser usado 1x por dia real para gerar +1 Ovo Temporário.', icon: 'fas fa-key', effectType: 'unlocksDailyTempEggButton', obtained: false },
    { id: 'titheRitual', name: 'Ritual do Dízimo', description: 'Sacrifique 30% do total de níveis de Melhorias Regulares e ganhe +1 Ovo Temporário (cooldown de 12 horas).', icon: 'fa-solid fa-fire-alt',  effectType: 'unlocksSacrificeRitualButton', obtained: false }
];
export const TITHE_RITUAL_SACRIFICE_PERCENTAGE = new Decimal(0.3); 

export const FAGULHA_ESTELAR_IDLE_THRESHOLD_SECONDS = new Decimal(5 * 60);
export const FAGULHA_ESTELAR_BONUS_MULTIPLIER = new Decimal(2.5); 

export const CHAMA_INVERSA_MAX_PI_FOR_BONUS = new Decimal(100000);
export const CHAMA_INVERSA_PI_CHUNK = new Decimal(1000);
export const CHAMA_INVERSA_PERCENT_PER_CHUNK = new Decimal(0.01);

// New Post-Transcendence Random Events
const applyReflexoInversoAceitar = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, showMessage: (text: string, duration?: number) => void) => {
    setGameState(prev => ({ 
        ...prev, 
        transcendentEssence: prev.transcendentEssence.plus(5), 
        postTranscendenceEventUpgradeCostMultiplier: new Decimal(2) 
    }));
    showMessage("+5 ET! Todas as melhorias custarão o dobro nesta run.", 3000);
};

const applyReflexoInversoNegar = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, showMessage: (text: string, duration?: number) => void) => {
    setGameState(prev => ({ 
        ...prev, 
        temporaryEggs: prev.temporaryEggs.plus(1), 
        postTranscendenceEventGlobalProductionMultiplier: new Decimal(0.5) 
    }));
    showMessage("+1 Ovo Temporário! Produção global reduzida em 50% nesta run.", 3000);
};

const applyChoroEmbriaoConter = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, showMessage: (text: string, duration?: number) => void) => {
    setGameState(prev => ({ 
        ...prev, 
        modularEXP: prev.modularEXP.plus(500), 
        areEmbryoUpgradesDisabledThisRun: true 
    }));
    showMessage("+500 EXP Modular! Melhorias do embrião desabilitadas nesta run.", 3000);
};

const applyChoroEmbriaoLiberar = (gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>>, showMessage: (text: string, duration?: number) => void) => {
    setGameState(prev => ({ 
        ...prev, 
        embryoCurrentEXP: prev.embryoCurrentEXP.times(0.5).floor(), 
        postTranscendenceEventEnemyEXPMultiplier: new Decimal(2) 
    }));
    showMessage("50% do EXP do embrião perdido! Ganho de EXP por inimigos dobrado nesta run.", 3000);
};

export const POST_TRANSCENDENCE_RANDOM_EVENTS: GameEvent[] = [
    {
        id: 'reflexo_inverso',
        name: 'Reflexo Inverso',
        description: 'Uma versão corrompida de si mesmo surge do vácuo entre as realidades.',
        options: [
            { text: 'Aceitar o Reflexo', consequence: '+5 ET, mas todos as melhorias custam o dobro nessa run.', applyEffect: applyReflexoInversoAceitar },
            { text: 'Negar o Reflexo', consequence: '+1 Ovo Temporário, mas sua produção global é reduzida permanentemente em 50% nesta run.', applyEffect: applyReflexoInversoNegar }
        ]
    },
    {
        id: 'choro_do_embriao',
        name: 'Choro do Embrião',
        description: 'Seu Ovo Embrião pulsa de forma descontrolada, exigindo atenção.',
        options: [
            { text: 'Conter o choro', consequence: 'Ganha 500 XP modular, mas perde acesso aos upgrades do embrião nesta run.', applyEffect: applyChoroEmbriaoConter },
            { text: 'Liberar a energia', consequence: 'Perde 50% do XP do embrião, mas dobra permanentemente a EXP obtida por inimigos nesta run.', applyEffect: applyChoroEmbriaoLiberar }
        ]
    }
];


export const TRANSCENDENCE_SPAM_PENALTY_DURATION_SECONDS = new Decimal(1800); 
export const ESSENCE_PATH_BONUS_ET = new Decimal(5);
export const RUPTURE_PATH_BUFF_DURATION_SECONDS = new Decimal(5 * 60); 
export const RUPTURE_PATH_BUFF_GLOBAL_MULTIPLIER = new Decimal(2); 
export const LEAD_KEY_COOLDOWN_MS = 24 * 60 * 60 * 1000; 
export const TITHE_RITUAL_COOLDOWN_MS = 12 * 60 * 60 * 1000; 

export const BASE_ENEMY_HP = new Decimal(50);
export const ENEMY_HP_SCALING_FACTOR = new Decimal(1.25);
export const BOSS_INTERVAL = 10; 
export const BOSS_HP_MULTIPLIER = new Decimal(2);
export const BOSS_EXP_MULTIPLIER = new Decimal(3);
export const ENEMY_EXP_DIVISOR = new Decimal(10);
export const ENEMY_PLACEHOLDER_ICONS = ['fas fa-spider', 'fas fa-ghost', 'fas fa-skull-crossbones', 'fas fa-bacterium', 'fas fa-meteor'];
export const BOSS_PLACEHOLDER_ICONS = ['fas fa-dragon', 'fas fa-pastafarianism', 'fas fa-biohazard']; 
export const COMBAT_FEEDBACK_MESSAGES = ["O inimigo estremece!", "Um estalo ecoa!", "A casca se rompe!", "Fragmentos voam!", "Energia crepita!"];

export const INITIAL_EMBRYO_UPGRADES: EmbryoUpgrade[] = [
    { id: 'embryoCritBoost', name: 'Espículas Reflexivas', description: 'Aumenta a chance de crítico em +5%.', cost: new Decimal(100), effect: { criticalChanceAdditive: new Decimal(0.05) }, purchased: false, icon: 'fas fa-crosshairs' },
    { id: 'embryoClickEcho', name: 'Casca Reativa', description: 'Cada clique tem 10% de chance de ativar novamente com 50% da força.', cost: new Decimal(250), effect: { clickEchoChance: new Decimal(0.1), clickEchoMultiplier: new Decimal(0.5) }, purchased: false, icon: 'fas fa-satellite-dish' },
    { id: 'embryoPassiveRegen', name: 'Essência Pulsante', description: 'Adiciona +1 PI/s passivo extra (base).', cost: new Decimal(500), effect: { ipps: new Decimal(1) }, purchased: false, icon: 'fas fa-heartbeat' },
    { id: 'embryoExpBoost', name: 'Aprendizado Acelerado', description: 'Aumenta o ganho de EXP Modular em +10%.', cost: new Decimal(750), effect: { modularEXPGainMultiplier: new Decimal(1.10) }, purchased: false, icon: 'fas fa-brain' },
    { id: 'embryoVitalPulse', name: 'Pulso Vital do Embrião', description: 'O embrião emite pulsos vitais, concedendo +0.1 PI/s base adicional para cada nível do embrião.', cost: new Decimal(1000), effect: { bonusPIPerEmbryoLevel: new Decimal(0.1) }, purchased: false, icon: 'fas fa-heart-pulse' },
    { id: 'embryoReinforcedCarapace', name: 'Carapaça Reforçada', description: 'A casca do embrião se torna mais densa, reduzindo o custo de todas as melhorias regulares de PI em 2%.', cost: new Decimal(1250), effect: { regularUpgradeCostReduction: new Decimal(0.02) }, purchased: false, icon: 'fas fa-shield-alt' },
    { id: 'embryoEnergeticBulwark', name: 'Baluarte Energético', description: 'O embrião projeta uma barreira sutil, adicionando +5 ao dano base dos seus cliques contra inimigos.', cost: new Decimal(1500), effect: { baseClickDamageToEnemiesAdditive: new Decimal(5) }, purchased: false, icon: 'fas fa-bahai' },
];

export const INITIAL_EMBRYO_LEVEL = new Decimal(1);
export const INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL = new Decimal(100);
export const EMBRYO_EXP_SCALING_FACTOR = new Decimal(2);
export const EMBRYO_INITIAL_ICON = 'fas fa-egg';

export const EMBRYO_LEVEL_MILESTONES: EmbryoLevelMilestone[] = [
    { level: 1, expRequired: new Decimal(0), icon: 'fas fa-egg', nameSuffix: "Primordial" }, 
    { level: 5, expRequired: new Decimal(1500), icon: 'fas fa-kiwi-bird', nameSuffix: "Incubado" }, 
    { level: 10, expRequired: new Decimal(32000), icon: 'fas fa-crow', nameSuffix: "Juvenil" }, 
    { level: 15, expRequired: new Decimal(500000), icon: 'fas fa-dove', nameSuffix: "Ascendente" },
    { level: 20, expRequired: new Decimal(10000000), icon: 'fas fa-phoenix', nameSuffix: "Mítico" } 
];

// New Embryo System Constants
export const EMBRYO_BASE_STATS_PER_LEVEL: { [key in keyof EmbryoStats]?: Decimal } = {
    maxHp: new Decimal(10),      
    attack: new Decimal(2),       
    defense: new Decimal(1),      
    speed: new Decimal(0.5),      
    critChance: new Decimal(0.01),
    poisonChance: new Decimal(0),
    bossDamageBonus: new Decimal(0),
    doubleHitChance: new Decimal(0),
    lifestealRate: new Decimal(0),
    chaosEffectChance: new Decimal(0),
    // New Defensive Stats
    enemyDelayChance: new Decimal(0),
    damageReflection: new Decimal(0),
    critResistance: new Decimal(0),
    periodicShieldValue: new Decimal(0),
    dodgeChance: new Decimal(0),
    overallDamageReduction: new Decimal(0),
    hpRegenPerInterval: new Decimal(0),
};

export const INITIAL_EMBRYO_SHOP_ITEMS: EmbryoItem[] = [
    // Ofensivo - Common & Uncommon
    { id: 'embryo_w_001', name: 'Garra Afiada', description: '+5 Ataque', icon: 'fas fa-claw-marks', rarity: 'Common', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(100) }, effects: [{ stat: 'attack', value: new Decimal(5), type: 'flat' }] },
    { id: 'embryo_w_002', name: 'Lâmina Rústica', description: '+12 Ataque', icon: 'fas fa-sword', rarity: 'Uncommon', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(500) }, effects: [{ stat: 'attack', value: new Decimal(12), type: 'flat' }] },
    
    // Ofensivo - Rare
    { id: 'embryo_w_rare_001', name: 'Presas de Obsidiana', description: '+25 Ataque. Nota: “Forjadas nas profundezas de um ovo vulcânico.”', icon: 'fas fa-gem', rarity: 'Rare', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(1500) }, effects: [{ stat: 'attack', value: new Decimal(25), type: 'flat' }] },
    { id: 'embryo_w_rare_002', name: 'Dente Envenenado', description: '+15 Ataque, +10% chance de dano contínuo por 3s. Nota: “Um toque basta.”', icon: 'fas fa-skull-crossbones', rarity: 'Rare', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(1800) }, effects: [{ stat: 'attack', value: new Decimal(15), type: 'flat' }, { stat: 'poisonChance', value: new Decimal(0.10), type: 'flat' }, { stat: 'poisonDurationSeconds', value: new Decimal(3), type: 'flat' }] },
    
    // Ofensivo - Epic
    { id: 'embryo_w_epic_001', name: 'Ferro do Eclipse', description: '+40 Ataque, +5% crítico. Nota: “Forjado na sombra entre dois ciclos.”', icon: 'fas fa-moon', rarity: 'Epic', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(3500) }, effects: [{ stat: 'attack', value: new Decimal(40), type: 'flat' }, { stat: 'critChance', value: new Decimal(0.05), type: 'flat' }] },
    { id: 'embryo_w_epic_002', name: 'Espinhos Hiperativos', description: '+30 Ataque, +10 Velocidade de Ação. Nota: “Reage antes mesmo do pensamento.”', icon: 'fas fa-bolt', rarity: 'Epic', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(4000) }, effects: [{ stat: 'attack', value: new Decimal(30), type: 'flat' }, { stat: 'speed', value: new Decimal(10), type: 'flat' }] },

    // Ofensivo - Legendary
    { id: 'embryo_w_legendary_001', name: 'Mandíbula Astral', description: '+60 Ataque, +10% de dano bônus contra chefes. Nota: “Ela devora o próprio destino.”', icon: 'fas fa-meteor', rarity: 'Legendary', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(7500) }, effects: [{ stat: 'attack', value: new Decimal(60), type: 'flat' }, { stat: 'bossDamageBonus', value: new Decimal(0.10), type: 'flat' }] },
    { id: 'embryo_w_legendary_002', name: 'Lâmina da Fratura Temporal', description: '+50 Ataque, chance de atacar duas vezes. Nota: “Golpeia em antes, depois e agora.”', icon: 'fas fa-unlink', rarity: 'Legendary', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(8200) }, effects: [{ stat: 'attack', value: new Decimal(50), type: 'flat' }, { stat: 'doubleHitChance', value: new Decimal(0.15), type: 'flat' }] },

    // Ofensivo - Mythic
    { id: 'embryo_w_mythic_001', name: 'O Olho da Ruptura', description: '+80 Ataque, +20% crítico, +10% chance de efeito caótico. Nota: “Vê e desfaz.”', icon: 'fas fa-eye', rarity: 'Mythic', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(15000) }, effects: [{ stat: 'attack', value: new Decimal(80), type: 'flat' }, { stat: 'critChance', value: new Decimal(0.20), type: 'flat' }, { stat: 'chaosEffectChance', value: new Decimal(0.10), type: 'flat' }] },
    { id: 'embryo_w_mythic_002', name: 'Garra de Vórtice Vivo', description: '+65 Ataque, +20 Velocidade, +5% de absorção de vida. Nota: “Devora o tempo entre os batimentos.”', icon: 'fas fa-tornado', rarity: 'Mythic', equipmentType: 'Weapon', storeCategory: 'Ofensivo', cost: { currency: 'modularEXP', amount: new Decimal(16000) }, effects: [{ stat: 'attack', value: new Decimal(65), type: 'flat' }, { stat: 'speed', value: new Decimal(20), type: 'flat' }, { stat: 'lifestealRate', value: new Decimal(0.05), type: 'flat' }] },

    // Defensivo (Existing)
    { id: 'embryo_a_001', name: 'Casca Reforçada', description: '+10 Defesa', icon: 'fas fa-shield-alt', rarity: 'Common', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(100) }, effects: [{ stat: 'defense', value: new Decimal(10), type: 'flat' }] },
    { id: 'embryo_a_002', name: 'Placa de Quitina', description: '+20 Defesa, +50 HP Máx', icon: 'fas fa-shield-cross', rarity: 'Uncommon', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(600) }, effects: [{ stat: 'defense', value: new Decimal(20), type: 'flat' }, {stat: 'maxHp', value: new Decimal(50), type: 'flat'}] },
    
    // Defensivo (New) - Tier Common
    { id: 'embryo_a_def_common_001', name: 'Carapaça de Ovo Cru', rarity: 'Common', description: '+5 Defesa. Nota: “Melhor que nada. Quase.”', icon: 'fas fa-shield-virus', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(100) }, effects: [{ stat: 'defense', value: new Decimal(5), type: 'flat' }] },
    // Defensivo (New) - Tier Uncommon
    { id: 'embryo_a_def_uncommon_001', name: 'Camada de Cálcio', rarity: 'Uncommon', description: '+12 Defesa. Nota: “Pura reserva de sobrevivência.”', icon: 'fas fa-layer-group', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(500) }, effects: [{ stat: 'defense', value: new Decimal(12), type: 'flat' }] },
    // Defensivo (New) - Tier Rare
    { id: 'embryo_a_def_rare_001', name: 'Casca Congelante', rarity: 'Rare', description: '+20 Defesa, inimigos têm 5% de chance de atacar com delay. Nota: “Toca e congela o tempo.”', icon: 'fas fa-snowflake', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(1500) }, effects: [{ stat: 'defense', value: new Decimal(20), type: 'flat' }, { stat: 'enemyDelayChance', value: new Decimal(0.05), type: 'flat' }] },
    { id: 'embryo_a_def_rare_002', name: 'Mucosa Reativa', rarity: 'Rare', description: '+15 Defesa, reflete 5% do dano recebido. Nota: “Não só absorve... devolve.”', icon: 'fas fa-flask-potion', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(1800) }, effects: [{ stat: 'defense', value: new Decimal(15), type: 'flat' }, { stat: 'damageReflection', value: new Decimal(0.05), type: 'flat' }] },
    // Defensivo (New) - Tier Epic
    { id: 'embryo_a_def_epic_001', name: 'Barreira de Queratina', rarity: 'Epic', description: '+30 Defesa, +10% resistência a críticos. Nota: “Criado para resistir ao inevitável.”', icon: 'fas fa-bone', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(3500) }, effects: [{ stat: 'defense', value: new Decimal(30), type: 'flat' }, { stat: 'critResistance', value: new Decimal(0.10), type: 'flat' }] },
    { id: 'embryo_a_def_epic_002', name: 'Escudo de Membrana', rarity: 'Epic', description: 'Gera um escudo de 50 HP a cada 60s. Nota: “Parece frágil. Não é.”', icon: 'fas fa-shield-heart', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(4000) }, effects: [{ stat: 'periodicShieldValue', value: new Decimal(50), type: 'flat' }] },
    // Defensivo (New) - Tier Legendary
    { id: 'embryo_a_def_legendary_001', name: 'Ovo Fossilizado', rarity: 'Legendary', description: '+50 Defesa, -10% velocidade. Nota: “Não quebra. Nem se move.”', icon: 'fas fa-gem', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(7500) }, effects: [{ stat: 'defense', value: new Decimal(50), type: 'flat' }, { stat: 'speed', value: new Decimal(-0.10), type: 'percent_base' }] },
    { id: 'embryo_a_def_legendary_002', name: 'Pele de Umbra', rarity: 'Legendary', description: '+35 Defesa, +15% de esquiva contra ataques físicos. Nota: “Você nunca acerta o que não enxerga.”', icon: 'fas fa-ghost', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(8200) }, effects: [{ stat: 'defense', value: new Decimal(35), type: 'flat' }, { stat: 'dodgeChance', value: new Decimal(0.15), type: 'flat' }] },
    // Defensivo (New) - Tier Mythic
    { id: 'embryo_a_def_mythic_001', name: 'Coração de Sílica Negra', rarity: 'Mythic', description: '+70 Defesa, dano sofrido reduzido em 8%. Nota: “Cada golpe quebra a realidade antes da casca.”', icon: 'fas fa-gem', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(15000) }, effects: [{ stat: 'defense', value: new Decimal(70), type: 'flat' }, { stat: 'overallDamageReduction', value: new Decimal(0.08), type: 'flat' }] },
    { id: 'embryo_a_def_mythic_002', name: 'Aura de Proteína Celestial', rarity: 'Mythic', description: '+50 Defesa, regenera 5% do HP máximo a cada 10s. Nota: “A perfeição orgânica absoluta.”', icon: 'fas fa-sun', equipmentType: 'Armor', storeCategory: 'Defensivo', cost: { currency: 'modularEXP', amount: new Decimal(16000) }, effects: [{ stat: 'defense', value: new Decimal(50), type: 'flat' }, { stat: 'hpRegenPerInterval', value: new Decimal(0.05), type: 'flat' }] },

    // Passivo
    { id: 'embryo_p_001', name: 'Chip de Vitalidade P', description: '+5% HP Máx Base', icon: 'fas fa-heart-circle', rarity: 'Common', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: { currency: 'modularEXP', amount: new Decimal(200) }, effects: [{ stat: 'maxHp', value: new Decimal(0.05), type: 'percent_base' }] },
    { id: 'embryo_p_002', name: 'Chip de Velocidade P', description: '+10% Velocidade Base', icon: 'fas fa-running', rarity: 'Uncommon', equipmentType: 'PassiveChip', storeCategory: 'Passivo', cost: { currency: 'modularEXP', amount: new Decimal(750) }, effects: [{ stat: 'speed', value: new Decimal(0.10), type: 'percent_base' }] },
];


export const RARITY_COLORS_EMBRYO: Record<EmbryoItemRarity, { text: string; bg: string; border: string }> = {
    Common:    { text: 'text-slate-300',  bg: 'bg-slate-700/50',  border: 'border-slate-500' },
    Uncommon:  { text: 'text-green-400',  bg: 'bg-green-700/40',  border: 'border-green-500' },
    Rare:      { text: 'text-blue-400',   bg: 'bg-blue-700/40',   border: 'border-blue-500' },
    Epic:      { text: 'text-purple-400', bg: 'bg-purple-700/40', border: 'border-purple-500' },
    Legendary: { text: 'text-orange-400', bg: 'bg-orange-700/40', border: 'border-orange-500' },
    Mythic:    { text: 'text-amber-300',   bg: 'bg-amber-900/60',   border: 'border-amber-500' }, // Updated Mythic to Gold/Amber
};

const initialEmbryoBaseStats: EmbryoStats = {
    currentHp: (EMBRYO_BASE_STATS_PER_LEVEL.maxHp || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    maxHp: (EMBRYO_BASE_STATS_PER_LEVEL.maxHp || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    attack: (EMBRYO_BASE_STATS_PER_LEVEL.attack || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    defense: (EMBRYO_BASE_STATS_PER_LEVEL.defense || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    speed: (EMBRYO_BASE_STATS_PER_LEVEL.speed || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    critChance: (EMBRYO_BASE_STATS_PER_LEVEL.critChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    poisonChance: (EMBRYO_BASE_STATS_PER_LEVEL.poisonChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    bossDamageBonus: (EMBRYO_BASE_STATS_PER_LEVEL.bossDamageBonus || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    doubleHitChance: (EMBRYO_BASE_STATS_PER_LEVEL.doubleHitChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    lifestealRate: (EMBRYO_BASE_STATS_PER_LEVEL.lifestealRate || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    chaosEffectChance: (EMBRYO_BASE_STATS_PER_LEVEL.chaosEffectChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    // New Defensive Stats
    enemyDelayChance: (EMBRYO_BASE_STATS_PER_LEVEL.enemyDelayChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    damageReflection: (EMBRYO_BASE_STATS_PER_LEVEL.damageReflection || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    critResistance: (EMBRYO_BASE_STATS_PER_LEVEL.critResistance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    periodicShieldValue: (EMBRYO_BASE_STATS_PER_LEVEL.periodicShieldValue || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    dodgeChance: (EMBRYO_BASE_STATS_PER_LEVEL.dodgeChance || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    overallDamageReduction: (EMBRYO_BASE_STATS_PER_LEVEL.overallDamageReduction || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
    hpRegenPerInterval: (EMBRYO_BASE_STATS_PER_LEVEL.hpRegenPerInterval || new Decimal(0)).times(INITIAL_EMBRYO_LEVEL),
};


export const INITIAL_GAME_STATE: GameState = {
    incubationPower: new Decimal(0),
    temporaryEggs: new Decimal(0),
    clicksPerClick: new Decimal(2), 
    ipps: new Decimal(0), 
    effectiveClicksPerClick: new Decimal(2),
    effectiveIpps: new Decimal(0),
    transcendentEssence: new Decimal(0),
    currentStageIndex: 0,
    currentStageData: EGG_STAGES[0],
    nextStageThreshold: EGG_STAGES[1]?.threshold || null,
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
    unlockedTraits: [],
    activeTraits: [],
    maxActiveTraits: 5, 
    isSoundEnabled: false,
    isMusicEnabled: false,
    lastPlayedTimestamp: Date.now(),
    offlineIncubationRate: new Decimal(0.05),
    lastClickTime: Date.now(),
    activeIdleTime: new Decimal(0),
    abyssalIdleBonusTime: new Decimal(0),
    transcendenceThreshold: new Decimal(5000), 
    essencePerPI: new Decimal(50000), 
    finalEggThreshold: new Decimal(2000), 
    goldenBlessingMultiplier: new Decimal(1),
    criticalClickChance: new Decimal(0.05),
    effectiveCriticalClickChance: new Decimal(0.05),

    softCapThresholdCPC: new Decimal(1_000_000), 
    softCapThresholdIPPS: new Decimal(1_000_000), 
    softCapScalingFactor: new Decimal(0.5),   

    currentEventData: null,
    
    explosaoIncubadoraTimer: new Decimal(0),
    overclockCascaTimer: new Decimal(0),
    impactoCriticoTimer: new Decimal(0),
    furiaIncubadoraTimer: new Decimal(0),
    lastUsedActiveAbilityId: null,
    curiosoTimer: new Decimal(0),

    activeTemporaryBuff: null,

    transcendenceSpamPenaltyActive: false,
    transcendenceSpamPenaltyDuration: new Decimal(0),

    lastLeadKeyClickTimestamp: 0,
    lastTitheRitualTimestamp: 0,

    upgradesData: INITIAL_REGULAR_UPGRADES.map(u => ({ ...u })),
    transcendentalBonusesData: INITIAL_TRANSCENDENTAL_BONUSES.map(b => ({ ...b })),
    etPermanentUpgradesData: INITIAL_ET_PERMANENT_UPGRADES.map(epu => ({ ...epu })),
    specialUpgradesData: INITIAL_SPECIAL_UPGRADES.map(su => ({ ...su })),
    achievementsData: INITIAL_ACHIEVEMENTS.map(ach => ({ ...ach })),
    activeAbilitiesData: INITIAL_ACTIVE_ABILITIES.map(aa => ({ ...aa })),
    legendaryUpgradesData: INITIAL_LEGENDARY_UPGRADES.map(lu => ({ ...lu })),
    secretRuptureUpgradesData: INITIAL_SECRET_RUPTURE_UPGRADES.map(sru => ({ ...sru })), 
    secretRuptureSystemUnlocked: false,
    
    showNicknameModal: true, // MODIFIED: Set to true for initial load
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
    mestreDaEvolucaoBonus: new Decimal(1),

    // Combat System State
    modularEXP: new Decimal(0),
    enemiesDefeatedTotal: new Decimal(0),
    currentEnemy: null, 
    combatLog: [],

    // Embryo System State
    embryoLevel: INITIAL_EMBRYO_LEVEL,
    embryoCurrentEXP: new Decimal(0),
    embryoEXPToNextLevel: INITIAL_EMBRYO_EXP_TO_NEXT_LEVEL,
    embryoUpgradesData: INITIAL_EMBRYO_UPGRADES.map(eu => ({...eu})),
    embryoIcon: EMBRYO_INITIAL_ICON,

    // New Embryo System Fields
    embryoBaseStats: { ...initialEmbryoBaseStats },
    embryoEffectiveStats: { ...initialEmbryoBaseStats }, // Initially same as base
    embryoInventory: [],
    equippedEmbryoItems: { weapon: null, armor: null, passiveChip: null }, // Uses lowercase keys
    embryoShopItems: INITIAL_EMBRYO_SHOP_ITEMS.map(item => ({...item})), // Populate shop from constants

    // Embryo Inventory Modal State
    showEmbryoInventoryModal: false,
    currentSlotToEquip: null,

    showCombatModal: false,
    showEmbryoModal: false,
    
    message: null,

    // New Trait Tracking Fields
    plasmaPulseClickCounter: new Decimal(0),
    lastInteractionTime: Date.now(), // For frostShell achievement
    rupturePathChoicesCount: new Decimal(0), // For voidParticle trait
    runsWithFiveDifferentTraitsCount: new Decimal(0), // For quantumCore trait
    incubatorTypesOwnedThisRun: new Set<string>(), // For linkedShells trait (runtime will be Set<string>)
    totalRunsTranscended: new Decimal(0), // For ancestralBreath trait
    firstBossDefeatedThisRun: false, // For hyperEgg trait
    uniqueEnemiesDefeatedThisRunByEmbryo: new Set<string>(), // For neuralShell trait (runtime will be Set<string>)
    embryoLevel10ReachedCount: new Decimal(0), // For metabolicPulse trait
    dailyLoginTracker: { morning: false, afternoon: false, night: false }, // For phototropicShell trait
    quantumCoreActiveRandomTraitId: null, // For quantumCore trait effect
    quantumCoreActiveRandomTraitDuration: new Decimal(0), // For quantumCore trait effect
    quantumCoreInternalCooldown: new Decimal(0), // For quantumCore trait itself

    // New Post-Transcendence Event Effect Flags
    postTranscendenceEventUpgradeCostMultiplier: new Decimal(1),
    postTranscendenceEventGlobalProductionMultiplier: new Decimal(1),
    areEmbryoUpgradesDisabledThisRun: false,
    postTranscendenceEventEnemyEXPMultiplier: new Decimal(1),
};

export const GAME_SAVE_KEY = 'ovoClickerReactSave_v10.9'; // Incremented for nickname modal fix
