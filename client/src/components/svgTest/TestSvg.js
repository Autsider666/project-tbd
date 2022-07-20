import React from 'react';
import Landmasses from './landmasses.png'
import Water from './water.png'
import Symbols from './symbols.png'
import Paths from './paths.png'
import "./map.css"

const regions = [
   { id: 1, d: "m 504.5339,945 10.29661,-26.31356 17.16102,-57.20339 29.74576,-32.0339 109.83051,-1.14406 81.22881,5.72033 20.59322,105.25424 10.29661,121.27114 -295.16949,-1.144 z" },
   { id: 2, d: "m 174.73927,422.28657 47.20988,-80.78233 -8.58051,-2.28814 -5.43432,-22.30932 7.43644,-18.5911 7.15043,-3.4322 0.57203,-6.29238 h 3.14619 l 0.85805,-8.00847 -3.43221,-2.00212 -5.43432,1.14407 v -1.7161 l 4.86229,-5.14831 0.28602,-8.58051 0.28601,-2.28813 2.28814,-1.43009 2.00212,0.85805 0.85805,-8.29449 -8.00847,-17.73305 v -10.29661 l -4.00424,-3.14619 -2.57415,-0.57203 -0.85806,-5.43432 -10.29661,-7.15043 -0.57203,-3.4322 6.57839,-1.7161 7.72246,-11.44068 0.57203,-5.72034 -7.72246,-6.57839 2.57416,-4.86229 7.43644,-2.57415 2.00212,-4.00424 0.28601,-9.72457 2.86017,-3.14619 -0.57203,-10.01059 7.43644,-6.57839 7.15042,-3.14619 -4.57627,-4.86229 -0.57203,-9.43856 -0.85805,-1.7161 -1.14407,-4.57627 -8.58051,-8.58051 -14.87288,-4.57627 -8.00848,-3.146185 -9.15254,5.720335 -6.29237,-4.29025 -6.00636,0.85805 -5.72034,4.86229 -13.72881,-0.28602 -6.57839,4.29026 -4.86229,1.7161 -1.43008,5.72034 3.14618,8.29449 h -5.1483 l -5.43432,3.71822 -11.15466,-3.43221 -3.14619,2.57416 -6.29237,-0.85805 -6.29238,-6.00636 -20.307199,5.14831 v -3.71822 l 3.146186,-2.86017 -6.292373,-3.43221 -14.01483,3.14619 1.144068,11.44068 0.572034,4.00423 12.298728,10.58263 5.148306,-1.14407 4.290254,2.00212 v -3.71822 l 3.432206,-3.14618 6.00635,2.86016 1.43009,5.43433 14.01483,2.57415 4.29025,3.4322 -4.29025,5.14831 -9.72458,-2.86017 0.57204,7.72246 2.28813,1.7161 -1.7161,9.72457 -9.72458,6.00636 -1.43008,4.86229 -12.29873,4.29025 -0.858051,4.86229 1.716102,7.72246 -7.150424,14.87288 5.434322,2.86017 0.572034,5.43432 -3.432203,6.86441 4.004237,5.72034 5.434322,0.57203 10.582631,10.58263 4.86228,1.14407 v 5.1483 l 5.14831,4.86229 3.4322,-0.28602 2.86017,2.86017 4.29026,0.57204 10.58262,8.29449 5.43433,-1.14407 5.1483,0.28602 2.86017,0.85805 6.00636,5.43432 -1.43009,26.88559 -1.7161,8.29449 -4.00424,2.57416 v 8.86652 h 1.14407 l -4.29025,10.58263 2.00211,5.1483 -4.57627,14.87289 -8.00847,1.7161 -5.14831,11.44068 -5.43432,3.71822 8.29449,4.57627 -2.28813,4.57627 2.28813,5.72034 6.86441,1.43008 5.14831,-0.85805 2.00211,-3.14619 3.14619,1.14407 0.85805,13.4428 1.43009,1.43008 6.57839,1.14407 6.00635,7.72246 1.7161,5.1483 6.86441,1.14407 z" },
   { id: 3, d: "m 174.65537,422.14275 18.38478,-2.12132 14.49569,24.74873 -8.13173,6.01041 19.09188,27.93072 21.21321,13.43503 6.36396,42.4264 61.51829,38.18377 53.03301,-37.47666 20.50609,-173.24116 -67.17514,-4.24264 -2.12132,-9.8995 -21.2132,-2.82842 -18.38478,-13.43503 -17.67767,-0.70711 -8.48528,13.43503 -16.97056,6.36396 -7.77818,-8.83883 z" },
   { id: 4, d: "m 360,535 73.5,75 18,-6 6.5,-0.5 2.5,4 41.5,-13 11,5.5 4.5,-6 -2.5,-6.5 1,-31.5 5,-7.5 -2,-8.5 9.5,-2.5 V 531 l 6.5,0.5 6,-8 5.5,-5 -2.5,-5 3,-4.5 -2.5,-26.5 -7.5,-12 8.5,-18.5 -3,-6 23.5,-7 2.5,-6.5 -2,-14 2.5,-3 -3.5,-2.5 -6.5,-1.5 -1,-3 5,-7.5 7,1.5 1.5,-3.5 -5.5,-14 -1.5,-17 -13.5,-12 -12.5,4 -3.5,-5.5 -13,18.5 1.5,6 -14.5,3 -4,-6.5 -7.5,2.5 -10,-6 -10,5 -8.5,0.5 -5,-8 L 453.5,366 443,348.5 380.5,362 Z" },
   { id: 5, d: "M 246.5,533.5 227,552 l -5.5,9 0.5,9 -21.5,7 -4.5,5 -1,6 -10,6 -1,4.5 -19.5,16.5 -9.5,9 -7.5,-6.5 -10,7 1.5,5.5 -3,7 3,12 -9.5,4.5 4,12 -11.5,19.5 -11,1 -1,18 -11.5,-8.5 2.5,-10.5 -7.5,-3 -7,6.5 -1.5,6.5 -9,6 3,13 17.5,-3.5 7,2 8.5,-5 5,7.5 1,11 h -8 l 1.5,5.5 -8.5,-2 -2.5,11.5 8,2.5 -5.5,5 v 4.5 l 10.5,4 1,17.5 h 6.5 l 4,14 -14,0.5 -17,-1.5 -4,13 2.5,14 15,-2.5 16.5,7 L 231.93102,784.18142 323.8549,613.76868 307.5,572 Z" },

]

export default () => {
   const regionHandler = (regionId) => () => {
      console.log(regionId)
   }
   return (
      <div style={{ position: 'relative', height: "100%" }} >
         {/* <img src={Symbols} position="absolute" height="100%" /> */}
         <img src={Water} position="absolute" height="100%" />
         <img className="mapOverlay" src={Paths} position="absolute" height="100%" />

         {/* <img height="100%" /> */}
         <svg
            version="1.1"
            className="mapRegionWrapper"
            id="svg2"
            height="100%"
            // width="1440"
            viewBox="0 0 1440 1080"

         // style={{background:"lightgray"}}
         >

            <g id="g8">
               {regions.map(region => (
                  <path
                     className="mapRegion"
                     {...region}
                     onClick={regionHandler(region.id)}
                  />
               ))}
            </g>
         </svg>

         <img className="mapOverlay" src={Landmasses} position="absolute" height="100%" />
         <img id="mapSymbolsLayer" className="mapOverlay" src={Symbols} position="absolute" height="100%" />

      </div>
   )
}

