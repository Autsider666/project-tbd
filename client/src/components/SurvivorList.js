import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Button, ButtonGroup, FormControlLabel, FormGroup, List, ListItem, ListItemButton, Switch } from '@mui/material';
import { useGame } from '../contexts/GameContext';
import StatListItem from './StatListItem'
import { survivorUpgrade } from '../functions/socketCalls';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const SurvivorList = () => {
    const { currentSettlement, dismissSurvivor, recruitSurvivor, controlledParty, survivorTypes } = useGame()
    const [expanded, setExpanded] = useState('panel1');

    const [partySwitch, setPartySwitch] = useState(true)
    const [settlementSwitch, setSettlementSwitch] = useState(false)
    const [allSwitch, setAllSwitch] = useState(false)

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const switchFilter = (survivorTypes => {
        if (allSwitch) return true
        if (settlementSwitch && currentSettlement.survivors.some(survivor => survivor.name === survivorTypes.name)) return true
        if (partySwitch && controlledParty.survivors.some(survivor => survivor.name === survivorTypes.name)) return true
        return false
    })
    return (
        <Box sx={{ overflow: 'auto', height: '100%' }}>

            <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                <FormControlLabel checked={partySwitch} onChange={event => setPartySwitch(event.target.checked)} control={<Switch />} label="Party" />
                <FormControlLabel checked={settlementSwitch} onChange={event => setSettlementSwitch(event.target.checked)} control={<Switch />} label="Settlement" />
                <FormControlLabel checked={allSwitch} onChange={event => setAllSwitch(event.target.checked)} control={<Switch />} label="All" />
            </FormGroup>
            {
                survivorTypes && Object.values(survivorTypes).filter(switchFilter).map(survivorType => {

                    const { name, stats, upgrades = [], tier, nextUpgradeCost } = survivorType

                    const partySurvivorCount = controlledParty.survivors.filter(survivor => survivor.name === name).length
                    const settlementSurvivorsCount = currentSettlement.survivors.filter(survivor => survivor.name === name).length

                    return (

                        <Accordion key={name} expanded={expanded === name} onChange={handleChange(name)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography sx={{ width: '35%', flexShrink: 0 }} >{`Type: ${name}`}</Typography>

                                <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Tier: ${tier}`}</Typography>
                                <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Party: ${partySurvivorCount}`}</Typography>
                                <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Settlement: ${settlementSurvivorsCount}`}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List >
                                    <StatListItem stats={stats} />
                                    <ListItem disableGutters>
                                        <ListItemButton disableGutters>
                                            <ButtonGroup disableRipple >
                                                {upgrades.map(upgrade => (
                                                    <Button onClick={()=>{
                                                        survivorUpgrade(controlledParty.id, name, upgrade)
                                                    }} key={upgrade} sx={{ mx: 0.5 }} variant="contained">{`Upgrade 1 into ${upgrade} for ${nextUpgradeCost} energy`}</Button>
                                                ))}
                                            </ButtonGroup>
                                        </ListItemButton>
                                        <ListItemButton disableGutters>
                                            <ButtonGroup disableRipple >
                                                <Button onClick={() => recruitSurvivor(name, controlledParty.id)} sx={{ mx: 0.5 }} variant="contained">
                                                    {`Recruit one ${name}`}
                                                </Button>
                                                <Button onClick={() => dismissSurvivor(name, controlledParty.id)} sx={{ mx: 0.5 }} variant="contained">
                                                    {`Dismiss one ${name}`}
                                                </Button>
                                            </ButtonGroup>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                    )



                })
            }



            {/* {
                partySurvivorsGrouped && partySurvivorsGrouped.map(survivorGroup => {
                    const { name, content, count } = survivorGroup
                    const { stats, upgrades } = content
                    const { damage, hp, gatheringSpeed, travelSpeed, defense } = stats
                    const settlementSurvivorsCount = currentSettlement.survivors.filter(survivor => survivor.name === name).length



                    return (

                        <Accordion key={name} expanded={expanded === name} onChange={handleChange(name)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography sx={{ width: '40%', flexShrink: 0 }} >{`Type: ${name}`}</Typography>
                                <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Party: ${count}`}</Typography>
                                <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Settlement: ${settlementSurvivorsCount}`}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItem >
                                        <ListItemText primary={damage} secondary="DMG" />
                                        <ListItemText primary={hp} secondary="HP" />
                                        <ListItemText primary={gatheringSpeed} secondary="Def" />
                                        <ListItemText primary={travelSpeed} secondary="Gather" />
                                        <ListItemText primary={defense} secondary="Travel" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemButton disableGutters>
                                            <ButtonGroup disableRipple >
                                                {upgrades.map(upgrade => (
                                                    <Button key={upgrade} sx={{ mx: 0.5 }} variant="contained">{`Upgrade into ${upgrade}`}</Button>
                                                ))}
                                            </ButtonGroup>
                                        </ListItemButton>
                                        <ListItemButton disableGutters>
                                            <ButtonGroup disableRipple >
                                                <Button onClick={() => recruitSurvivor(name, controlledParty.id)} sx={{ mx: 0.5 }} variant="contained">
                                                    {`Recruit one ${name}`}
                                                </Button>
                                                <Button onClick={() => dismissSurvivor(name, controlledParty.id)} sx={{ mx: 0.5 }} variant="contained">
                                                    {`Dismiss one ${name}`}
                                                </Button>
                                            </ButtonGroup>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            } */}

        </Box>
    );
}

export default SurvivorList