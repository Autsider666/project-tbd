import { Box, Button, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useChat } from '../../contexts/ChatContext'



const ChatComponent = room => {

    const [randomMessages, setRandomMessages] = useState(["test", "test2", "test3"])
    const [inputField, setInputField] = useState("")
    const inputFieldHandler = event => {
        // console.log(event.target.value)
        setInputField(event.target.value)
    }
    const saveMessage = () => {

        setRandomMessages(prev => {
            return [...prev, inputField]
        })
    }

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Grid container gap={0} sx={{ height: '100%', width: '100%', alignContent: 'start' }}>
                <Grid item xs={8} sx={{ padding: 1, height: '70px', margin: 1, mt: 0 }} >
                    <TextField onChange={inputFieldHandler} fullWidth={true} />
                </Grid>
                <Grid item xs={3} sx={{ padding: 1, my: 1, mt: 0 }}>
                    <Button sx={{ width: '100%', height: '100%' }} variant="contained" onClick={saveMessage}>Send</Button>
                </Grid>

                <Grid item container xs={12} sx={{ borderRadius: '4px', border: '1px solid black', flexGrow: 1, height: 'calc(100% - 80px)', overflow: 'auto' }}>

                    <List dense={true} sx={{ padding: 0, marginTop: 0, marginBottom: 0,  height: '100%', width: '100%' }}>
                        {
                            randomMessages.map((message, index) => {
                                return (
                                    <ListItem key={index} sx={{ padding: 0, margin: 0, marginBottom: 0 }}>
                                        <ListItemText>
                                            {`RandomUser: ${message}`}
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Grid>
            </Grid>
        </Box >
    )
}



const World = () => <div>World</div>
const Global = () => <div>Global</div>
const Log = () => <div>Log</div>

const content = [
    { label: 'World', Component: ChatComponent, props: { room: 'world' } },
    { label: 'Global', Component: ChatComponent, props: { room: 'global' } },
    { label: 'Whisper', Component: ChatComponent, props: { room: 'whisper' } },
    { label: 'Log', Component: Log, tabSx: { marginLeft: 'auto' } },
]

const Chat = () => {

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <TabsWrapper content={content} />
        </Box>
    )
}

export default Chat