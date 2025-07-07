import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { 
    CombatPanel, 
    RegularUpgradesPanel,
    FusionWorkshopPanel,
    EggFormsPanel,
    LegendarySecretUpgradesPanel
} from '../../panels';

const CenterColumn: React.FC = () => {
    return (
        <div className="main-col-center flex flex-col gap-3 sm:gap-4">
            <CombatPanel />
            <RegularUpgradesPanel />
            <FusionWorkshopPanel />
            <EggFormsPanel />
            <LegendarySecretUpgradesPanel />
        </div>
    );
};

export default CenterColumn;
