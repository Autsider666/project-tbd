import * as React from 'react';
import { Divider, List } from '@mui/material'
import { useGame } from '../contexts/GameContext';
import SurvivorList from '../components/SurvivorList.js'
import StatListItem from '../components/StatListItem';
import ResourceListItem from '../components/ResourceListItem';


const Survivors = ({ height }) => {
    const { controlledParty } = useGame()
    return (
        <List sx={{ height, width: "100%", py: 0 }} >
            <ResourceListItem resources={controlledParty.resources} />
            <Divider sx={{ pt: 0.5 }} />
            <StatListItem stats={controlledParty.stats} />
            <Divider sx={{ pt: 0.5 }} />
            <SurvivorList height={height - 150}/>
        </List>
    )
}

export default Survivors

