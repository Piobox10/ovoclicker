// constants/index.ts
// This file re-exports all constants from their respective modules
// within the 'constants' directory.

export * from './abilities'; // Added to export ABILITY_DEFINITIONS
export * from './collectibles'; // Exports COLLECTIBLE_EGG_DEFINITIONS, CLICKS_PER_COLLECTIBLE_EGG
export * from './hiddenDiscoveries';
export * from './missions';
export * from './skins';
export * from './fusion';
export * from './statusEffects'; // Also good to export statusEffects if they follow the same pattern
export * from './expeditionRewards'; // Added export
// Add exports for any other constant modules in this directory, e.g.:
// export * from './gameSettings';
// export * from './uiTexts';

// Note: The main 'constants.ts' file at the root level still defines and exports
// global constants like EGG_STAGES, INITIAL_REGULAR_UPGRADES, INITIAL_GAME_STATE etc.
// Imports should target either this 'constants/index.ts' (e.g., from '../../constants')
// or the root 'constants.ts' (e.g., from './constants' or '../constants')
// depending on the specific constant needed and the importing file's location.
// This file primarily serves directory-based imports for constants organized into sub-modules.