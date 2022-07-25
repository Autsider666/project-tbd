import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

const RegionOverview = () => <div>RegionOverview</div>
const Random1 = () => <div>Random1</div>
const Random2 = () => <div>Random2</div>



const Region = () => {

    const { regionRepository, selectedRegion } = useGame()
    console.log({ regionRepository })

    const content = [
        { label: selectedRegion ? `Region #${selectedRegion}` : `Select Region`, Component: RegionOverview },
        { label: 'Random1', Component: Random1 },
        { label: 'Random2', Component: Random2 },
    ]

    return (
        <div>
            <TabsWrapper content={content} />

        </div>
    )
}

export default Region 