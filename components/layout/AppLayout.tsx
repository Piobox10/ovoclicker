import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import { GameState, EggForm, EmbryoStats, EmbryoEquipmentSlotKey, TranscendentalBonus, HiddenDiscoveryState, MetaUpgrade, EmbryoItem, PlayerCollectibleEgg, EggTeamBattleState, BattleEgg, BattleAbilityInstance, CollectibleEggDefinition, AbilityDefinition, BattleStatusEffectInstance, FloatingText, BattleReward, BattleStats, BattleStatusEffectType, AbilityEffectType, BattleStatType, LastStatusApplicationInfo, LastAcquiredEggInfo, CollectibleEggDisplayRarity, ExpeditionRewardOption, ActiveTemporaryBuffState, BattleEggRarity, TranscendenceInfoModalData, SacredRelicUpgrade } from '../types';
import { EGG_STAGES, TRAITS, EGG_FORMS_DATA, EMBRYO_BASE_STATS_PER_LEVEL, INITIAL_EMBRYO_SHOP_ITEMS, INITIAL_TRANSCENDENTAL_BONUSES, INITIAL_EMBRYO_UPGRADES, COMBAT_SPEED_OPTIONS, MAX_TEAM_SIZE, POST_TRANSCENDENCE_RANDOM_EVENTS, MAX_BATTLE_ROUNDS, COLLECTIBLE_EGG_RARITY_STYLES, EXPEDITION_MAX_STAGES, EXPEDITION_STAGES_CONFIG, ESSENCE_PATH_BONUS_ET, COLLECTIBLE_EGG_DEFINITIONS } from '../../constants';

import { LeftColumn, CenterColumn, RightColumn } from './columns';
import AppHeader from './AppHeader';
import { AppModals } from './AppModals';

const AppLayout: React.FC = () => {
    const { isLoading } = useGameContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] text-2xl">
                Carregando Ovo Clicker...
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="game-container-wrapper flex-grow min-w-0 w-full max-w-screen-2xl mx-auto">
                <div className="game-container flex flex-col gap-3 sm:gap-4 lg:gap-6 bg-[var(--bg-panel-secondary)] bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-[var(--border-primary)] w-full relative">
                    
                    <AppHeader />

                    <div className="main-content-grid grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        <LeftColumn />
                        <CenterColumn />
                        <RightColumn />
                    </div>

                    <AppModals />
                </div>
            </div>
        </React.Fragment>
    );
};

export default AppLayout;