import React from 'react'
import { ListItem, ListItemText, Tooltip } from '@mui/material'

const ResourceListItem = ({ resources }) => {

    const resourceTypes = [
        { key: 'wood', label: 'Wood', tooltip: "Used for repairing all buildings" },
        { key: 'stone', label: 'Stone', tooltip: "Used for upgrading the Settlement Tower Building" },
        { key: 'iron', label: 'Iron', tooltip: "Used for upgrading the Settlement Walls" },
    ]

    return (
        <ListItem sx={{ justifyContent: 'center' }}>
            <ListItemText sx={{ minWidth: '80px' }} primary="Resources" />
            {resourceTypes.map(({ key, label, tooltip = "" }) => (
                <Tooltip key={key} title={tooltip}>
                    <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={resources[key] || 0} secondary={label} />
                </Tooltip>
            ))}
        </ListItem>
    )
}

export default ResourceListItem
