import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Button, Grid } from '@mui/material';


const RegionOverview = ({ region }) => {
    const { name, nodes, settlement } = region

    const [node, nodeSelected] = React.useState(null);

    const handleClick = (node) => () => {

        nodeSelected(prev => {
            if (prev === node) return null
            return node
        })

    };

    // console.log({ name, nodes, settlement })
    return (
        <Grid container sx={{ padding: 0 }}>
            <Grid sx={{ margin: 1 }} item xs={12}>Name: {`${name}`}</Grid>
            {settlement && <Grid sx={{ margin: 1 }} item xs={12}>Settlement: {`${settlement}`}</Grid>}
            <Grid sx={{ margin: 1 }} item xs={12}>Nodes:</Grid>
            <Grid sx={{ margin: 1 }} item xs={12} container>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: 1,
                }}>
                    {nodes.map(nodeName => {
                        return (
                            <Button key={nodeName} onClick={handleClick(nodeName)} color={nodeName === node ? 'secondary' : 'primary'} variant="contained">{nodeName}</Button>
                        )
                    })}
                </Box>

            </Grid>
            <Grid sx={{ margin: 1 }} item xs={12}>
                <Button disabled={node === null ? true : false} variant="contained" sx={{ width: 1 }} >Go on Expedition!</Button>
            </Grid>


        </Grid >
    )
}
const Random1 = () => <div>Random1</div>
const Random2 = () => <div>Random2</div>




const Region = () => {

    const { regionRepository, selectedRegion } = useGame()
    // console.log(regionRepository)

    const region = regionRepository[selectedRegion]
    // console.log(region)

    const content = [
        { label: selectedRegion ? `Region #${selectedRegion}` : `Select Region`, Component: RegionOverview, props: { region } },
        { label: 'Random1', Component: Random1 },
        { label: 'Random2', Component: Random2 },
    ]
    if (!region) return <div />

    return (
        <div>
            <TabsWrapper content={content} />

        </div>
    )
}

export default Region 