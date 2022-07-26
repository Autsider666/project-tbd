import React from 'react';
import Landmasses from './landmasses.png'
import Water from './water.png'
import Symbols from './symbols.png'
import Paths from './paths.png'
import "./map.css"
import { useGame } from '../../contexts/GameContext';



export default () => {
   const { selectedRegion, setSelectedRegion, regionRepository, loaded } = useGame()
   const regionHandler = (regionId) => () => {
      setSelectedRegion(regionId)
   }
   const dev = true

   return (
      <div style={{ position: 'relative', width: "100%", marginBottom: '-5px' }} >
         {/* <img src={Symbols} position="absolute" width="100%" /> */}
         <img src={Water} position="absolute" width="100%" />
         {!dev && <img className="mapOverlay" src={Paths} position="absolute" width="100%" />}

         {/* <img width="100%" /> */}
         <svg
            version="1.1"
            className="mapRegionWrapper"
            id="svg2"
            width="100%"
            // width="1440"
            viewBox="0 0 1440 1080"
         >

            <g id="g8">
               {loaded && Object.values(regionRepository).map(region => (
                  <path
                     key={region.id}
                     className={`mapRegion ${selectedRegion === region.id ? 'selected' : ''}`}
                     d={region.dimensions}
                     onClick={regionHandler(region.id)}
                  />
               ))}
            </g>
         </svg>

         {!dev && <img className="mapOverlay" src={Landmasses} position="absolute" width="100%" />}
         {!dev && <img id="mapSymbolsLayer" className="mapOverlay" src={Symbols} position="absolute" width="100%" />}

      </div>
   )
}



