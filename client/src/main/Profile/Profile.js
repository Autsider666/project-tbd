import { List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'
import Survivors from './Survivors'

const Party = () => {

    const { controlledParty: party, partyInventory } = useGame()
    if (party === null) return <div />

    // console.log({ party, partyInventory })
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


                    const resourceFound = partyInventory.find(resource => resource.type === type)
                    const { amount = 0 } = resourceFound || {}
                    return (
                        <ListItemText key={type} primary={amount} secondary={type} />
                    )
                })
                }
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
    { label: 'Upgrades', Component: Upgrades },
    // { label: 'RandomTest', Component: RandomTest },
]

const Profile = () => {

    return (
        <div>
            <TabsWrapper content={content} />

        </div>
    )
}

export default Profile
