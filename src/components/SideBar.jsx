import { useAtom } from 'jotai';
import {
    historyDataAtom, historyLoadingAtom,
    selectedHistoryAtom, selectedLanguageAtom,
    uploadedImageAtom, plantUmlCodeAtom,
    generatedCodeAtom,
} from '../atoms';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { fetchHistory, deleteHistoryItem } from '../appwrite/HistoryService';
import { account } from '../appwrite/config';
import { SlOptionsVertical } from "react-icons/sl";
import DeleteIcon from '@mui/icons-material/Delete';

const Sidebar = forwardRef(function Sidebar({ isDrawerOpen, toggleDrawer }, ref) {

    const greencolor = '#B6D9D7';
    const [historyData, setHistoryData] = useAtom(historyDataAtom);
    const [historyLoading, setHistoryLoading] = useAtom(historyLoadingAtom);
    const [, setSelectedHistory] = useAtom(selectedHistoryAtom);
    const [, setUploadedImage] = useAtom(uploadedImageAtom);
    const [, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
    const [, setGeneratedCode] = useAtom(generatedCodeAtom);
    const [, setLanguage] = useAtom(selectedLanguageAtom);
    const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const isOptionsOpen = Boolean(optionsAnchorEl);

    // useEffect(() => {
    //     const loadHistory = async () => {
    //         setHistoryLoading(true);
    //         try {
    //             const user = await account.get();
    //             const fetchedHistory = await fetchHistory(user.$id);
    //             setHistoryData(fetchedHistory);
    //         } catch (error) {
    //             console.error("Error loading history:", error);
    //             setHistoryData([]);
    //         } finally {
    //             setHistoryLoading(false);
    //         }
    //     };

    //     loadHistory();
    // }, []);

    const loadHistory = async () => {
        setHistoryLoading(true);
        try {
            const user = await account.get();
            const fetchedHistory = await fetchHistory(user.$id);
            setHistoryData(fetchedHistory);
        } catch (error) {
            console.error("Error loading history:", error);
            setHistoryData([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        loadHistory,
    }));

    useEffect(() => {
        loadHistory(); // Optional: load once on mount
    }, []);

    const handleHistoryItemClick = (item) => {
        setSelectedHistory(item);
        setUploadedImage(item.photoURL);
        setPlantUMLCode(item.umlCode);
        setGeneratedCode(item.generatedCode);
        setLanguage(item.language);
        toggleDrawer(false)();
    };

    const handleMoreOptionsClick = (event, itemId) => {
        event.stopPropagation(); // Prevent the history item click from firing
        setSelectedItemId(itemId);
        setOptionsAnchorEl(event.currentTarget);
    };

    const handleOptionsClose = () => {
        setOptionsAnchorEl(null);
        setSelectedItemId(null);
    };

    const handleDeleteClick = async () => {
        handleOptionsClose();
        if (selectedItemId) {
            setHistoryLoading(true);
            try {
                await deleteHistoryItem(selectedItemId);
                // Refresh history after deletion
                const user = await account.get();
                const fetchedHistory = await fetchHistory(user.$id);
                setHistoryData(fetchedHistory);
            } catch (error) {
                console.error("Error deleting history item:", error);
                // Optionally show an error message to the user
            } finally {
                setHistoryLoading(false);
            }
        }
    };

    return (
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
                '& .MuiDrawer-paper': { width: 300, bgcolor: '#121212', color: 'white', fontFamily: 'JetBrains Mono' },
                '.css-rizt0-MuiTypography-root': { fontFamily: 'JetBrains Mono' },
            }}
        >
            {/* History Section */}
            <List>
                <ListItem>
                    <ListItemText
                        primary="History"
                        sx={{ color: 'white', fontWeight: 'bold' }}
                    />
                </ListItem>
            </List>
            <Divider sx={{ bgcolor: greencolor }} />

            {historyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                    <CircularProgress size={24} sx={{ color: greencolor }} />
                </Box>
            ) : (
                <List>
                    {historyData.map((item) => (
                        <ListItem
                            key={item.$id}
                            onClick={() => handleHistoryItemClick(item)}
                            sx={{
                                transition: 'background-color 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                },
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <ListItemText
                                primary={item.fileName}
                                sx={{
                                    color: greencolor,
                                    flexGrow: 1 ,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            />

                            <IconButton onClick={(e) => handleMoreOptionsClick(e, item.$id)}>
                                <SlOptionsVertical color='#B6D9D7' size={15} />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}

            <Menu
                id="history-options-menu"
                anchorEl={optionsAnchorEl}
                open={isOptionsOpen}
                onClose={handleOptionsClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                MenuListProps={{
                    'aria-labelledby': 'history-options-button',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        bgcolor: '#303134',
                        color: greencolor,
                        fontFamily: 'JetBrains Mono'
                    },
                    '& .MuiMenuItem-root': {
                        fontFamily: 'JetBrains Mono'
                    }
                }}
            >
                <MenuItem onClick={handleDeleteClick}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Drawer>
    );
});

export default Sidebar;