import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { voyageStart } from '../../functions/socketCalls';
import { useGame } from '../../contexts/GameContext';

export const Settlement = () => {
    const { regionRepository, selectedRegionId, settlementRepository, partyRepository, voyageRepository, selectedRegionTravelPath} = useGame()

    if (selectedRegionId === null) return <div />

    const region = regionRepository[selectedRegionId]
    const settlement = settlementRepository[region.settlement]
    const party = Object.values(partyRepository).find(party => party.controllable === true)

    const voyage = Object.values(voyageRepository).find(voyage => voyage.party === party.id && voyage.finished === false)

    const { cost = 0 } = selectedRegionTravelPath

    const { name } = settlement;
    // console.log(voyage)
    const traveling = voyage && voyage.finished === false;
    voyage && console.log(voyage.finished);
    // console.log(traveling)
    return (
        <Grid container sx={{ padding: 0 }}>
            <Grid sx={{ margin: 1 }} item xs={12}>
                <div>Name of Settlement: {name}</div>
            </Grid>
            {settlement.id !== party.settlement &&
                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button disabled={traveling} onClick={() => voyageStart(party.id, settlement.id)} variant="contained">
                        {traveling
                            ? `Travelling to ${settlementRepository[voyage.target].name}`
                            : `Travel to ${name}. It takes ${cost} seconds.`}
                    </Button>
                </Grid>}
            {settlement.id === party.settlement &&
                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Typography> You are here! </Typography>
                </Grid>}

        </Grid>
    );
};
