import React from 'react'

import TestSvg from '../../components/svgTest/TestSvg.js'
import Water from '../../components/svgTest/water.png'
import { useGame } from '../../contexts/GameContext.js'
/*
const regionsToBeJsoned = [
    { id: "a", name: "SomeName", world: "a", settlements: ["a"], borders: ["a"] },
    { id: "b", name: "SomeName", world: "a", settlements: ["a"], borders: ["b", "c"] },
    { id: "c", name: "SomeName", world: "a", settlements: ["a"], borders: ["a", "b", "d", "e", "j"] },
    { id: "d", name: "SomeName", world: "a", settlements: ["a"], borders: ["c", "d", "f", "ag"] },
    { id: "e", name: "SomeName", world: "a", settlements: ["a"], borders: ["e", "f", "g", "h", "i"] },
    { id: "f", name: "SomeName", world: "a", settlements: ["a"], borders: ["g", "j", "k"] },
    { id: "g", name: "SomeName", world: "a", settlements: ["a"], borders: ["h", "k", "l"] },
    { id: "h", name: "SomeName", world: "a", settlements: ["a"], borders: ["i","l","m"] },
    { id: "i", name: "SomeName", world: "a", settlements: ["a"], borders: ["ag","ah"] },
    { id: "j", name: "SomeName", world: "a", settlements: ["a"], borders: ["m","n"] },
    { id: "k", name: "SomeName", world: "a", settlements: ["a"], borders: ["m","n","o"] },
    { id: "l", name: "SomeName", world: "a", settlements: ["a"], borders: ["p","q","r","s"] },
    { id: "m", name: "SomeName", world: "a", settlements: ["a"], borders: ["r","t"] },
    { id: "n", name: "SomeName", world: "a", settlements: ["a"], borders: ["s","t","u","af"] },
    { id: "o", name: "SomeName", world: "a", settlements: ["a"], borders: ["o","q","u","v","w","x"] },
    { id: "p", name: "SomeName", world: "a", settlements: ["a"], borders: ["v","y","aa"] },
    { id: "q", name: "SomeName", world: "a", settlements: ["a"], borders: ["w","y","z"] },
    { id: "r", name: "SomeName", world: "a", settlements: ["a"], borders: ["x","z","aa","ab","ac"] },
    { id: "s", name: "SomeName", world: "a", settlements: ["a"], borders: ["ab","ad","ae"] },
    { id: "t", name: "SomeName", world: "a", settlements: ["a"], borders: ["ae","af"] },
    { id: "u", name: "SomeName", world: "a", settlements: ["a"], borders: ["ac","ad","ah"] },
]

const bordersToBeJsoned = [
    { id: "a", regions: ["a", "c"], borderType: 'default' },
    { id: "b", regions: ["b", "c"], borderType: 'mountain' },
    { id: "c", regions: ["b", "d"], borderType: 'mountain' },
    { id: "d", regions: ["c", "d"], borderType: 'default' },
    { id: "e", regions: ["c", "e"], borderType: 'default' },
    { id: "f", regions: ["d", "e"], borderType: 'default' },
    { id: "g", regions: ["f", "e"], borderType: 'mountain' },
    { id: "h", regions: ["g", "e"], borderType: 'mountain' },
    { id: "i", regions: ["h", "e"], borderType: 'default' },
    { id: "j", regions: ["c", "f"], borderType: 'default' },
    { id: "k", regions: ["g", "f"], borderType: 'mountain' },
    { id: "l", regions: ["g", "h"], borderType: 'default' },
    { id: "m", regions: ["h", "j"], borderType: 'default' },
    { id: "n", regions: ["k", "j"], borderType: 'default' },
    { id: "o", regions: ["k", "o"], borderType: 'default' },
    { id: "p", regions: ["k", "l"], borderType: 'default' },
    { id: "q", regions: ["o", "l"], borderType: 'default' },
    { id: "r", regions: ["m", "l"], borderType: 'default' },
    { id: "s", regions: ["n", "l"], borderType: 'mountain' },
    { id: "t", regions: ["n", "m"], borderType: 'mountain' },
    { id: "u", regions: ["n", "o"], borderType: 'default' },
    { id: "v", regions: ["p", "o"], borderType: 'default' },
    { id: "w", regions: ["q", "o"], borderType: 'mountain' },
    { id: "x", regions: ["r", "o"], borderType: 'default' },
    { id: "y", regions: ["p", "q"], borderType: 'default' },
    { id: "z", regions: ["q", "r"], borderType: 'default' },
    { id: "aa", regions: ["p", "r"], borderType: 'mountain' },
    { id: "ab", regions: ["s", "r"], borderType: 'default' },
    { id: "ac", regions: ["u", "r"], borderType: 'mountain' },
    { id: "ad", regions: ["u", "s"], borderType: 'mountain' },
    { id: "ae", regions: ["s", "t"], borderType: 'default' },
    { id: "af", regions: ["t", "n"], borderType: 'default' },
    { id: "ag", regions: ["d", "i"], borderType: 'water' },
    { id: "ah", regions: ["u", "i"], borderType: 'water' },
]
*/


const Map = () => {

    const { worldRepository } = useGame()
    console.log({ worldRepository })

    return (
        <>
            <TestSvg />
            {/* <img style={{ opacity: 0.3, marginBottom: '-3px' }} src={Water} position="absolute" width="100%" /> */}
        </>
    )
}

export default Map