// AppBar.jsx
import  { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
    selectedModelAtom,
    modelsAtom,
    modelsLoadingAtom,
    groupedModelsAtom,
    plantUmlCodeAtom,
    generatedCodeAtom,
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
import logoDark from '../assets/images/logo_dark.png';
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from './LoadingOverlay';
import Sidebar from './sidebar';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // Add this import


const MenuAppBar = forwardRef((props, ref) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
    const [models] = useAtom(modelsAtom);
    const [loading] = useAtom(modelsLoadingAtom);
    const [groupedModels] = useAtom(groupedModelsAtom);
    const [plantUMLCode] = useAtom(plantUmlCodeAtom);
    const [generatedCode] = useAtom(generatedCodeAtom);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    const greencolor = '#B6D9D7';
    const greencolorLight = '#00ffe4'; //changing color of icons
    const isMobile = useMediaQuery('(max-width: 600px)');

    const [activeIcon, setActiveIconState] = useState('upload'); // Initialize with the first icon

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSignOut = async () => {
        setSignOutLoading(true);
        try {
          await logoutUser();
          navigate('/login');
        } catch(error) {
          console.error("Logout failed:", error.message);
        }
        setSignOutLoading(false);
      };    

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
        setDrawerOpen(open);
    };

    const handleIconClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveIconState(getIconIdFromSectionId(sectionId));
        } else {
            console.warn(`Section with ID '${sectionId}' not found.`);
        }
    };

    const setActiveIcon = (iconId) => {
        setActiveIconState(iconId);
    };

    const getIconIdFromSectionId = (sectionId) => {
        switch (sectionId) {
            case 'upload-image-section':
                return 'upload';
            case 'uml-preview-section':
                return 'uml';
            case 'code-generated-section':
                return 'code';
            default:
                return '';
        }
    };

    useImperativeHandle(ref, () => ({
        setActiveIcon: setActiveIcon,
        getIconIdFromSectionId: getIconIdFromSectionId,
        activeIcon: activeIcon, // Expose activeIcon
    }));

    return (
        <Box sx={{ flexGrow: 1 }}>
            {signOutLoading && <LoadingOverlay message="Signing out..." />}
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

                    {/* Restart Button */}
                    <IconButton
                        onClick={props.onRestart}
                        sx={{
                            color: '#FFFFFF',
                            marginLeft: 'auto', // pushes it to the far right
                        }}
                        title="Restart"
                        >
                        <RestartAltIcon />
                        </IconButton>
                        
                    {/* Centered Logo */}
                    {!isMobile && (
                        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                            <img src={logoDark} alt="Logo" style={{ height: 50 }} />
                        </Box>
                    )}

                    {/* Right Side: Icons and User Icon */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            onClick={() => handleIconClick('upload-image-section')}
                            sx={{ color: activeIcon === 'upload' ? greencolorLight : '#616161' }}
                        >
                            <AddPhotoAlternate />
                        </IconButton>
                        {(plantUMLCode || activeIcon === 'uml') && (
                            <IconButton
                                color="inherit"
                                onClick={() => handleIconClick('uml-preview-section')}
                                sx={{ color: activeIcon === 'uml' ? greencolorLight : '#616161' }}
                            >
                                <BorderColorOutlinedIcon />
                            </IconButton>
                        )}
                        {(generatedCode || activeIcon === 'code') && (
                            <IconButton
                                color="inherit"
                                onClick={() => handleIconClick('code-generated-section')}
                                sx={{ color: activeIcon === 'code' ? greencolorLight : '#616161' }}
                            >
                                <CodeOutlined />
                            </IconButton>
                        )}
                        <IconButton size="large" color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
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
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Sidebar Component */}
            <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </Box>
    );
});

export default MenuAppBar;