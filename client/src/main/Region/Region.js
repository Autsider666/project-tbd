import React from 'react'
import { useGame } from '../../contexts/GameContext'

const Region = () => {

    const { regions } = useGame()
    console.log({regions})

    return (
        <div>Region</div>
    )
}

export default Region 