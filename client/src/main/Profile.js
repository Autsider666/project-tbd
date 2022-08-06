import React from 'react'
import TabsWrapper from '../components/TabsWrapper'
import { useGame } from '../contexts/GameContext'
import ExpeditionSites from '../tabs/ExpeditionSites'
import Settlement from '../tabs/Settlement'
import Survivors from '../tabs/Survivors'
import { useMediaQuery, useTheme } from '@mui/material'
import { Log } from '../tabs/Log'



const Profile = () => {
    const { tabSelected = 0, setTabSelected } = useGame()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    const content = [
        { label: 'Survivors', Component: Survivors },
        { label: 'Settlement', Component: Settlement },
        { label: 'Region', Component: ExpeditionSites },


        // { label: 'Inventory', Component: Party },
        // { label: 'Upgrades', Component: Upgrades },
        // { label: 'RandomTest', Component: RandomTest },
    ]
    if (!matches) {
        content.push(
            { label: 'Log', Component: Log, tabSx: { marginLeft: 'auto' } },
        )
    }

    const handleIndexChange = (event, newValue) => setTabSelected(newValue);

    return (
        <TabsWrapper content={content} handleIndexChange={handleIndexChange} tabIndexValue={tabSelected} />
    )
}

export default Profile
