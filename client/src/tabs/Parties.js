import * as React from 'react';
import { Divider, List, Box, ListItem, ListItemText, Tooltip } from '@mui/material'
import { useGame } from '../contexts/GameContext';
import { Container } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Scrollbars from 'react-custom-scrollbars-2';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const statTypes = [
    { key: 'hp', label: 'Health', tooltip: "Total Health" },
    { key: 'damage', label: 'Damage', tooltip: "Total Damage Dealt" },
    { key: 'defense', label: 'Defense', tooltip: "Total Damage Negated per attack" },
    { key: 'gatheringSpeed', label: 'Gathering', tooltip: "Amount gathered/repaired & built by tick" },
    { key: 'carryCapacity', label: 'Carry', tooltip: "Total inventory size" },
    { key: 'travelSpeed', label: 'Travel', tooltip: "Affects how fast Expeditions & Voyages takes" },
]

const Parties = ({ height }) => {
    const { controlledParty, partyRepository, settlementRepository, survivorRepository } = useGame()
    const theme = useTheme();
    const [settlementNameSelected, setSettlementNameSelected] = React.useState([]);

    // const [settlementSelected, setSettlementSelected] = React.useState(
    //     Object.keys(settlementRepository).reduce((accum,value)=>{
    //         if(value === controlledParty.settlement){
    //             accum[value] = true
    //         } else {
    //             accum[value] = false
    //         }
    //         return accum
    //     },{})
    // )

    const [settlementSelected, setSettlementSelected] = React.useState([])

    const handleChange = (event) => {
        const { target: { value }, } = event;
        setSettlementSelected(value.map(row => Object.values(settlementRepository).find(settlement => settlement.name === row)))
        setSettlementNameSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    if (!controlledParty) return <div />
    return (
        <List sx={{ height, width: "100%", py: 0 }} >
            <Container disableGutters>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-name-label">Select Settlements</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={settlementNameSelected}
                            onChange={handleChange}
                            input={<OutlinedInput label="Select Settlements" />}
                            MenuProps={MenuProps}
                        >


                            {Object.values(settlementRepository).map(settlement => {
                                const { name, id } = settlement

                                return (

                                    <MenuItem
                                        key={id}
                                        value={name}
                                        style={getStyles(name, settlementNameSelected, theme)}
                                    >
                                        {name}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <List sx={{ height: height - 80 }}>
                    <Scrollbars>
                        {Object.values(partyRepository).filter(party => (settlementSelected.length === 0 ? true : settlementSelected.find(settlement => settlement.id === party.settlement))).filter(party => party.dead === false).map(party => {
                            party.settlementName = settlementRepository[party.settlement].name
                            party.tierSum = party.survivors.reduce((accum, value) => {
                                accum += value.tier
                                return accum
                            }, 0)
                            return <ListItem key={party.id} >
                                <ListItemText primary={party.settlementName} secondary={"Settlement"} />


                                <ListItemText primary={party.name} secondary={"Party Name"} />
                                {statTypes.map(({ key, label, tooltip = "" }) => (
                                    <Tooltip key={key} title={tooltip}>
                                        <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={party.stats[key] || 0} secondary={label} />
                                    </Tooltip>
                                ))}
                                <ListItemText primary={party.tierSum} secondary={"Tier Sum"} />
                            </ListItem>
                        })}
                        
                    </Scrollbars>
                </List>

            </Container>
        </List>
    )
}

export default Parties