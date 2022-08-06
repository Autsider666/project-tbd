import { Box, Grid, Paper } from '@mui/material';
import React from 'react';

import Profile from './Profile'
import Map from './Map'
import Region from './Region'
import Chat from './Chat'

const sections = [
    { name: 'Map', Component: Map, sx: { gridArea: 'Map', overflow: 'hidden', margin: 'auto', maxWidth: { xs: '500px', sm: '550px' , md: 'none' } } },

    { name: 'Profile', Component: Profile, sx: { gridArea: 'Profile', display: { xl: 'block' } } },
    { name: 'Region', Component: Region, sx: { gridArea: 'Region', minHeight: {md: "400px", lg: 'none'}, display: {xl: 'none'} } },

    { name: 'Chat', Component: Chat, sx: { gridArea: 'Chat', display: { xs: 'none', sm: 'none', md: 'block'}, overflow: 'hidden' } },
]

// xs, extra-small: 0px - 600
// sm, small: 600px - 900
// md, medium: 900px - 1200
// lg, large: 1200px - 1536
// xl, extra-large: 1536px - 1920

// 1265 - 1920

const Main = ({ marginAmount }) => {

    return (
        <Box sx={{
            height: { xs: '100%', lg: `calc(100vh - 70.5px - ${marginAmount * 2}px)` },
            width: '100%',
            display: 'grid',
            gridGap: `${marginAmount}px`,
            gridTemplateColumns: {
                xs: '1fr 1fr',
                sm: '1fr 1fr',
                md: '1.5fr 1.5fr 5fr',
                lg: '1.5fr 1.5fr 5fr',
                xl: 'minmax(468px, 1.4fr) 1.1fr 4fr',
            },
            gridTemplateRows: {
                xs: '1fr 1fr',
                sm: '2fr 1fr',
                md: '3fr 2fr 7fr',
                lg: 'auto auto 3fr',
                xl: 'minmax(300px, 3fr) 2fr 3fr',
            },
            gridTemplateAreas: {
                xs: `"Map Map"
                     "Profile Region"`,
                sm: `"Map Map"
                     "Profile Region"`,
                md: `"Region Region Map"
                     "Profile Profile Map"
                     "Profile Profile Chat"`,
                lg: `"Profile Region Map "
                     "Profile Region Map"
                     "Chat Chat Map"`,
                xl: `"Profile Profile Map "
                     "Profile Profile Map"
                     "Chat Chat Map"`,
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