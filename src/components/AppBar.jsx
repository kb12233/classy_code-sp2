import  { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
    selectedModelAtom, modelsAtom,
    modelsLoadingAtom, groupedModelsAtom,
    plantUmlCodeAtom, generatedCodeAtom,
    uploadedImageAtom,
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
import { useMediaQuery } from '@mui/material';
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from './LoadingOverlay';
import Sidebar from './SideBar';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; 
import LogoutIcon from '@mui/icons-material/Logout';

const MenuAppBar = forwardRef((props, ref) => {
    const sidebarRef = useRef(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
    const [models] = useAtom(modelsAtom);
    const [loading] = useAtom(modelsLoadingAtom);
    const [groupedModels] = useAtom(groupedModelsAtom);
    const [plantUMLCode] = useAtom(plantUmlCodeAtom);
    const [generatedCode] = useAtom(generatedCodeAtom);
    const [image] = useAtom(uploadedImageAtom);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const greencolor = '#B6D9D7';
    const white = '#ffffff';
    const white10 = '#B4B4B4';
    const darkbgColor = "#1E1E1E";


    const isMobile = useMediaQuery('(max-width: 600px)');

    const [activeIcon, setActiveIconState] = useState('upload'); 

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSignOut = async () => {
        setSignOutLoading(true);
        try {
          await logoutUser();
          props.onSignOut(); 
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

        if (open && sidebarRef.current) {
            sidebarRef.current.loadHistory(); 
        }

        // setDrawerOpen(open);
        setDrawerOpen((prev) => !prev);
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
        activeIcon: activeIcon, 
    }));

return (
    <Box sx={{ flexGrow: 1 }}>
        {signOutLoading && <LoadingOverlay message="Signing out..." />}
        <AppBar position="fixed" sx={{ backgroundColor: '#1E1E1E', maxHeight: '10vh', width: '100vw' }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: isMobile ? 1 : 3 }}>
                {/* Left Side: Menu Icon + Model Select */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>

                    {/* Conditionally render Model Select and Restart Icon */}
                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 220, marginRight: 1 }} size="small">
                                {loading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LoadingOverlay message="Loading models..." />
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
                                                    color: white10,
                                                    maxHeight: 300
                                                }
                                            }
                                        }}
                                        sx={{
                                            '.MuiOutlinedInput-notchedOutline': { borderColor: darkbgColor },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: white10 },
                                            '.MuiSvgIcon-root': { color: white10, fontSize: 20 },
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

                            {/* Restart Icon */}
                            <IconButton
                                color="inherit"
                                onClick={props.onRestart}
                                aria-label="reset model selection"
                                title="Restart"
                                disabled={!image}
                                sx={{
                                    color: !image ? white : 'inherit', 
                                }}
                            >
                                <RestartAltIcon sx={{ color: 'inherit' }} /> 
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Right Side: Section Icons + Account Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => handleIconClick('upload-image-section')}
                        sx={{ color: activeIcon === 'upload' ? white : '#616161' }}
                    >
                        <AddPhotoAlternate />
                    </IconButton>
                    {(plantUMLCode || activeIcon === 'uml') && (
                        <IconButton
                            color="inherit"
                            onClick={() => handleIconClick('uml-preview-section')}
                            sx={{ color: activeIcon === 'uml' ? white : '#616161' }}
                        >
                            <BorderColorOutlinedIcon />
                        </IconButton>
                    )}
                    {(generatedCode || activeIcon === 'code') && (
                        <IconButton
                            color="inherit"
                            onClick={() => handleIconClick('code-generated-section')}
                            sx={{ color: activeIcon === 'code' ? white : '#616161' }}
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
                        
                        <MenuItem onClick={handleSignOut} sx={{ fontFamily: 'JetBrains Mono', color: white }}>
                            <LogoutIcon sx={{size: 40, mr: 1,}}/> Sign Out
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
        {/* Sidebar Component */}
        <Sidebar ref={sidebarRef} isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </Box>
);
});

MenuAppBar.displayName = 'MenuAppBar'; 
export default MenuAppBar;