import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info'
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { useGame } from '../contexts/GameContext';
import { Badge, Divider, List, ListItem, ListItemText, Popover } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { socket } from '../functions/SocketAPI';
import { useApp } from '../contexts/AppContext';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { useState } from 'react';

const ResponsiveAppBar = () => {

  const { setWikiModal } = useApp()
  const { controlledParty, currentSettlement, setSelectedRegionId, resetRepositories, currentExpedition, settlementRepository, partyRepository } = useGame()
  const { resetAuth } = useAuth()
  const [popoverEl, setPopoverEl] = useState(null)

  const questIconClicker = event => {
    setPopoverEl(event.currentTarget)
  }

  const { hp: settlementHp = 100, damageTaken: settlementDamageTaken = 0 } = currentSettlement || {}
  const currentSettlementCurrentHealth = settlementHp - settlementDamageTaken
  const currentSettlementCurrentHealthPercent = settlementDamageTaken === 0 ? 100 : Math.round((settlementHp - settlementDamageTaken) / settlementHp * 100)

  const controlledPartyHp = controlledParty ? controlledParty.stats.hp : 1;
  const controlledPartyCurrentHealth = controlledParty && currentExpedition ? controlledPartyHp - currentExpedition.damageTaken : controlledPartyHp

  const controlledPartyCurrentHealthPercent = currentExpedition ? Math.round((controlledPartyHp - currentExpedition.damageTaken) / controlledPartyHp * 100) : 100


  currentExpedition && console.log(controlledPartyHp - currentExpedition.damageTaken)
  currentExpedition && console.log(controlledPartyHp)

  currentExpedition && console.log(Math.round((controlledPartyHp - currentExpedition.damageTaken) / controlledPartyHp * 100))

  const currentRaidedSettlements = settlementRepository ? Object.values(settlementRepository).filter(settlement => settlement.raid) : []

  // console.log({ controlledParty, currentSettlement, currentExpedition })
  const maxEnergy = 2000

  return (
    <AppBar position="static">
      <Container sx={{ marginLeft: 0 }} maxWidth={false}>
        <Toolbar disableGutters sx={{ position: 'relative' }} >
          {
            controlledParty && <Box sx={{ mx: 1, display: 'flex' }}>
              <Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ color: controlledParty.dead ? 'red' : 'white' }}>
                    {`Party:   ${controlledParty.name} ${controlledParty.dead ? '(DEAD)' : ''}`}
                  </Typography>
                  <Tooltip title="Current Party Size / Max Party Size">
                    <Typography sx={{ ml: 1, color: controlledParty.survivors.length > 10 ? 'red' : 'white' }}>
                      {`(${controlledParty.survivors.length} / 10)`}
                    </Typography>
                  </Tooltip>
                </Box>
                <Typography>
                  {`Health: ${controlledPartyCurrentHealth} / ${controlledPartyHp} (${controlledPartyCurrentHealthPercent}%)`}
                </Typography>

              </Box>


            </Box>
          }
          {
            controlledParty
            && <>
              <Divider sx={{ backgroundColor: 'white', my: 2, mr: 1, width: 2 }} orientation="vertical" flexItem />
              <Box>
                <Tooltip title="Used for upgrading Survivors">
                  <Typography sx={{ color: controlledParty.energy >= maxEnergy ? 'red' : 'white' }}>
                    {`Energy: ${controlledParty.energy} / ${maxEnergy}`}
                  </Typography>
                </Tooltip>
              </Box>
            </>
          }

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} />

          <Typography
            variant="h4"
            noWrap
            // component="a"
            // href="/"
            sx={{
              mr: 2,
              // display: { xs: 'flex', md: 'flex' },
              // position: 'absolute',
              // top: '50%',
              // width: '100%',
              textAlign: 'center',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => {
              socket.emit("test:energy:full", { partyId: controlledParty.id })
              socket.emit("test:resource:add", { containerId: currentSettlement.id, amount: 1000, resource: 'wood' })
              socket.emit("test:resource:add", { containerId: currentSettlement.id, amount: 1000, resource: 'iron' })
              socket.emit("test:resource:add", { containerId: currentSettlement.id, amount: 1000, resource: 'stone' })
            }}
          >
            Project TBD
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} />
          {
            controlledParty && controlledParty.dead
            &&
            <Tooltip title="You've Died! Click to restart and create a new party!">
              <Box onClick={() => {
                resetAuth()
                resetRepositories()
                window.location.reload();
              }} sx={{ mx: 1, cursor: 'pointer' }}>
                <Typography>
                  {`Restart Game`}
                </Typography>
              </Box>
            </Tooltip>
          }
          {
            currentSettlement
            && <>

              <Tooltip title="Your current Settlement">
                <Box onClick={() => setSelectedRegionId(currentSettlement.region)} sx={{ mx: 1, cursor: 'pointer' }}>
                  <Typography>
                    {`Settlement: ${currentSettlement.name}`}
                  </Typography>
                  <Typography>
                    {`Health: ${currentSettlementCurrentHealth} / ${settlementHp} (${currentSettlementCurrentHealthPercent}%)`}
                  </Typography>
                </Box>
              </Tooltip>
              <Divider sx={{ backgroundColor: 'white', my: 2, ml: 1, width: 2 }} orientation="vertical" flexItem />
            </>
          }
          <Tooltip title="On-going Quests">
            <IconButton onClick={questIconClicker} >
              <Badge badgeContent={currentRaidedSettlements.length} color="error">
                <CrisisAlertIcon sx={{ color: 'white' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Quick Start / Wiki">
            <IconButton onClick={() => setWikiModal(true)} size="large" >
              <InfoIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
      <Popover
        anchorEl={popoverEl}
        open={Boolean(popoverEl)}
        onClose={() => setPopoverEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          {currentRaidedSettlements.length > 0
            ? currentRaidedSettlements.map(settlement => {
              const survivorParties = settlement.parties.map(partyId => partyRepository[partyId])
              const partyCount = survivorParties.reduce((accum, party) => {
                if (party.currentVoyage === null && party.currentExpedition === null) {
                  accum += party.survivors.length
                }
                return accum
              }, 0)
              const survivorCount = partyCount + settlement.survivors.length
              return (
                <ListItem key={settlement.id} sx={{ m: 1 }}>
                  <ListItemText primary={settlement.name} secondary="Name" sx={{ width: '120px' }} />
                  <Divider sx={{ mx: 1, my: 1, width: 2 }} orientation="vertical" flexItem />
                  <ListItemText primary={`${settlement.hp - settlement.damageTaken} / ${settlement.hp}`} secondary="Settlement HP" />
                  <Divider sx={{ mx: 1, my: 1, width: 2 }} orientation="vertical" flexItem />
                  <ListItemText primary={survivorCount} secondary="Survivors" />
                  <Divider sx={{ mx: 1, my: 1, width: 2 }} orientation="vertical" flexItem />
                  <ListItemText primary={`${settlement.raid.hp - settlement.raid.damageTaken} / ${settlement.raid.hp}`} secondary="Enemy HP" />
                </ListItem>
              )
            })
            : <Typography sx={{ m: 2 }}>
              There are no quest at the moment.
            </Typography>
          }
        </List>
      </Popover>
    </AppBar >
  );
};
export default ResponsiveAppBar;