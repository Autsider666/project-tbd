import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useLog } from '../../contexts/LogContext'

const World = () => <div>World</div>
const Region = () => <div>Region</div>
const Building = () => <div>Building</div>

const content = [
    { label: 'World', Component: World },
    { label: 'Region', Component: Region },
    { label: 'Building', Component: Building },
]

const Log = () => {

    return (
        <div>
            <TabsWrapper content={content} />
        </div>
    )
}

export default Log