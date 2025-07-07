import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { 
    EmbryoPanel,
    EtBonusesDisplayPanel,
    EtPermanentUpgradesDisplayPanel,
    MetaUpgradesPanel,
    SpecialUpgradesPanel
} from '../../panels';

const RightColumn: React.FC = () => {
    return (
        <div className="main-col-right flex flex-col gap-3 sm:gap-4">
            <EmbryoPanel />
            <EtBonusesDisplayPanel />
            <EtPermanentUpgradesDisplayPanel />
            <MetaUpgradesPanel />
            <SpecialUpgradesPanel />
        </div>
    );
};

export default RightColumn;
