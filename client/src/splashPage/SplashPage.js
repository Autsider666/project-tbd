import styled from '@emotion/styled';
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'

const StyledSearchTextField = styled(TextField)(({ theme }) => ({
    // color: "white",
    "& .MuiInputBase-root": {
        color: "white",
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.53)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.73)",
        },
        "&:active fieldset": {
            borderColor: "rgba(255, 255, 255, 0.63)",
        },
    },
    "& .MuiInputLabel-root": {
        color: "white",
        "& .Mui-focused": {
            color: "white",
        },
    },
    "& label.Mui-focused": {
        color: "white",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "white",
    },
    "& .MuiInputBase-input": {
        color: "white",
        "& fieldset > legend": {
            color: "white",
        },
    },
    "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.63)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.63)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "rgba(255, 255, 255, 0.63)",
        },
    },
}));

const SplashPage = ({ marginAmount }) => {

    const { partyCreate } = useAuth()
    const { displaySnackbar } = useApp()
    const [partyName, setPartyName] = useState("")

    const textFieldChangeHandler = event => setPartyName(event.target.value);
    const textFieldKeyPressHandler = event => {
        if(event.key === 'Enter') partyCreate(partyName)
    }

    

    return (
        <>
            <Box sx={{
                // margin: 3,
                height: `calc(100vh - 70.5px - ${marginAmount * 2}px)`,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid black',
                backgroundImage: 'url(/images/waterBackground.png)',
                backgroundSize: 'cover',
            }}>
                <Box sx={{
                    opacity: 0.3,
                    objectFit: 'scale-down',
                    filter: 'blur(2px)',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/images/landmassesBackground.png)',
                    backgroundRepeat: 'space',
                    backgroundPositionX: '50%',
                }}
                />

                <Box sx={{
                    position: 'absolute',
                    // height: '30%',
                    width: { xs: '60%', md: '40%' },
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderRadius: '10px',
                    border: '1px solid black',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }} >
                    <Grid gap={2} container sx={{ width: '100%', my: 'auto', padding: { xs: 3, md: 6 }, justifyContent: "center" }}>
                        <Grid item xs={12}>
                            <Box
                                padding={2}
                                gridRow={1}
                                borderRadius={'4px'}
                                sx={{
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: (theme) => theme.palette.primary.contrastText,
                                }}
                            >
                                <Typography sx={{ textAlign: 'center', color: theme => theme.palette.primary.contrastText, fontSize: { xs: '1m', md: "1.5em", lg: "2em" } }}  >
                                    Welcome to Project TBD
                                </Typography>
                                <Typography>
                                    "There you are.... You're too late, the fractured timestream has already destroyed most of the world. Do you think you can still do something for us.... After The End?"
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6} my={1}>
                            <TextField fullWidth={true} label="Party Name" value={partyName} onChange={textFieldChangeHandler} onKeyPress={textFieldKeyPressHandler} />
                        </Grid>
                        <Grid item xs={4} md={6} my={1}>
                            <Button sx={{ height: '100%', width: '100%' }} variant="contained" onClick={() => {
                                // displaySnackbar(`The party called ${partyName} joined the game!`, 'success')
                                partyCreate(partyName)
                            }}>
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

        </>
    )
}

export default SplashPage