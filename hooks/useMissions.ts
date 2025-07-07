
import { useCallback } from 'react';
import { Decimal } from 'decimal.js';
import { GameState, DailyMission, MissionRarity, MissionDefinition, MissionRewardType, ActiveTemporaryBuffState, MissionStatus } from '../types';
import { MISSION_DEFINITIONS, MISSION_REWARD_BUFFS } from '../constants/missions'; 
import { formatNumber, playSound } from '../utils'; // Added playSound

// Helper to create a unique ID for a mission instance
const createMissionInstanceId = (defId: string, rarity: MissionRarity, dateSeed: string, index: number): string => {
  return `${defId}_${rarity.toLowerCase()}_${dateSeed.replace(/\//g, '-')}_${index}`;
};

export const useMissions = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  showMessage: (text: string, duration?: number) => void
) => {
  const checkAndGenerateDailyMissions = useCallback(() => {
    setGameState(prev => {
      const todayStr = new Date().toLocaleDateString();
      if (prev.lastMissionGenerationDate === todayStr && prev.dailyMissions.length > 0) {
        return prev; // Missions already generated for today
      }

      const availableDefinitions = [...MISSION_DEFINITIONS];
      const newDailyMissions: DailyMission[] = [];
      const usedDefinitionIds = new Set<string>();

      for (let i = 0; i < 3; i++) { 
        if (availableDefinitions.length === 0) break;

        let missionDefIndex = Math.floor(Math.random() * availableDefinitions.length);
        let selectedDefinition = availableDefinitions[missionDefIndex];
        
        let attempts = 0;
        while(usedDefinitionIds.has(selectedDefinition.definitionId) && attempts < availableDefinitions.length * 2) {
            missionDefIndex = Math.floor(Math.random() * availableDefinitions.length);
            selectedDefinition = availableDefinitions[missionDefIndex];
            attempts++;
        }
        usedDefinitionIds.add(selectedDefinition.definitionId);

        const rarityIndex = Math.floor(Math.random() * selectedDefinition.possibleRarities.length);
        const rarity = selectedDefinition.possibleRarities[rarityIndex];
        const details = selectedDefinition.generateDetails(rarity);

        const missionInstance: DailyMission = {
          id: createMissionInstanceId(selectedDefinition.definitionId, rarity, todayStr, i),
          definitionId: selectedDefinition.definitionId,
          description: details.description,
          rarity: rarity,
          metricToTrack: selectedDefinition.metricToTrack,
          targetValue: details.targetValue,
          currentProgress: new Decimal(0),
          status: 'incomplete',
          reward: details.reward,
          icon: selectedDefinition.baseIcon,
          meta: {} 
        };
        newDailyMissions.push(missionInstance);
      }
      
      showMessage("Novas missões diárias disponíveis!", 3000);
      playSound('mission_received.mp3', prev.isSoundEnabled, 0.6); // Sound for new missions
      return {
        ...prev,
        dailyMissions: newDailyMissions,
        lastMissionGenerationDate: todayStr,
      };
    });
  }, [setGameState, showMessage]);

  const updateMissionProgress = useCallback((metric: string, incrementValue: Decimal, associatedData?: any) => {
    setGameState(prev => {
      let missionsUpdated = false;
      let missionJustCompleted = false;

      const updatedMissions: DailyMission[] = prev.dailyMissions.map((mission): DailyMission => { 
        if (mission.metricToTrack === metric && mission.status === 'incomplete') {
          
          const newProgress = mission.currentProgress.plus(incrementValue);
          const updatedCurrentProgress = Decimal.min(newProgress, mission.targetValue);
          let newStatus: MissionStatus = mission.status;

          if (updatedCurrentProgress.gte(mission.targetValue)) {
            newStatus = 'completed';
            if (mission.status === 'incomplete') { 
                showMessage(`Missão "${mission.description.substring(0,30)}..." completada!`, 2500);
                missionJustCompleted = true; // Flag that a mission was just completed
            }
          }
          missionsUpdated = true;
          return { ...mission, currentProgress: updatedCurrentProgress, status: newStatus };
        }
        return mission;
      });

      if (missionJustCompleted) {
        playSound('mission_complete.mp3', prev.isSoundEnabled, 0.7); // Sound for completing a mission
      }

      if (missionsUpdated) {
        return { ...prev, dailyMissions: updatedMissions };
      }
      return prev;
    });
  }, [setGameState, showMessage]);

  const claimMissionReward = useCallback((missionId: string) => {
    setGameState(prev => {
      const mission = prev.dailyMissions.find(m => m.id === missionId);
      if (!mission || mission.status !== 'completed') {
        if (mission && mission.status === 'claimed') showMessage("Recompensa já reivindicada.", 1500);
        else showMessage("Missão não completada ou não encontrada.", 1500);
        return prev;
      }

      let newModularEXP = prev.modularEXP;
      let newActiveTemporaryBuffs = [...prev.activeTemporaryBuffs];

      if (mission.reward.type === 'modularEXP') {
        newModularEXP = prev.modularEXP.plus(mission.reward.value);
        showMessage(`Recompensa reivindicada: +${formatNumber(mission.reward.value)} EXP Modular!`, 2000);
      } else if (mission.reward.type === 'temporaryBuff' && mission.reward.buffId && mission.reward.buffDuration) {
        const buffDefinition = MISSION_REWARD_BUFFS[mission.reward.buffId];
        if (buffDefinition) {
            // Logic to add a new buff. We can decide on stacking rules here.
            // For now, let's allow stacking different buffs.
            const newBuff: ActiveTemporaryBuffState = {
                ...buffDefinition,
                remainingDuration: mission.reward.buffDuration,
                source: 'mission',
            };
            newActiveTemporaryBuffs.push(newBuff);
            showMessage(`Buff "${buffDefinition.name}" ativado por ${formatNumber(mission.reward.buffDuration.div(60))} minutos!`, 2500);
        } else {
            showMessage(`Definição de buff "${mission.reward.buffId}" não encontrada.`, 2000);
        }
      }

      const updatedMissions: DailyMission[] = prev.dailyMissions.map(m =>
        m.id === missionId ? { ...m, status: 'claimed' } : m
      );
      
      // Consider playing a sound for claiming reward if desired
      // playSound('reward_claimed.mp3', prev.isSoundEnabled, 0.7);

      return {
        ...prev,
        modularEXP: newModularEXP,
        activeTemporaryBuffs: newActiveTemporaryBuffs,
        dailyMissions: updatedMissions,
      };
    });
  }, [setGameState, showMessage]);

  return { checkAndGenerateDailyMissions, updateMissionProgress, claimMissionReward };
};
