import React from 'react';
import { Button, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import { voyageStart } from '../../functions/socketCalls';
import { useGame } from '../../contexts/GameContext';

export const Settlement = () => {
    const {
        currentSettlement, controlledParty: party, selectedSettlement: settlement = {}, currentVoyage: voyage,
        selectedRegionId, settlementRepository,
        selectedRegionTravelPath,
        currentSettlementStorage
    } = useGame()

    console.log({ currentSettlement })

    if (selectedRegionId === null) return <div />

    const { cost = 0 } = selectedRegionTravelPath
    const { name } = settlement;

    const traveling = voyage && voyage.finished === false;
    voyage && console.log(voyage.finished);

    const resourceTypes = [
        { type: 'wood', },
        { type: 'stone', },
        { type: 'iron', },
    ]

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
            <Grid item xs={12}>


                <ListItem >
                    <ListItemText sx={{ minWidth: '100px' }} primary="Inventory" />
                    {resourceTypes.map(({ type }) => {


                        const resourceFound = currentSettlementStorage.find(resource => resource.type === type)
                        const { amount = 0 } = resourceFound || {}
                        return (
                            <ListItemText key={type} primary={amount} secondary={type} />
                        )
                    })
                    }
                </ListItem>
            </Grid>
        </Grid>


    );
};
