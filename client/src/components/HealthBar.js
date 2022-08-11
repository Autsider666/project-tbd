import { LinearProgress, Typography } from '@mui/material'
import React from 'react'

const HealthBar = ({ maxValue = 100, currentValue = 50, flip = false }) => {


    return <>
        {flip && <Typography sx={{mr:1}}>{`${Math.ceil(currentValue)} / ${Math(maxValue)}`}</Typography>}
        <LinearProgress sx={{ width: '20%', height: 20, borderRadius: 1, transform: flip ? 'rotate(180deg)' : 'rotate(0deg)' }} variant="determinate" value={
            (currentValue / maxValue) * 100
            // normalise(buildings[upgrade.type].upgradeCost.amount - upgrade.remainingWork, 0, 100) / 100
        } />
        {!flip && <Typography sx={{ml:1}}>{`${Math.ceil(currentValue)} / ${Math.ceil(maxValue)}`}</Typography>}
    </>
}

export default HealthBar