import React from 'react'
import { ListItem, ListItemText } from '@mui/material'

const ResourceListItem = ({ resources }) => {

    const resourceTypes = [
        { key: 'wood', label: 'Wood', },
        { key: 'stone', label: 'Stone', },
        { key: 'iron', label: 'Iron', },
    ]

    return (
        <ListItem sx={{ justifyContent: 'center' }}>
            <ListItemText sx={{ minWidth: '80px' }} primary="Resources" />
            {resourceTypes.map(({ key, label }) => (
                <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={resources[key] || 0} secondary={label} />
            ))}
        </ListItem>
    )
}

export default ResourceListItem
