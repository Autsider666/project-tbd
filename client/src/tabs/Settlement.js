import React from 'react';
import { Box, Button, ButtonGroup, LinearProgress, List, ListItem, ListItemButton } from '@mui/material';
import { useGame } from '../contexts/GameContext';
import ResourceListItem from '../components/ResourceListItem';
import { settlementUpgrade } from '../functions/socketCalls';
import { normalise } from '../functions/utils';

const Settlement = () => {
    const {
        currentSettlement,
    } = useGame()

    // console.log(currentSettlement)

    if (currentSettlement === null) return <div />

    const { buildings, upgrade } = currentSettlement
    upgrade && console.log('Remaing work:' + upgrade.remainingWork)
    upgrade && console.log('Upgrade Cost: ' + buildings[upgrade.type].upgradeCost.amount)
    upgrade && console.log('Normalised Value:' + normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 1000))
    upgrade && console.log('Better Value From Autsider: ' + (100 - upgrade.remainingWork / buildings[upgrade.type].upgradeCost.amount * 100))
    return (
        <Box sx={{ height: '300px', width: '100%' }}>
            <List>
                <ResourceListItem resources={currentSettlement.resources} />
                <ListItem>
                    <ListItemButton disableGutters>
                        <ButtonGroup disableRipple >
                            {Object.entries(currentSettlement.buildings).map(([building, { level, upgradeCost }]) => {
                                // console.log(upgradeCost)

                                return (
                                    <Button disabled={!!upgrade} key={building} onClick={() => settlementUpgrade(currentSettlement.id, building)} sx={{ mx: 0.5 }} variant="contained">
                                        {`Upgrade ${building} from level ${level} to ${level + 1}. It costs ${upgradeCost.amount} ${upgradeCost.resource}`}
                                    </Button>
                                )
                            })}
                        </ButtonGroup>
                    </ListItemButton>
                </ListItem>
                {upgrade
                    && <ListItem>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress sx={{ height: 30, borderRadius: 1 }} variant="determinate" value={
                                (100 - upgrade.remainingWork / buildings[upgrade.type].upgradeCost.amount * 100)
                                // normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 100) / 100
                            } />
                        </Box>
                    </ListItem>}
            </List>
        </Box>


    );
};

export default Settlement