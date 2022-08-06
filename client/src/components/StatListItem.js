import React from 'react'
import { ListItem, ListItemText } from '@mui/material'

const StatListItem = ({ stats = {} }) => {
    console.log(stats)
    const statTypes = [
        { key: 'hp', label: 'Health', },
        { key: 'damage', label: 'Damage', },
        { key: 'defense', label: 'Defense', },
        { key: 'gatheringSpeed', label: 'Gathering', },
        { key: 'carryCapacity', label: 'Carry', },
        { key: 'travelSpeed', label: 'Travel', },
    ]

    return (
        <ListItem sx={{ justifyContent: 'center' }}>
            <ListItemText sx={{ minWidth: '80px' }} primary="Stats" />
            {statTypes.map(({ key, label }) => (
                <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={stats[key] || 0} secondary={label} />
            ))}
        </ListItem>
    )
}

export default StatListItem
