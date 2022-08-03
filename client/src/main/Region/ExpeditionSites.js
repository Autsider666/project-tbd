import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { expeditionStart } from '../../functions/socketCalls';
import { useGame } from '../../contexts/GameContext';

export const ExpeditionSites = () => {
    const [resourceNodeButton, resourceNodeButtonSelected] = React.useState(null);

    const {
        selectedRegion: region = {}, controlledParty: party, currentExpedition: expedition, selectedResourceNodes : resourceNodes = [],
         selectedRegionId, resourceNodeRepository,
        selectedRegionTravelPath = {}
    } = useGame()
    
    if (selectedRegionId === null || resourceNodes.length === 0 || Object.values(resourceNodeRepository).length === 0) return <div />

    const { name } = region;
    const { cost = 0 } = selectedRegionTravelPath

    const travelling = expedition && expedition.currentPhase !== 'finished';
    const handleClick = node => () => resourceNodeButtonSelected(prev => prev == node ? null : node)


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ padding: 0 }}>
                {/* <Grid sx={{ margin: 1 }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Region of {`${name}`}</Typography>

                </Grid> */}
                <Grid sx={{ margin: 1, justifyContent: 'center' }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Resource Sites:</Typography>
                </Grid>

                {resourceNodes.map(resourceNode => {
                    return (
                        <Grid key={resourceNode.id} item container xs={6}>
                            <Button sx={{ margin: 1, flexGrow: 1 }} key={resourceNode.id} onClick={handleClick(resourceNode.id)} color={resourceNode.id === resourceNodeButton ? 'secondary' : 'primary'} variant="contained">{resourceNode.name}</Button>
                        </Grid>
                    );
                })}

                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button onClick={() => expeditionStart(party.id, resourceNodeButton)} disabled={(resourceNodeButton === null ? true : false) || (expedition && expedition.currentPhase !== 'finished')} variant="contained" sx={{ width: 1 }}>
                        {travelling
                            ? `Currently on expedition to ${resourceNodeRepository[expedition.target].name}`
                            : `Go on Expedition, it takes ${cost} seconds`}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
