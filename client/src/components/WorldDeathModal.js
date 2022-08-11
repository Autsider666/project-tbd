import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useGame } from '../contexts/GameContext';
import { useApp } from '../contexts/AppContext';
import { Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Scrollbars from 'react-custom-scrollbars-2';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const statTypes = [
    { key: 'hp', label: 'Health', tooltip: "Total Health" },
    { key: 'damage', label: 'Damage', tooltip: "Total Damage Dealt" },
    { key: 'defense', label: 'Defense', tooltip: "Total Damage Negated per attack" },
    { key: 'gatheringSpeed', label: 'Gathering', tooltip: "Amount gathered/repaired & built by tick" },
    { key: 'carryCapacity', label: 'Carry', tooltip: "Total inventory size" },
    { key: 'travelSpeed', label: 'Travel', tooltip: "Affects how fast Expeditions & Voyages takes" },
]


const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const WorldDeathModal = () => {

    // const { worldDeathModal: open, setWorldDeathModal: setOpen } = useApp()
    const { resetAuth } = useAuth()
    const { worldRepository, resetRepositories, partyRepository, settlementRepository } = useGame()

    const currentWorld = Object.values(worldRepository).find(world => world.id !== "a")

    const open = currentWorld ? Boolean(currentWorld.destroyedAt) : false

    const handleNewWorldClick = () => {
        console.log("Trying to start a new world!")
        resetAuth()
        resetRepositories()
        window.location.reload();
    }

    // console.log(survivorTypes)




    return (
        <BootstrapDialog
            maxWidth="md"
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleNewWorldClick}>
                The world has ended!
            </BootstrapDialogTitle>
            <DialogContent dividers sx={{ minHeight: '150px' }} >
                <List disablePadding sx={{ height: "300px", width: "600px" }}>
                    <Scrollbars>
                        {Object.values(partyRepository).map(party => {
                            party.settlementName = settlementRepository[party.settlement].name
                            party.tierSum = party.survivors.reduce((accum, value) => {
                                accum += value.tier
                                return accum
                            }, 0)
                            return party
                        }).sort((a, b) => b.tierSum - a.tierSum).map(party => {
                            return <ListItem key={party.id} >
                                <ListItemText primary={party.settlementName} secondary={"Settlement"} />


                                <ListItemText primary={party.name} secondary={"Party Name"} />
                                {statTypes.map(({ key, label, tooltip = "" }) => (

                                    <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={party.stats[key] || 0} secondary={label} />

                                ))}
                                <ListItemText primary={party.tierSum} secondary={"Tier Sum"} />
                            </ListItem>
                        })}
                        {Object.values(partyRepository).map(party => {
                            party.settlementName = settlementRepository[party.settlement].name
                            party.tierSum = party.survivors.reduce((accum, value) => {
                                accum += value.tier
                                return accum
                            }, 0)
                            return party
                        }).sort((a, b) => {
                            if (a.tierSum > b.tierSum) return a
                            return b
                        }).map(party => {
                            return <ListItem key={party.id} >
                                <ListItemText primary={party.settlementName} secondary={"Settlement"} />


                                <ListItemText primary={party.name} secondary={"Party Name"} />
                                {statTypes.map(({ key, label, tooltip = "" }) => (

                                    <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={party.stats[key] || 0} secondary={label} />

                                ))}

                                <ListItemText primary={party.tierSum} secondary={"Tier Sum"} />

                            </ListItem>
                        })}
                    </Scrollbars>
                </List>

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleNewWorldClick}>
                    Try new World
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default WorldDeathModal
