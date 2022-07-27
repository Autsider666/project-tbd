import { Box, Grid, Paper } from '@mui/material';
import React from 'react';

import Profile from './Profile/Profile'
import Map from './Map/Map'
import Region from './Region/Region'
import Random from './Random/Random'
import Chat from './Chat/Chat'
import Log from './Log/Log'

const sections = [
    { name: 'Profile', Component: Profile, sx: { gridArea: 'Profile' } },
    { name: 'Map', Component: Map, sx: { gridArea: 'Map' } },
    { name: 'Region', Component: Region, sx: { gridArea: 'Region' } },
    { name: 'Random', Component: Random, sx: { gridArea: 'Random', display: { xs: 'none', md: 'none', lg: 'block' } } },
    { name: 'Chat', Component: Chat, sx: { gridArea: 'Chat', display: { xs: 'none', md: 'block', lg: 'block' } } },
    { name: 'Log', Component: Log, sx: { gridArea: 'Log', display: { xs: 'none', md: 'block', lg: 'block' } } },
]

const Main = ({ marginAmount }) => {

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'grid',
            gridGap: `${marginAmount}px`,
            gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 4fr 2fr', lg: '3fr 4fr 3fr' },
            gridTemplateRows: { xs: 'auto 1fr', md: 'auto 1fr 1fr', lg: 'auto 1fr' },
            gridTemplateAreas: {
                xs: `"Map Map"
                     "Profile Region"`,
                md: `"Profile Map Map"
                     "Region Chat Chat"
                     "Region Log Log"`,
                lg: `"Profile Map Region"
                     "Random Chat Log"`
            }
        }}>
            {sections.map(({ Component, sx }, index) => {
                return (
                    <Paper key={index} sx={sx}  >
                        <Component />
                    </Paper>
                )
            })}
        </Box>


    )


}

export default Main