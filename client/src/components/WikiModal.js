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
import { ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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

const WikiModal = () => {

    const { wikiModal: open, setWikiModal: setOpen } = useApp()
    const { survivorTypes } = useGame()

    // console.log(survivorTypes)




    const handleClose = () => setOpen(false);
    return (
        <BootstrapDialog
            maxWidth="lg"
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Wiki Modal - ( Survivor Overview & Stats )
            </BootstrapDialogTitle>
            <DialogContent dividers  >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Survivors</TableCell>
                                <TableCell align="right">Tier</TableCell>
                                <TableCell align="right">Health</TableCell>
                                <TableCell align="right">Damage</TableCell>
                                <TableCell align="right">Defense</TableCell>
                                <TableCell align="right">Gather</TableCell>
                                <TableCell align="right">Carry</TableCell>
                                <TableCell align="right">Travel</TableCell>
                                <TableCell align="right">Boosts</TableCell>
                                <TableCell align="right">Upgrades Into</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {survivorTypes && Object.values(survivorTypes).map(survivorType => {
                                const { stats, name, boost, tier, upgrades } = survivorType
                                const { percentage, stat } = boost || {}
                                const { hp, damage, defense, gatheringSpeed, travelSpeed, carryCapacity } = stats
                                return <TableRow key={name}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell align="right">{tier}</TableCell>
                                    <TableCell align="right">{hp}</TableCell>
                                    <TableCell align="right">{damage}</TableCell>
                                    <TableCell align="right">{defense}</TableCell>
                                    <TableCell align="right">{gatheringSpeed}</TableCell>
                                    <TableCell align="right">{travelSpeed}</TableCell>
                                    <TableCell align="right">{carryCapacity}</TableCell>
                                    <TableCell align="right">{boost ? `${percentage}% ${stat}` : ''}</TableCell>
                                    <TableCell align="right">{upgrades ? `${upgrades.join(" & ")}` : 'none'}</TableCell>


                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default WikiModal