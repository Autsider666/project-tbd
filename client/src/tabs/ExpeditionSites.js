import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { expeditionStart } from '../functions/socketCalls';
import { useGame } from '../contexts/GameContext';
import { voyageStart } from '../functions/socketCalls';

const ExpeditionSites = () => {
    const [resourceNodeButton, resourceNodeButtonSelected] = React.useState(null);

    const {
        controlledParty, currentExpedition, selectedResourceNodes = [],
        selectedRegionId, resourceNodeRepository, settlementRepository,
        selectedRegionTravelPath = {}, currentVoyage, selectedSettlement = {},
    } = useGame()

    if (selectedRegionId === null || selectedResourceNodes.length === 0 || Object.values(resourceNodeRepository).length === 0) return <div />

    const { cost = 0 } = selectedRegionTravelPath

    const travelling = currentExpedition && currentExpedition.currentPhase !== 'finished';
    const handleClick = node => () => resourceNodeButtonSelected(prev => prev === node ? null : node)

    const { name : settlementName } = selectedSettlement;

    const traveling = currentVoyage && currentVoyage.finished === false;
    const isInSettlement = selectedSettlement.id === controlledParty.settlement

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ padding: 0 }}>
                {/* <Grid sx={{ margin: 1 }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Region of {`${name}`}</Typography>

                </Grid> */}
                <Grid sx={{ margin: 1, justifyContent: 'center' }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Resource Expeditions:</Typography>
                </Grid>

                {selectedResourceNodes.map(resourceNode => {
                    return (
                        <Grid key={resourceNode.id} item container xs={3}>
                            <Button sx={{ margin: 1, flexGrow: 1 }} key={resourceNode.id} onClick={handleClick(resourceNode.id)} color={resourceNode.id === resourceNodeButton ? 'secondary' : 'primary'} variant="contained">{resourceNode.name}</Button>
                        </Grid>
                    );
                })}

                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button onClick={() => expeditionStart(controlledParty.id, resourceNodeButton)} disabled={(resourceNodeButton === null ? true : false) || (currentExpedition && currentExpedition.currentPhase !== 'finished')} variant="contained" sx={{ width: 1 }}>
                        {travelling
                            ? `Currently on expedition to ${resourceNodeRepository[currentExpedition.target].name}`
                            : `Go on Expedition, it takes ${cost} seconds`}
                    </Button>
                </Grid>

                <Grid sx={{ margin: 1, justifyContent: 'center' }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Settlement Voyage:</Typography>
                </Grid>

                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button disabled={traveling || isInSettlement} onClick={() => voyageStart(controlledParty.id, selectedSettlement.id)} variant="contained">
                        {isInSettlement
                            ? `You're already in ${settlementName}!`
                            : traveling
                                ? `Travelling to ${settlementRepository[currentVoyage.target].name}`
                                : `Travel to ${settlementName}. It takes ${cost} seconds.`}
                    </Button>
                </Grid>

            </Grid>
        </Box>
    );
};

export default ExpeditionSites