import { List, ListItem } from '@mui/material'
import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'


const Party = () => {

    const { survivorRepository, partyRepository } = useGame()

    const party = Object.values(partyRepository).find(party => party.controllable)
    const survivors = Object.values(survivorRepository).filter(survivor => survivor.party = party.id)
    // console.log({ survivorRepository, partyRepository })
    // console.log({ party, survivors })

    return (
            <List>
                {survivors.map(survivor => {
                    <ListItem>
                        {survivor.name}
                    </ListItem>
                })}
            </List>
    )
}
const Upgrades = () => <div>Upgrades</div>
// const RandomTest = () => <div>RandomTest</div>

const content = [
    { label: 'Party', Component: Party },
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
