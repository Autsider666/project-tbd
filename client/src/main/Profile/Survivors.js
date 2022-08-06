import * as React from 'react';
import { Box, IconButton, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useGame } from '../../contexts/GameContext';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SurvivorList from '../../components/SurvivorList.js'

const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'hp', headerName: 'Health', width: 80 },
    { field: 'damage', headerName: 'Damage', width: 80 },
    { field: 'gatheringSpeed', headerName: 'Gathering', width: 80 },
];

const Survivors = () => {

    const { partySurvivors: survivors, dismissSurvivor, controlledParty, partySurvivorsGrouped } = useGame()
    // console.log(survivors)
    const { id: partyId } = controlledParty || {}

    const dismissHandler = survivorType => () => dismissSurvivor(survivorType, partyId)
    console.log(survivors)
    if(true) return <SurvivorList partySurvivorsGrouped={partySurvivorsGrouped} />

    return (
        <Box sx={{ height: '330px ', width: '100%', overflow: 'auto' }}>
            <TableContainer>

                <Table size="small">
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
                                const {damage, hp, gatheringSpeed, travelSpeed, defense} = stats
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
                                            <IconButton onClick={dismissHandler(name)} >
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }


                    </TableBody>

                </Table>

            </TableContainer>

            {/* <List>
                {
                    survivors.map(survivor => {
                        return (
                            <ListItem key={survivor.id}>
                                {survivor.name}
                            </ListItem>
                        )
                    })
                }
            </List> */}
        </Box>
    )
}

export default Survivors

