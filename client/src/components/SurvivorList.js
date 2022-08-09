import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Button, ButtonGroup, FormControlLabel, FormGroup, List, ListItem, ListItemButton, ListItemText, Popover, Switch, Tooltip } from '@mui/material';
import { useGame } from '../contexts/GameContext';
import StatListItem from './StatListItem'
import { survivorUpgrade } from '../functions/socketCalls';
import AddPersonIcon from '@mui/icons-material/PersonAdd'
import RemovePersonIcon from '@mui/icons-material/PersonRemove'

import { Scrollbars } from 'react-custom-scrollbars-2';

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

const SurvivorList = ({ height }) => {
    const { currentSettlement, dismissSurvivor, recruitSurvivor, controlledParty, survivorTypes } = useGame()
    const [expanded, setExpanded] = useState('panel1');

    const [partySwitch, setPartySwitch] = useState(true)
    const [settlementSwitch, setSettlementSwitch] = useState(true)
    const [allSwitch, setAllSwitch] = useState(false)

    const [upgradePopover, setUpgradePopover] = useState(null)
    const [survivorTypeSelected, setSurvivorTypeSelected] = useState(null)

    const handleUpgradeClick = survivorType => event => {
        setUpgradePopover(event.currentTarget);
        setSurvivorTypeSelected(survivorType)
    };

    const handleUpgradeClose = () => {
        setUpgradePopover(null);
    };

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
        <Box sx={
            {
                overflow: 'auto',
                // height: { xs: 'calc(100% - 30px)', md: 'calc(100% - 60px)', lg: 'calc(100% - 150px)', xg: 'calc(100% - 0px)' }
                height
            }
        }>

            <Scrollbars autoHide>
                {/* <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                    <FormControlLabel checked={partySwitch} onChange={event => setPartySwitch(event.target.checked)} control={<Switch />} label="Party" />
                    <FormControlLabel checked={settlementSwitch} onChange={event => setSettlementSwitch(event.target.checked)} control={<Switch />} label="Settlement" />
                    <FormControlLabel checked={allSwitch} onChange={event => setAllSwitch(event.target.checked)} control={<Switch />} label="All" />
                </FormGroup> */}
                {
                    survivorTypes && Object.values(survivorTypes).filter(switchFilter).map(survivorType => {

                        const { name, stats, upgrades = [], tier, nextUpgradeCost } = survivorType

                        const partySurvivorCount = controlledParty.survivors.filter(survivor => survivor.name === name).length
                        const settlementSurvivorsCount = currentSettlement.survivors.filter(survivor => survivor.name === name).length

                        return (

                            <Accordion key={name} expanded={expanded === name} onChange={handleChange(name)}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ justifyCenter: 'spaceAround' }} >
                                    <Typography sx={{ minWidth: '150px', flexShrink: 1 }} >{`Type: ${name}`}</Typography>
                                    <Typography sx={{ px: 1, color: 'text.secondary', flexGrow: 1 }}>{`Tier: ${tier}`}</Typography>

                                    <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Party: ${partySurvivorCount}`}</Typography>
                                    <Typography sx={{ px: 1, color: 'text.secondary' }}>{`Settlement: ${settlementSurvivorsCount}`}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List >
                                        <StatListItem stats={stats}>
                                            {/* <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} primary={nextUpgradeCost} secondary={"Next Upgrade"} /> */}
                                            {upgrades.length > 0 && <ListItemButton onClick={handleUpgradeClick(name)} sx={{ pl: 0.5 }} disableGutters>
                                                <Tooltip title="Open the upgrade menu">
                                                    <Button variant="contained">Upgrade</Button>
                                                </Tooltip>
                                            </ListItemButton>}
                                            <ListItemButton disableGutters>
                                                <ButtonGroup sx={{ pl: 0.5 }} orientation="vertical" aria-label="vertical outlined button group" >
                                                    <Tooltip title={`Recruits 1 ${name} from your current settlement.`}>
                                                        <Button onClick={() => recruitSurvivor(name, controlledParty.id)} sx={{ my: 0.5 }} variant="contained" startIcon={<AddPersonIcon />}>Recruit</Button>
                                                    </Tooltip>
                                                    <Tooltip title={`Dismisses 1 ${name} from your party.`}>
                                                        <Button onClick={() => dismissSurvivor(name, controlledParty.id)} sx={{ my: 0.5 }} variant="contained" startIcon={<RemovePersonIcon />}>Dismiss</Button>
                                                    </Tooltip>
                                                </ButtonGroup>
                                            </ListItemButton>
                                        </StatListItem>
                                        {/* <ListItem disableGutters>
                                            <ListItemButton disableGutters>
                                                <ButtonGroup disableRipple >
                                                    {upgrades.map(upgrade => (
                                                        <Button onClick={() => {
                                                            survivorUpgrade(controlledParty.id, name, upgrade)
                                                        }} key={upgrade} sx={{ mx: 0.5 }} variant="contained">{`Upgrade into ${upgrade} for ${nextUpgradeCost} energy`}</Button>
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
                                        </ListItem> */}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })
                }
            </Scrollbars>
            <Popover
                id={"UpgradeIdPopover"}
                open={Boolean(upgradePopover)}
                anchorEl={upgradePopover}
                onClose={handleUpgradeClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <ButtonGroup sx={{ pl: 0.5 }} orientation="vertical" aria-label="verticalUpgradeButtonGroup" >
                    {survivorTypeSelected && survivorTypes[survivorTypeSelected].upgrades.map(upgrade => (
                        <Button onClick={() => {
                            survivorUpgrade(controlledParty.id, survivorTypeSelected, upgrade)
                        }} key={upgrade} sx={{ m: 1 }} variant="contained">
                            {`Upgrade into ${upgrade} for ${survivorTypes[survivorTypeSelected].nextUpgradeCost} energy`}
                        </Button>
                    ))}
                </ButtonGroup>
            </Popover>
        </Box>
    );
}

export default SurvivorList