import { Box, Button, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useGame } from '../contexts/GameContext';
import { expeditionStart, voyageStart } from '../functions/socketCalls';
import { capitalizeFirstLetter } from '../functions/utils';
import ExpeditionSites from '../tabs/ExpeditionSites'

const resourceNodeTooltipSelector = resourceNodeType => {
    console.log(resourceNodeType)
    switch (resourceNodeType) {
        case 0:

            break;

        default:
            break;
    }
    return "null"
}

const MapPopover = ({ onClick }) => {
    const [resourceNodeSelected, setResourceNodeSelected] = useState(0);

    const {
        controlledParty, currentExpedition, selectedResourceNodes = [],
        selectedRegionId, resourceNodeRepository, settlementRepository,
        selectedRegionTravelPath = {}, currentVoyage, selectedSettlement = {},
    } = useGame()

    if (selectedRegionId === null || selectedResourceNodes.length === 0 || Object.values(resourceNodeRepository).length === 0) return <div />

    const { cost = 0 } = selectedRegionTravelPath

    const travelling = currentExpedition && currentExpedition.currentPhase !== 'finished';
    const selectHandleChange = event => setResourceNodeSelected(event.target.value)

    const { name: settlementName } = selectedSettlement;

    const traveling = currentVoyage && currentVoyage.finished === false;
    const isInSettlement = selectedSettlement.id === controlledParty.settlement

    // console.log(selectedResourceNodes)


    return <Box sx={{ minHeight: "100px", maxWidth: "250px", p: 1 }}>
        <Typography sx={{ m: 1 }} variant="h6" >
            {`Distance: ${cost} seconds`}
        </Typography>
        <FormControl sx={{ m: 1, minWidth: "220px" }} size="medium" >
            <InputLabel id="expeditionSiteSelect">Expedition Site</InputLabel>
            <Select
                labelId='expeditionSiteSelect'
                label="Expedition Site"
                value={resourceNodeSelected}
                onChange={selectHandleChange}
            >
                {selectedResourceNodes.map((resourceNode, index) => {
                    return (
                        <MenuItem value={index} key={resourceNode.id}>
                            <Tooltip key={resourceNode.id} title={Object.entries(resourceNode.resources).filter(([key, value]) => value > 0).map(([key]) => capitalizeFirstLetter(key)).join(", ")}>
                                <Typography>
                                    {resourceNode.name}
                                </Typography>
                            </Tooltip>
                        </MenuItem>
                    )
                })}

            </Select>
        </FormControl>
        <Button
            onClick={() => {
                {
                    expeditionStart(controlledParty.id, selectedResourceNodes[resourceNodeSelected].id)
                    onClick()
                }
            }}
            disabled={(currentExpedition && currentExpedition.currentPhase !== 'finished')}
            variant="contained"
            fullWidth
            sx={{ p: 1, my: 0.5 }}>

            {travelling
                ? `Currently on expedition to ${resourceNodeRepository[currentExpedition.target].name}`
                : `Go on Expedition.`}
        </Button>
        {
            settlementName
            && <>
                <Divider sx={{ pt: 0.5 }} />
                <Button
                    sx={{ p: 1, mt: 0.5 }} disabled={traveling || isInSettlement}
                    onClick={() => {
                        voyageStart(controlledParty.id, selectedSettlement.id)
                        onClick()
                    }}
                    variant="contained"
                    fullWidth
                >
                    {isInSettlement
                        ? `You're already in ${settlementName}!`
                        : traveling
                            ? `Travelling to ${settlementRepository[currentVoyage.target].name}`
                            : `Travel to ${settlementName}.`}
                </Button>
            </>
        }

    </Box >
}

export default MapPopover