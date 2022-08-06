import * as React from 'react';
import { Box, List } from '@mui/material'
import { useGame } from '../contexts/GameContext';
import SurvivorList from '../components/SurvivorList.js'
import StatListItem from '../components/StatListItem';
import ResourceListItem from '../components/ResourceListItem';


const Survivors = () => {
    const { controlledParty, partySurvivorsGrouped } = useGame()
    return (
        <Box sx={{ height: '300px', width: '100%' }}>
            <List>
                <ResourceListItem resources={controlledParty.resources} />
                <StatListItem stats={controlledParty.stats} />
                <SurvivorList partySurvivorsGrouped={partySurvivorsGrouped} />
            </List>
        </Box>
    )
}

export default Survivors

