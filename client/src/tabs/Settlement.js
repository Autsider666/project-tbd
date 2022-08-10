import React from 'react';
import { Box, Button, ButtonGroup, Divider, LinearProgress, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, Tooltip, Typography } from '@mui/material';
import { useGame } from '../contexts/GameContext';
import ResourceListItem from '../components/ResourceListItem';
import { settlementUpgrade } from '../functions/socketCalls';
import { normalise } from '../functions/utils';
import SurvivorList from '../components/SurvivorList';
import StatListItem from '../components/StatListItem';
import { Scrollbars } from 'react-custom-scrollbars-2';
import HealthBar from '../components/HealthBar';

const Settlement = ({ height }) => {
    const {
        currentSettlement, currentSettlementParties,
    } = useGame()

    // console.log(currentSettlement)

    if (currentSettlement === null) return <div />

    const { buildings, upgrade, hp, damage } = currentSettlement
    console.log(currentSettlement)
    upgrade && console.log('Remaing work:' + upgrade.remainingWork)
    upgrade && console.log('Upgrade Cost: ' + buildings[upgrade.type].upgradeCost.amount)
    upgrade && console.log('Normalised Value:' + normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 1000))
    upgrade && console.log('Better Value From Autsider: ' + (100 - upgrade.remainingWork / buildings[upgrade.type].upgradeCost.amount * 100))
    return (
        <Box sx={{ height: '300px', width: '100%' }}>
            <List>
                <ResourceListItem resources={currentSettlement.resources} />
                <Divider sx={{ pt: 0.5 }} />
                <ListItem>
                    <ListItemText sx={{ width: '50px' }}>Building</ListItemText>
                    <ListItemText sx={{ width: '50px' }}>Current Stat</ListItemText>
                    <ListItemText sx={{ width: '50px' }}>Next Upgrade Cost</ListItemText>
                    <ListItemSecondaryAction></ListItemSecondaryAction>
                </ListItem>

                {Object.entries(currentSettlement.buildings).map(([building, { level, upgradeCost }]) => {
                    // console.log(upgradeCost)

                    return (
                        <ListItem>
                            <ListItemText sx={{ width: '50px' }}>
                                {`Level ${level} ${building}`}
                            </ListItemText>
                            <ListItemText sx={{ width: '50px' }}>
                                {building === "Tower"
                                    ? `${damage} Damage`
                                    : `${hp} Health`
                                }
                            </ListItemText>
                            <ListItemText sx={{ width: '50px' }}>
                                {`${upgradeCost.amount} ${upgradeCost.resource}`}
                            </ListItemText>

                            <ListItemSecondaryAction>
                                <Tooltip title={building === "Tower" ? "Increase Damage by 100" : "Increase health by 1000"} >
                                    <Button disabled={!!upgrade} key={building} onClick={() => settlementUpgrade(currentSettlement.id, building)} sx={{ mx: 0.5 }} variant="contained">
                                        {`Upgrade`}
                                    </Button>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })}
                {upgrade
                    && <>
                        <Divider sx={{ py: 0.5 }} />
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress sx={{ height: 30, borderRadius: 1 }} variant="determinate" value={
                                    (100 - upgrade.remainingWork / buildings[upgrade.type].upgradeCost.amount * 100)
                                    // normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 100) / 100
                                } />
                            </Box>
                        </ListItem>
                    </>
                }
                <Divider sx={{ pt: 0.5 }} />
                <Box sx={{ overflow: 'auto', height: height - 280 }}>
                    <Scrollbars autoHide>
                        {
                            currentSettlementParties.map(party => {
                                return (
                                    <StatListItem stats={party.stats} title={`Party of ${party.name}`} />
                                )
                            })
                        }
                    </Scrollbars>
                </Box>
                {
                    currentSettlement.raid && <>
                        <Divider sx={{ pt: 0.5 }} />
                        <>
                            <Box sx={{display:'flex', py: 1}}>
                            <Typography sx={{ px: 1 }}> Settlement</Typography>
                            <HealthBar maxValue={currentSettlement.hp} currentValue={currentSettlement.hp - currentSettlement.damageTaken} />
                            <Box sx={{ flexGrow: 1 }} />
                            <HealthBar flip={true} maxValue={currentSettlement.raid.hp} currentValue={currentSettlement.raid.hp - currentSettlement.raid.damageTaken} />
                            <Typography sx={{ px: 1 }}>Zombies</Typography>
                            </Box>
                        </>
                    </>
                }
            </List>

        </Box>


    );
};

export default Settlement