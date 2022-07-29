import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useGame } from '../../contexts/GameContext'

import { Box, Button, Grid, Typography } from '@mui/material';
import { expeditionStart, voyageStart } from '../../functions/socketCalls';


const ExpeditionSites = ({ region, party, expedition, resourceNodeRepository }) => {
    const { name, settlement } = region
    const nodes = Object.values(resourceNodeRepository).filter(node => region.nodes.find(regionNode => regionNode === node.id))

    const [nodeButton, nodeButtonSelected] = React.useState(null);

    const handleClick = (node) => () => {

        nodeButtonSelected(prev => {
            if (prev === node) return null
            return node
        })

    };

    // console.log({ name, nodes, settlement })
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container sx={{ padding: 0 }}>
                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Typography textAlign={"center"} variant="h5" >Region of {`${name}`}</Typography>
                    
                </Grid>
                <Grid sx={{ margin: 1, justifyContent: 'center' }} item xs={12} >
                    <Typography textAlign={"center"} variant="h5" >Resource Sites:</Typography>
                </Grid>

                {nodes.map(node => {
                    return (
                        <Grid key={node.id} item container xs={6}>
                            <Button sx={{ margin: 1, flexGrow: 1 }} key={node.id} onClick={handleClick(node.id)} color={node.id === nodeButton ? 'secondary' : 'primary'} variant="contained">{node.name}</Button>
                        </Grid>
                    )
                })}

                <Grid sx={{ margin: 1 }} item xs={12}>
                    <Button onClick={
                        () => expeditionStart(party.id, nodeButton)
                    } disabled={(nodeButton === null ? true : false) || (expedition && expedition.phase !== 'finished')} variant="contained" sx={{ width: 1 }} >
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
    // console.log(voyage)
    const traveling = voyage && voyage.finished === false
    voyage && console.log(voyage.finished)
    // console.log(traveling)


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
const Party = () => <div>Party</div>




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

    const voyage = Object.values(voyageRepository).find(voyage => voyage.party === party.id && voyage.finished === false)
    const expedition = Object.values(expeditionRepository).find(expedition => expedition.party === party.id && expedition.phase !== "finished")
    // console.log({ party, voyageRepository })
    // console.log(region)

    const content = [
        { label: 'Expedition Sites', Component: ExpeditionSites, props: { region, party, expedition, resourceNodeRepository } },
        { label: 'Settlement', Component: Settlement, props: { settlement, party, voyage, settlementRepository }, disable: region.settlement ? false : true },
        // { label: 'Party', Component: Party },
    ]
    if (!region) return <div />

    return (
        <div>
            <TabsWrapper key={region.id} content={content} />

        </div>
    )
}

export default Region 