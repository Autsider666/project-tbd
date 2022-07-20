import React from 'react'
import { useLog } from '../../contexts/LogContext'

const Log = () => {

    const { log } = useLog()
    console.log({ log })

    return (
        <div>Log</div>
    )
}

export default Log