import * as React from 'react';
import { Box, List } from '@mui/material'
import { useGame } from '../contexts/GameContext';
import SurvivorList from '../components/SurvivorList.js'
import StatListItem from '../components/StatListItem';
import ResourceListItem from '../components/ResourceListItem';


const Survivors = ({ height, width }) => {
    const { controlledParty, partySurvivorsGrouped } = useGame()
    return (
        <List sx={{ height, width: "100%" }} >
            <ResourceListItem resources={controlledParty.resources} />
            <StatListItem stats={controlledParty.stats} />
            <SurvivorList height={height - 150} partySurvivorsGrouped={partySurvivorsGrouped} />
        </List>
    )
}

export default Survivors

