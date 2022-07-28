import { Box } from '@mui/material'
import React from 'react'
import WorldMap1 from './Map1/Map1.js'
import "./WorldMap.css"

const WorldMaps = [
    {
        id: 1, map: WorldMap1
    }
]

const WorldMap = ({ world, regions, selectedRegion, setSelectedRegion }) => {
    
    const worldMapSelected = WorldMaps[0]

    const dev = true

    return (
        <Box sx={{ position: 'relative', width: '100%', marginBottom: '-8px' }} >
            <img src={worldMapSelected.map.Water} position="absolute" width="100%" />
            {!dev && <img className="mapOverlay" src={worldMapSelected.map.Paths} position="absolute" width="100%" />}
            <svg className="mapRegionWrapper" width="100%" viewBox="0 0 1440 1080" >
                <g id="g8">
                    {regions.map(region => (
                        <path
                            key={region.id}
                            className={`mapRegion ${selectedRegion === region.id ? 'selected' : ''}`}
                            d={region.dimensions}
                            onClick={() => setSelectedRegion(region.id)}
                        />
                    ))}
                </g>
            </svg>

            {!dev && <img className="mapOverlay" src={worldMapSelected.map.Landmasses} position="absolute" width="100%" />}
            {!dev && <img id="mapSymbolsLayer" className="mapOverlay" src={worldMapSelected.map.Symbols} position="absolute" width="100%" />}
        </Box>
    )
}

export default WorldMap