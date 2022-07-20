import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'


const Character = () => <div>Character</div>
const Upgrades = () => <div>Upgrades</div>
const RandomTest = () => <div>RandomTest</div>

const content = [
    { label: 'Character', Component: Character },
    { label: 'Upgrades', Component: Upgrades },
    { label: 'RandomTest', Component: RandomTest },
]

const Profile = () => {

    return (
        <div>
            <TabsWrapper content={content} />

        </div>
    )
}

export default Profile
