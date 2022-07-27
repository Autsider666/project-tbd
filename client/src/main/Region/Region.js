import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

import { Box, Button, Grid } from '@mui/material';
import { travelToSettlement } from '../../functions/socketCalls';


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
        <Box sx={{ flexGrow: 1 }}>
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
        </Box>
    )
}
const Settlement = ({ settlement, party, voyage, settlementRepository }) => {
    const { name } = settlement
    console.log(voyage)
    const traveling = voyage && voyage.handled === false
    console.log(traveling)


        return (
        <Grid container sx={{ padding: 0 }}>
            <Grid sx={{ margin: 1 }} item xs={12}>
                <div>Name of Settlement: {name}</div>
            </Grid>
            {
                settlement.id !== party.settlement &&
                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button disabled={traveling} onClick={
                        () => travelToSettlement(party.id, settlement.id)
                    } variant="contained" >
                    {traveling
                        ? `Travelling to ${settlementRepository[voyage.target].name}`
                        : `Travel to ${name}`}
                    </Button>
                </Grid>
            }
            {
                settlement.id === party.settlement &&
                <Grid sx={{ margin: 1 }} item xs={12}>
                    You are here!
                </Grid>
            }

        </Grid >
    )
}
const Random2 = () => <div>Random2</div>




const Region = () => {
    const { regionRepository, selectedRegion, settlementRepository, partyRepository, voyageRepository } = useGame()
    if (selectedRegion === null) return <div />
    // console.log(regionRepository)
    // console.log(selectedRegion)

    const region = regionRepository[selectedRegion]
    // console.log(region)
    // console.log(settlementRepository)
    const settlement = settlementRepository[region.settlement]
    const party = Object.values(partyRepository).find(party => party.controllable === true)
    console.log(party)
    const voyage = Object.values(voyageRepository).find(voyage => voyage.party === party.id)
    // console.log(region)

    const content = [
        { label: selectedRegion ? `Region #${selectedRegion}` : `Select Region`, Component: RegionOverview, props: { region } },
        { label: 'Settlement', Component: Settlement, props: { settlement, party, voyage, settlementRepository }, hide: region.settlement ? false : true },
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