import { Box, Grid, Paper } from '@mui/material';
import React from 'react';

import Profile from './Profile/Profile'
import Map from './Map/Map'
import Region from './Region/Region'
import Random from './Random/Random'
import Chat from './Chat/Chat'
import Log from './Log/Log'

const sections = [
    { name: 'Profile', Component: Profile, },
    { name: 'Map', Component: Map, style: { overflow: 'hidden' } },
    { name: 'Region', Component: Region, },
    { name: 'Random', Component: Random, },
    { name: 'Chat', Component: Chat, },
    { name: 'Log', Component: Log, },
]

const Main = ({ marginAmount }) => {

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'grid',
            gridGap: `${marginAmount}px`,
            gridTemplateColumns: '3fr 4fr 3fr',
            gridTemplateRows: 'auto 1fr',
        }}>
            {sections.map(({ Component, style }, index) => {
                return (
                    <Paper key={index} style={style} >
                        <Component />
                    </Paper>
                )
            })}
        </Box>


    )


}

export default Main