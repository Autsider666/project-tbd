import { List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'
import Survivors from './Survivors'

const Party = () => {

    const { controlledParty: party } = useGame()
    if (party === null) return <div />

    console.log({ party })
    const resourceTypes = [
        { type: 'wood', },
        { type: 'stone', },
        { type: 'iron', },
    ]

    const statTypes = [
        { key: 'hp', label: 'Health', },
        { key: 'damage', label: 'Damage', },
        { key: 'gatheringSpeed', label: 'Gathering', },
    ]



    return (
        <List>
            <ListItem >
                <ListItemText sx={{minWidth: '100px'}} primary="Inventory" />
                {resourceTypes.map(({ type }) => {
                    const amount = party.resources[type] || 0
                    return (
                        <ListItemText key={type} primary={amount} secondary={type} />
                    )
                })}
            </ListItem>
            <ListItem>
                <ListItemText sx={{minWidth: '100px'}} primary="Stats" />
                {statTypes.map(({ key, label }) => (
                    <ListItemText key={key} primary={party[key]} secondary={label} />
                ))}
            </ListItem>
        </List>

    )
}
const Upgrades = () => <div>Upgrades</div>
// const RandomTest = () => <div>RandomTest</div>

const content = [
    { label: 'Party', Component: Party },
    { label: 'Survivors', Component: Survivors },
    // { label: 'Upgrades', Component: Upgrades },
    // { label: 'RandomTest', Component: RandomTest },
]

const Profile = () => {

    return (
            <TabsWrapper content={content} />
    )
}

export default Profile
