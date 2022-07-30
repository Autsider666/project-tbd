import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { expeditionStart } from '../../functions/socketCalls';
import { useGame } from '../../contexts/GameContext';

export const ExpeditionSites = () => {
    const [resourceNodeButton, resourceNodeButtonSelected] = React.useState(null);
    const { regionRepository, selectedRegionId, partyRepository, expeditionRepository, resourceNodeRepository, selectedRegionTravelPath = {} } = useGame()


    if (selectedRegionId === null) return <div />

    const region = regionRepository[selectedRegionId]
    // const settlement = settlementRepository[region.settlement]
    const party = Object.values(partyRepository).find(party => party.controllable === true)

    const expedition = Object.values(expeditionRepository).find(expedition => expedition.party === party.id && expedition.phase !== "finished")

    const { name } = region;
    const resourceNodes = Object.values(resourceNodeRepository).filter(resourceNode => region.nodes.find(regionNode => regionNode === resourceNode.id));

    const { cost = 0 } = selectedRegionTravelPath

    const handleClick = (node) => () => {

        resourceNodeButtonSelected(prev => {
            if (prev === node)
                return null;
            return node;
        });

    };

    // console.log({ name, nodes, settlement })
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ padding: 0 }}>
                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5">Region of {`${name}`}</Typography>

                </Grid>
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
                    <Button onClick={() => expeditionStart(party.id, resourceNodeButton)} disabled={(resourceNodeButton === null ? true : false) || (expedition && expedition.phase !== 'finished')} variant="contained" sx={{ width: 1 }}>
                        {expedition && expedition.phase !== 'finished'
                            ? `Currently on expedition to ${resourceNodeRepository[expedition.target].name}`
                            : `Go on Expedition, it takes ${cost} seconds`}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
