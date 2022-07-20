import { Button, Paper, TextField } from '@mui/material'
import './splashPage.css'
import React, { useState } from 'react'
import Water from '../components/svgTest/landmasses.png'
import { useAuth } from '../contexts/AuthContext'

const SplashPage = () => {

    const { characterCreate } = useAuth()
    const [characterName, setCharacterName] = useState("")

    return (
        <div id="splashWrapper" style={{ backgroundImage: "url(/images/waterBackground.png)" }}>
            {/* <Paper style={{ height: '100%' }}> */}

            <img id="imageBackground" src={Water} />
            <div id="characterCreationWrapper">
                <TextField label="Character Name" value={characterName} onChange={event => setCharacterName(event.target.value)} />
                <Button variant="contained" onClick={() => { characterCreate(characterName) }}>Create</Button>
            </div>

            {/* </Paper> */}

        </div>

    )
}

export default SplashPage