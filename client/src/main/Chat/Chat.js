import { Box, Button, Grid, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useChat } from '../../contexts/ChatContext'
import { useGame } from '../../contexts/GameContext'



const ChatComponent = room => {

    const [randomMessages, setRandomMessages] = useState(["test", "test2", "test3"])
    const [inputField, setInputField] = useState("")
    const inputFieldHandler = event => {
        // console.log(event.target.value)
        setInputField(event.target.value)
    }
    const saveMessage = () => {

        setRandomMessages(prev => {
            return [inputField, ...prev ]
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

                    <List dense={true} sx={{ padding: 0, marginTop: 0, marginBottom: 0, height: '100%', width: '100%' }}>
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

const getColorFromSeverity = severity => {
    switch (severity) {
        case 'info': return '#5789c8'
        case 'success': return '#77ca77'
        case 'warning': return '#d1d96d'
        case 'error': return '#e16b6b'
        default: return 'white'
    }
}


const World = () => <div>World</div>
const Global = () => <div>Global</div>
const Log = () => {

    const { notificationLog } = useGame()
    // console.log(notificationLog)

    // const sortedNotifications = notificationLog.sort((a, b) => a.localTimeStamp > b.localTimeStamp)
    // console.log(sortedNotifications)

    return (
        <Box sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }} >
            {notificationLog.map((notification, index) => {
                const backgroundColor = getColorFromSeverity(notification.severity)

                return <Box sx={{ backgroundColor, margin: '1px', padding: '4px', borderRadius: '4px' }} key={index}>
                    {notification.message}
                </Box>
            }
            )}
        </Box>
    )
}

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