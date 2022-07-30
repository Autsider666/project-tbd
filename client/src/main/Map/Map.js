import React from 'react'
import Water from '../../components/worldMap/Map1/water.png'
import WorldMap from '../../components/worldMap/worldMap.js'
import { useGame } from '../../contexts/GameContext.js'

const Map = () => {

    const { regionRepository, worldRepository, selectedRegionId, setSelectedRegionId } = useGame()
    
    const worldSelected = Object.values(worldRepository)[0] // Add future code to take more than one map.

    const hide = false
    
    if (hide) return <img style={{ opacity: 0.3, marginBottom: '-8px' }} src={Water} position="absolute" width="100%" />
    return <WorldMap world={worldSelected} selectedRegionId={selectedRegionId} setSelectedRegionId={setSelectedRegionId} regions={Object.values(regionRepository)} />
}

export default Map































/*
const regionsToBeJsoned = [
    { id: "a", name: "SomeName", world: "a", settlements: ["a"], borders: ["a"] },
    { id: "b", name: "SomeName", world: "a", settlements: ["a"], borders: ["b", "c"] },
    { id: "c", name: "SomeName", world: "a", settlements: ["a"], borders: ["a", "b", "d", "e", "j"] },
    { id: "d", name: "SomeName", world: "a", settlements: ["a"], borders: ["c", "d", "f", "ag"] },
    { id: "e", name: "SomeName", world: "a", settlements: ["a"], borders: ["e", "f", "g", "h", "i"] },
    { id: "f", name: "SomeName", world: "a", settlements: ["a"], borders: ["g", "j", "k"] },
    { id: "g", name: "SomeName", world: "a", settlements: ["a"], borders: ["h", "k", "l"] },
    { id: "h", name: "SomeName", world: "a", settlements: ["a"], borders: ["i", "l", "m"] },
    { id: "i", name: "SomeName", world: "a", settlements: ["a"], borders: ["ag", "ah"] },
    { id: "j", name: "SomeName", world: "a", settlements: ["a"], borders: ["m", "n"] },
    { id: "k", name: "SomeName", world: "a", settlements: ["a"], borders: ["m", "n", "o"] },
    { id: "l", name: "SomeName", world: "a", settlements: ["a"], borders: ["p", "q", "r", "s"] },
    { id: "m", name: "SomeName", world: "a", settlements: ["a"], borders: ["r", "t"] },
    { id: "n", name: "SomeName", world: "a", settlements: ["a"], borders: ["s", "t", "u", "af"] },
    { id: "o", name: "SomeName", world: "a", settlements: ["a"], borders: ["o", "q", "u", "v", "w", "x"] },
    { id: "p", name: "SomeName", world: "a", settlements: ["a"], borders: ["v", "y", "aa"] },
    { id: "q", name: "SomeName", world: "a", settlements: ["a"], borders: ["w", "y", "z"] },
    { id: "r", name: "SomeName", world: "a", settlements: ["a"], borders: ["x", "z", "aa", "ab", "ac"] },
    { id: "s", name: "SomeName", world: "a", settlements: ["a"], borders: ["ab", "ad", "ae"] },
    { id: "t", name: "SomeName", world: "a", settlements: ["a"], borders: ["ae", "af"] },
    { id: "u", name: "SomeName", world: "a", settlements: ["a"], borders: ["ac", "ad", "ah"] },
]

const Tower = 'tower', Ruin = 'ruin', Forest = 'forest', Mountain = 'mountain';

const resourceNodesToBeJsoned = [
    { id: "aaaa", name: 'randomName A', region: 'a', type: 'ruin', resources: [] },
    { id: "aaab", name: 'randomName B', region: 'a', type: 'ruin', resources: [] },
    { id: "aaac", name: 'randomName C', region: 'a', type: 'tower', resources: [] },
    { id: "aaad", name: 'randomName D', region: 'a', type: 'forest', resources: [] },
    
    { id: "bbba", name: 'randomName A', region: 'b', type: 'ruin', resources: [] },
    { id: "bbbb", name: 'randomName B', region: 'b', type: 'ruin', resources: [] },
    { id: "bbbc", name: 'randomName C', region: 'b', type: 'ruin', resources: [] },
    { id: "bbbd", name: 'randomName D', region: 'b', type: 'forest', resources: [] },
    
    { id: "ccca", name: 'randomName A', region: 'c', type: 'ruin', resources: [] },
    { id: "cccb", name: 'randomName B', region: 'c', type: 'ruin', resources: [] },
    { id: "cccc", name: 'randomName C', region: 'c', type: 'forest', resources: [] },
    { id: "cccd", name: 'randomName D', region: 'c', type: 'mountain', resources: [] },
    
    { id: "ddda", name: 'randomName A', region: 'd', type: 'ruin', resources: [] },
    { id: "dddb", name: 'randomName B', region: 'd', type: 'ruin', resources: [] },
    { id: "dddc", name: 'randomName C', region: 'd', type: 'ruin', resources: [] },
    { id: "dddd", name: 'randomName D', region: 'd', type: 'mountain', resources: [] },
    
    { id: "eeea", name: 'randomName A', region: 'e', type: 'ruin', resources: [] },
    { id: "eeeb", name: 'randomName B', region: 'e', type: 'ruin', resources: [] },
    { id: "eeec", name: 'randomName C', region: 'e', type: 'forest', resources: [] },
    { id: "eeed", name: 'randomName D', region: 'e', type: 'mountain', resources: [] },
    
    { id: "fffa", name: 'randomName A', region: 'f', type: 'ruin', resources: [] },
    { id: "fffb", name: 'randomName B', region: 'f', type: 'ruin', resources: [] },
    { id: "fffc", name: 'randomName C', region: 'f', type: 'tower', resources: [] },
    { id: "fffd", name: 'randomName D', region: 'f', type: 'mountain', resources: [] },
    
    { id: "ggga", name: 'randomName A', region: 'g', type: 'ruin', resources: [] },
    { id: "gggb", name: 'randomName B', region: 'g', type: 'ruin', resources: [] },
    { id: "gggc", name: 'randomName C', region: 'g', type: 'ruin', resources: [] },
    { id: "gggd", name: 'randomName D', region: 'g', type: 'mountain', resources: [] },
    
    { id: "hhha", name: 'randomName A', region: 'h', type: 'ruin', resources: [] },
    { id: "hhhb", name: 'randomName B', region: 'h', type: 'ruin', resources: [] },
    { id: "hhhc", name: 'randomName C', region: 'h', type: 'tower', resources: [] },
    { id: "hhhd", name: 'randomName D', region: 'h', type: 'forest', resources: [] },
    
    { id: "iiia", name: 'randomName A', region: 'i', type: 'ruin', resources: [] },
    { id: "iiib", name: 'randomName B', region: 'i', type: 'ruin', resources: [] },
    { id: "iiic", name: 'randomName C', region: 'i', type: 'ruin', resources: [] },
    { id: "iiid", name: 'randomName D', region: 'i', type: 'forest', resources: [] },
    
    { id: "jjja", name: 'randomName A', region: 'j', type: 'ruin', resources: [] },
    { id: "jjjb", name: 'randomName B', region: 'j', type: 'ruin', resources: [] },
    { id: "jjjc", name: 'randomName C', region: 'j', type: 'tower', resources: [] },
    { id: "jjjd", name: 'randomName D', region: 'j', type: 'forest', resources: [] },
    
    { id: "kkka", name: 'randomName A', region: 'k', type: 'ruin', resources: [] },
    { id: "kkkb", name: 'randomName B', region: 'k', type: 'ruin', resources: [] },
    { id: "kkkc", name: 'randomName C', region: 'k', type: 'ruin', resources: [] },
    { id: "kkkd", name: 'randomName D', region: 'k', type: 'forest', resources: [] },
    
    { id: "llla", name: 'randomName A', region: 'l', type: 'ruin', resources: [] },
    { id: "lllb", name: 'randomName B', region: 'l', type: 'ruin', resources: [] },
    { id: "lllc", name: 'randomName C', region: 'l', type: 'ruin', resources: [] },
    { id: "llld", name: 'randomName D', region: 'l', type: 'mountain', resources: [] },
    
    { id: "mmma", name: 'randomName A', region: 'm', type: 'ruin', resources: [] },
    { id: "mmmb", name: 'randomName B', region: 'm', type: 'ruin', resources: [] },
    { id: "mmmc", name: 'randomName C', region: 'm', type: 'tower', resources: [] },
    { id: "mmmd", name: 'randomName D', region: 'm', type: 'mountain', resources: [] },
    
    { id: "nnna", name: 'randomName A', region: 'n', type: 'ruin', resources: [] },
    { id: "nnnb", name: 'randomName B', region: 'n', type: 'ruin', resources: [] },
    { id: "nnnc", name: 'randomName C', region: 'n', type: 'tower', resources: [] },
    { id: "nnnd", name: 'randomName D', region: 'n', type: 'mountain', resources: [] },
    
    { id: "oooa", name: 'randomName A', region: 'o', type: 'ruin', resources: [] },
    { id: "ooob", name: 'randomName B', region: 'o', type: 'ruin', resources: [] },
    { id: "oooc", name: 'randomName C', region: 'o', type: 'forest', resources: [] },
    { id: "oood", name: 'randomName D', region: 'o', type: 'mountain', resources: [] },
    
    { id: "pppa", name: 'randomName A', region: 'p', type: 'ruin', resources: [] },
    { id: "pppb", name: 'randomName B', region: 'p', type: 'ruin', resources: [] },
    { id: "pppc", name: 'randomName C', region: 'p', type: 'ruin', resources: [] },
    { id: "pppd", name: 'randomName D', region: 'p', type: 'forest', resources: [] },
    
    { id: "qqqa", name: 'randomName A', region: 'q', type: 'ruin', resources: [] },
    { id: "qqqb", name: 'randomName B', region: 'q', type: 'ruin', resources: [] },
    { id: "qqqc", name: 'randomName C', region: 'q', type: 'tower', resources: [] },
    { id: "qqqd", name: 'randomName D', region: 'q', type: 'mountain', resources: [] },
    
    { id: "rrra", name: 'randomName A', region: 'r', type: 'ruin', resources: [] },
    { id: "rrrb", name: 'randomName B', region: 'r', type: 'ruin', resources: [] },
    { id: "rrrc", name: 'randomName C', region: 'r', type: 'ruin', resources: [] },
    { id: "rrrd", name: 'randomName D', region: 'r', type: 'forest', resources: [] },
    
    { id: "sssa", name: 'randomName A', region: 's', type: 'ruin', resources: [] },
    { id: "sssb", name: 'randomName B', region: 's', type: 'ruin', resources: [] },
    { id: "sssc", name: 'randomName C', region: 's', type: 'forest', resources: [] },
    { id: "sssd", name: 'randomName D', region: 's', type: 'mountain', resources: [] },
    
    { id: "ttta", name: 'randomName A', region: 't', type: 'ruin', resources: [] },
    { id: "tttb", name: 'randomName B', region: 't', type: 'ruin', resources: [] },
    { id: "tttc", name: 'randomName C', region: 't', type: 'tower', resources: [] },
    { id: "tttd", name: 'randomName D', region: 't', type: 'mountain', resources: [] },
    
    { id: "uuua", name: 'randomName A', region: 'u', type: 'ruin', resources: [] },
    { id: "uuub", name: 'randomName B', region: 'u', type: 'ruin', resources: [] },
    { id: "uuuc", name: 'randomName C', region: 'u', type: 'forest', resources: [] },
    { id: "uuud", name: 'randomName D', region: 'u', type: 'mountain', resources: [] },
    
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