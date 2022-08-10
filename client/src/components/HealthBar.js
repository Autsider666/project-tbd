import { LinearProgress } from '@mui/material'
import React from 'react'

const HealthBar = ({ minValue = 0, maxValue = 100, currentValue = 50, flip = false }) => {


    return <LinearProgress sx={{ width: '20%', height: 20, borderRadius: 1, transform: flip ? 'rotate(180deg)' : 'rotate(0deg)' }} variant="determinate" value={
        (currentValue / maxValue) * 100
        // normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 100) / 100
    } />
}

export default HealthBar