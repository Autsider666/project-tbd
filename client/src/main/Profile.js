import React from 'react'
import TabsWrapper from '../components/TabsWrapper'
import { useGame } from '../contexts/GameContext'
import ExpeditionSites from '../tabs/ExpeditionSites'
import Settlement from '../tabs/Settlement'
import Survivors from '../tabs/Survivors'
import { useMediaQuery, useTheme } from '@mui/material'
import { Log } from '../tabs/Log'
import Parties from '../tabs/Parties'



const Profile = () => {
    const { tabSelected = 0, setTabSelected } = useGame()
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    const content = [
        { label: 'Survivors', Component: Survivors, tooltip:"Combined Survivor Stats, Inventory and Management" },
        { label: 'Settlement', Component: Settlement, tooltip:"Settlement Overview and Upgrades" },
        // { label: 'Region', Component: ExpeditionSites, tooltip:"Expeditions and Voyages" },


        { label: 'Parties', Component: Parties },
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
