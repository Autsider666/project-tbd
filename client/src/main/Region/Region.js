import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

import { Settlement } from './Settlement';
import { ExpeditionSites } from './ExpeditionSites';

// const Party = () => <div>Party</div>

const Region = () => {
    const { regionRepository, selectedRegionId } = useGame()
    if (selectedRegionId === null) return <div />
    const region = regionRepository[selectedRegionId]

    const content = [
        { label: 'Expedition Sites', Component: ExpeditionSites,  },
        { label: 'Settlement', Component: Settlement, disable: region.settlement ? false : true },
        // { label: 'Party', Component: Party },
    ]

    if (!region) return <div />

    return (
        <div>
            <TabsWrapper key={region.id} content={content} />

        </div>
    )
}

export default Region 