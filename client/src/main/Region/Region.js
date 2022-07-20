import React from 'react'
import { useGame } from '../../contexts/GameContext'

const Region = () => {

    const { regionRepository } = useGame()
    console.log({regionRepository})

    return (
        <div>Region abcdasdfasdfasdfasd</div>
    )
}

export default Region 