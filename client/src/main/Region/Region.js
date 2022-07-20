import React from 'react'
import { useGame } from '../../contexts/GameContext'

const Region = () => {

    const { regionRepository } = useGame()
    console.log({regionRepository})

    return (
        <div>Region</div>
    )
}

export default Region 