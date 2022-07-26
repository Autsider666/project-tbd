import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'

const SplashPage = () => {

    const { characterCreate } = useAuth()
    const { displaySnackbar } = useApp()
    const [characterName, setCharacterName] = useState("")

    return (
        <>
            <Box sx={{
                // margin: 3,
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                border: '1px solid black',
                backgroundImage: 'url(/images/waterBackground.png)',
                backgroundRepeat: 'round',
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
                    height: '30%',
                    width: '40%',
                    background: 'lightgray',
                    borderRadius: '10px',
                    border: '1px solid black',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }} >
                    <TextField label="Character Name" value={characterName} onChange={event => setCharacterName(event.target.value)} />
                    <Button variant="contained" onClick={() => {
                        displaySnackbar(`The party called ${characterName} joined the game!`, 'success')
                        characterCreate(characterName)
                    }}>
                    Create
                    </Button>

                </Box>
            </Box>

        </>
    )
}

export default SplashPage