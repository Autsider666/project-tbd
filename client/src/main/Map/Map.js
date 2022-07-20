import React from 'react'

import TestSvg from '../../components/svgTest/TestSvg.js'
import Water from '../../components/svgTest/water.png'
import { useGame } from '../../contexts/GameContext.js'

const Map = () => {

    const { worldRepository } = useGame()
    console.log({ worldRepository })

    return (
        <>
            <TestSvg />
            <img style={{ opacity: 0.3 }} src={Water} position="absolute" height="100%" />
        </>
    )
}

export default Map