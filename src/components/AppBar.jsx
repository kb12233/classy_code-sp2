import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAtom } from 'jotai';
import { 
  selectedModelAtom, 
  modelsAtom, 
  modelsLoadingAtom, 
  groupedModelsAtom 
} from '../atoms';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import { useMediaQuery, Typography, CircularProgress } from '@mui/material';
import Sidebar from './sidebar';
import logoDark from '../assets/images/logo_dark.png';

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  const [models] = useAtom(modelsAtom);
  const [loading] = useAtom(modelsLoadingAtom);
  const [groupedModels] = useAtom(groupedModelsAtom);
  const navigate = useNavigate(); 

  const greencolor = '#B6D9D7';
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    setAnchorEl(null);
    navigate('/login'); 
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#121212', maxHeight: '10vh', width: '100vw' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: isMobile ? 1 : 3 }}>
          {/* Left Side: Menu Icon + Model Select */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            {!isMobile && (
              <FormControl sx={{ minWidth: 220 }} size="small">
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ color: greencolor, marginRight: 1 }} />
                    <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono' }}>
                      Loading models...
                    </Typography>
                  </Box>
                ) : (
                  <Select
                    value={selectedModel || ''}
                    onChange={handleModelChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) return "Select Model";
                      const model = models.find(m => m.id === selected);
                      return model ? model.name : selected;
                    }}
                    MenuProps={{ 
                      PaperProps: { 
                        sx: { 
                          bgcolor: '#121212', 
                          color: greencolor,
                          maxHeight: 300
                        } 
                      } 
                    }}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#303134' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: greencolor },
                      '.MuiSvgIcon-root': { color: greencolor, fontSize: 20 },
                      color: 'white',
                      fontFamily: 'JetBrains Mono',
                      fontSize: 16,
                    }}
                  >
                    {Object.entries(groupedModels).length > 0 ? (
                      Object.entries(groupedModels).map(([provider, providerModels]) => [
                        <MenuItem 
                          key={provider} 
                          disabled 
                          sx={{ 
                            fontFamily: 'JetBrains Mono',
                            opacity: 0.7,
                            fontSize: '0.9rem',
                            pointerEvents: 'none'
                          }}
                        >
                          {provider}
                        </MenuItem>,
                        ...providerModels.map(model => (
                          <MenuItem 
                            key={model.id} 
                            value={model.id} 
                            sx={{ 
                              fontFamily: 'JetBrains Mono',
                              paddingLeft: 3
                            }}
                          >
                            {model.name}
                          </MenuItem>
                        ))
                      ]).flat()
                    ) : (
                      <MenuItem disabled>No models available</MenuItem>
                    )}
                  </Select>
                )}
              </FormControl>
            )}
          </Box>

          {/* Centered Logo */}
          {!isMobile && (
            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <img src={logoDark} alt="Logo" style={{ height: 50 }} />
            </Box>
          )}

          {/* Right Side: User Icon */}
          <IconButton size="large" color="inherit" onClick={handleMenu}>
            <AccountCircle fontSize='large' />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ '.MuiPaper-root': { bgcolor: '#303134', color: greencolor } }}
          >
            <MenuItem onClick={handleSignOut} sx={{ fontFamily: 'JetBrains Mono' }}>
              Sign-out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </Box>
  );
}