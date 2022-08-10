import * as React from 'react';
import { Divider, List, Box } from '@mui/material'
import { useGame } from '../contexts/GameContext';


const Parties = ({ height }) => {
    const { controlledParty } = useGame()
    if(!controlledParty) return <div />
    return (
        <List sx={{ height, width: "100%", py: 0 }} >
            <Box>
                List of Parties coming
            </Box>
        </List>
    )
}

export default Parties