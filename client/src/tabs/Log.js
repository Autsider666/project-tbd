import { Box, Typography } from '@mui/material';
import React from 'react';
import { useGame } from '../contexts/GameContext';
import { getColorFromSeverity } from '../main/Chat';

export const Log = () => {

    const { notificationLog } = useGame();
    // console.log(notificationLog)
    // const sortedNotifications = notificationLog.sort((a, b) => a.localTimeStamp > b.localTimeStamp)
    // console.log(sortedNotifications)
    return (
        <Box sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {notificationLog.filter((_,index)=>index < 500).map((notification, index) => {
                { /* console.log(notification) */ }
                const backgroundColor = getColorFromSeverity(notification.severity);
                return <Box sx={{ backgroundColor, margin: '1px', padding: '4px', borderRadius: '4px' }} key={index}>
                    <Typography variant="body2">
                        {`${notification.timestamp.toFormat("yyyy-MM-dd hh:mm:ss")} - ${notification.message}`}
                    </Typography>
                </Box>;
            }
            )}
        </Box>
    );
};
