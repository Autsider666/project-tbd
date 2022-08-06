import React from 'react';
import { Box, Button, Grid, ListItem, ListItemText, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { voyageStart } from '../../functions/socketCalls';
import { useGame } from '../../contexts/GameContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const Settlement = () => {
    const {
        currentSettlementSurvivors: survivors, recruitSurvivor, controlledParty,
        currentSettlement, controlledParty: party, selectedSettlement: settlement = {}, currentVoyage: voyage,
        selectedRegionId, settlementRepository,
        selectedRegionTravelPath,
        currentSettlementStorage
    } = useGame()

    const { id: partyId } = controlledParty || {}

    const recruitHandler = survivorType => () => recruitSurvivor(survivorType, partyId)

    if (selectedRegionId === null) return <div />

    const { cost = 0 } = selectedRegionTravelPath
    const { name } = settlement;

    const traveling = voyage && voyage.finished === false;
    const isInSettlement = settlement.id === party.settlement

    voyage && console.log(voyage.finished);

    const resourceTypes = [
        { type: 'wood', },
        { type: 'stone', },
        { type: 'iron', },
    ]

    return (
        <Grid container sx={{ padding: 0 }}>
            {/* <Grid sx={{ margin: 1 }} item xs={12}>
                <Typography textAlign={"center"} variant="h5">Settlement of {`${name}`}</Typography>
            </Grid> */}
            <Grid sx={{ margin: 1 }} item xs={12}>
                <Button disabled={traveling || isInSettlement} onClick={() => voyageStart(party.id, settlement.id)} variant="contained">
                    {isInSettlement
                        ? `You're already in ${name}!`
                        : traveling
                            ? `Travelling to ${settlementRepository[voyage.target].name}`
                            : `Travel to ${name}. It takes ${cost} seconds.`}
                </Button>
            </Grid>

            <Grid item xs={12}>


                <ListItem >
                    <ListItemText sx={{ minWidth: '100px' }} primary="Inventory" />
                    {resourceTypes.map(({ type }) => {
                        const resourceFound = currentSettlementStorage.find(resource => resource && resource.type === type)
                        const { amount = 0 } = resourceFound || {}
                        return (
                            <ListItemText key={type} primary={amount} secondary={type} />
                        )
                    })
                    }
                </ListItem>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ height: '210px ', width: '100%', overflow: 'auto' }}>
                    <TableContainer >
                        <Table stickyHeader={true} size="small">
                            <TableHead >
                                <TableRow sx={{ width: '200px' }}>
                                    <TableCell >Name</TableCell>
                                    <TableCell>HP</TableCell>
                                    <TableCell>DMG</TableCell>
                                    <TableCell>Def</TableCell>
                                    <TableCell>Gather</TableCell>
                                    <TableCell>Travel</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    survivors.map(({ name, stats }, index) => {
                                        const { damage, hp, gatheringSpeed, travelSpeed, defense } = stats
                                        return (
                                            <TableRow key={index} sx={{
                                                "&:last-child td, &:last-child th": { border: 0, width: "80px" }
                                            }}>
                                                <TableCell component="td" scope='row' >{name}</TableCell>
                                                <TableCell align="right">{hp}</TableCell>
                                                <TableCell align="right">{damage}</TableCell>
                                                <TableCell align="right">{defense}</TableCell>
                                                <TableCell align="right">{gatheringSpeed}</TableCell>
                                                <TableCell align="right">{travelSpeed}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={recruitHandler(name)} >
                                                        <PersonAddIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }


                            </TableBody>

                        </Table>

                    </TableContainer>
                </Box>
            </Grid>
        </Grid>


    );
};
