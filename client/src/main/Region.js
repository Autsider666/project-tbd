import React from 'react'
import TabsWrapper from '../components/TabsWrapper'
import { useGame } from '../contexts/GameContext'

import Settlement from '../tabs/Settlement';
import ExpeditionSites from '../tabs/ExpeditionSites';

// const Party = () => <div>Party</div>

const Region = () => {
    const { selectedRegionId, selectedRegion : region } = useGame()
    if (selectedRegionId === null) return <div />

    const content = [
        { label: 'Expedition Sites', Component: ExpeditionSites,  },
        { label: 'Settlement', Component: Settlement, disable: region.settlement ? false : true },
        // { label: 'Party', Component: Party },
    ]

    if (!region) return <div />

    return (
            <TabsWrapper key={region.id} content={content} />
    )
}

export default Region 