import React from 'react'
import TabsWrapper from '../components/TabsWrapper'
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

    return (
            <TabsWrapper content={content} />
    )
}

export default Profile
