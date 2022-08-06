import React from 'react';
import { Box, List } from '@mui/material';
import { useGame } from '../contexts/GameContext';
import ResourceListItem from '../components/ResourceListItem';

const Settlement = () => {
    const {
        currentSettlement,
    } = useGame()

    if (currentSettlement === null) return <div />

    return (
        <Box sx={{ height: '300px', width: '100%' }}>
            <List>
                <ResourceListItem resources={currentSettlement.resources} />
            </List>
        </Box>


    );
};

export default Settlement