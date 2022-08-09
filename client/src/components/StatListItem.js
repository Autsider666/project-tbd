import React from 'react'
import { ListItem, ListItemText, Tooltip } from '@mui/material'

const StatListItem = ({ stats = {}, title = "Stats", children }) => {
    const statTypes = [
        { key: 'hp', label: 'Health', tooltip: "Total Health" },
        { key: 'damage', label: 'Damage', tooltip: "Total Damage Dealt" },
        { key: 'defense', label: 'Defense', tooltip: "Total Damage Negated per attack" },
        { key: 'gatheringSpeed', label: 'Gathering', tooltip: "Amount gathered/repaired & built by tick" },
        { key: 'carryCapacity', label: 'Carry', tooltip: "Total inventory size" },
        { key: 'travelSpeed', label: 'Travel', tooltip: "Affects how fast Expeditions & Voyages takes" },
    ]

    return (
        <ListItem sx={{ justifyContent: 'center' }}>
            <ListItemText sx={{ minWidth: '50px' }} primary={title} />
            {statTypes.map(({ key, label, tooltip = "" }) => (
                <Tooltip key={key} title={tooltip}>
                    <ListItemText sx={{ mx: 0.5, textAlign: 'center' }} key={key} primary={stats[key] || 0} secondary={label} />
                </Tooltip>
            ))}
            {children}
        </ListItem>
    )
}

export default StatListItem
