import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

import { Box, Button, Grid, Typography } from '@mui/material';
import { expeditionStart, voyageStart } from '../../functions/socketCalls';


const RegionOverview = ({ region, party, expedition, resourceNodeRepository }) => {
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
                    <Button onClick={
                        () => expeditionStart(party.id, node)
                    } disabled={(node === null ? true : false) || (expedition && expedition.phase !== 'finished')} variant="contained" sx={{ width: 1 }} >
                        {expedition && expedition.phase !== 'finished'
                            ? `Currently on expedition to ${resourceNodeRepository[expedition.target].name}`
                            : `Go on Expedition!`
                        }
                    </Button>
                </Grid>
            </Grid >
        </Box>
    )
}
const Settlement = ({ settlement, party, voyage, settlementRepository }) => {
    const { name } = settlement
    console.log(voyage)
    const traveling = voyage && voyage.handled === false
    voyage && console.log(voyage.handled)
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
                        () => voyageStart(party.id, settlement.id)
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
                    <Typography> You are here! </Typography>
                </Grid>
            }

        </Grid >
    )
}
const Random2 = () => <div>Random2</div>




const Region = () => {
    const { regionRepository, selectedRegion, settlementRepository, partyRepository, voyageRepository, expeditionRepository, resourceNodeRepository } = useGame()
    if (selectedRegion === null) return <div />
    // console.log(regionRepository)
    // console.log(selectedRegion)

    const region = regionRepository[selectedRegion]
    // console.log(region)
    // console.log(settlementRepository)
    const settlement = settlementRepository[region.settlement]
    const party = Object.values(partyRepository).find(party => party.controllable === true)
    console.log(party)
    const voyage = Object.values(voyageRepository).find(voyage => voyage.party === party.id && voyage.handled === false)
    const expedition = Object.values(expeditionRepository).find(expedition => expedition.party === party.id && expedition.phase !== "finished")
    // console.log(region)

    const content = [
        { label: 'Region', Component: RegionOverview, props: { region, party, expedition, resourceNodeRepository } },
        { label: 'Settlement', Component: Settlement, props: { settlement, party, voyage, settlementRepository }, disable: region.settlement ? false : true },
        { label: 'Random2', Component: Random2 },
    ]
    if (!region) return <div />

    return (
        <div>
            <TabsWrapper key={region.id} content={content} />

        </div>
    )
}

export default Region 