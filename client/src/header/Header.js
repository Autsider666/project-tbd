import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info'
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useGame } from '../contexts/GameContext';
import { Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { socket } from '../functions/SocketAPI';
import { useApp } from '../contexts/AppContext';

const pages = ['Test1', 'Test2', 'Test3'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {

  const { setWikiModal } = useApp()
  const { controlledParty, currentSettlement, setSelectedRegionId, resetRepositories } = useGame()
  const { resetAuth } = useAuth()

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const maxEnergy = 2000

  return (
    <AppBar position="static">
      <Container sx={{ marginLeft: 0 }} maxWidth="xl">
        <Toolbar disableGutters sx={{ position: 'relative' }} >
          {
            controlledParty && <Box sx={{ mx: 1, display: 'flex' }}>

              <Typography sx={{ mr: 1 }} >
                {'Party: '}
              </Typography>
              <Typography sx={{ color: controlledParty.dead ? 'red' : 'white' }}>
                {`  ${controlledParty.name} ${controlledParty.dead ? '(DEAD)' : ''}`}
              </Typography>
              <Tooltip title="Current Party Size / Max Party Size">
                <Typography sx={{ ml: 1, color: controlledParty.survivors.length > 10 ? 'red' : 'white' }}>
                  {`(${controlledParty.survivors.length} / 10)`}
                </Typography>
              </Tooltip>
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
          {
            currentSettlement
            && <>
              <Divider sx={{ backgroundColor: 'white', my: 2, ml: 1, width: 2 }} orientation="vertical" flexItem />
              <Tooltip title="Your current Settlement">
                <Box onClick={() => setSelectedRegionId(currentSettlement.region)} sx={{ mx: 1, cursor: 'pointer' }}>
                  <Typography>
                    {`Settlement: ${currentSettlement.name}`}
                  </Typography>
                </Box>
              </Tooltip>
            </>
          }
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} />

          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} /> */}
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
            && <Box onClick={() => {
              resetAuth()
              resetRepositories()
            }} sx={{ mx: 1, cursor: 'pointer' }}>
              <Typography>
                {`Restart Game`}
              </Typography>
            </Box>
          }


          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography> */}
          <Tooltip title="Wiki Modal">
            <IconButton onClick={() => setWikiModal(true)} size="large" >
              <InfoIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>


          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar >
  );
};
export default ResponsiveAppBar;