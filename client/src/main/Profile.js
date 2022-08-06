import React from 'react'
import TabsWrapper from '../components/TabsWrapper'
import { useGame } from '../contexts/GameContext'
import ExpeditionSites from '../tabs/ExpeditionSites'
import Settlement from '../tabs/Settlement'
import Survivors from '../tabs/Survivors'

const content = [
    { label: 'Survivors', Component: Survivors },
    { label: 'Settlement', Component: Settlement },
    { label: 'Region', Component: ExpeditionSites },
    // { label: 'Inventory', Component: Party },
    // { label: 'Upgrades', Component: Upgrades },
    // { label: 'RandomTest', Component: RandomTest },
]

const Profile = () => {
    const {tabSelected = 0, setTabSelected} = useGame()

    const handleIndexChange = (event, newValue) => setTabSelected(newValue);

    return (
            <TabsWrapper content={content} handleIndexChange={handleIndexChange} tabIndexValue={tabSelected} />
    )
}

export default Profile
