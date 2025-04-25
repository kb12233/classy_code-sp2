import { Typography, Box, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useAtom } from "jotai";
import { selectedHistoryAtom } from "../atoms";
import { useEffect, useState } from "react";

const capitalizeFirstLetter = (str) => {
    if (!str) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const HistoryDetails = () => {
    const [selectedHistory] = useAtom(selectedHistoryAtom);
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedTime, setFormattedTime] = useState('');
    const [open, setOpen] = useState(false);

    const white10 = '#B4B4B4';

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (selectedHistory?.$createdAt) {
            const date = new Date(selectedHistory.$createdAt);

            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            const timeOptions = {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            };

            const formattedDatePart = date.toLocaleDateString(undefined, dateOptions);
            const formattedTimePart = date.toLocaleTimeString(undefined, timeOptions);

            setFormattedDate(`${formattedDatePart}`);
            setFormattedTime(`${formattedTimePart}`);
        } else {
            setFormattedDate('');
            setFormattedTime('');
        }
    }, [selectedHistory]);

    const typographyStyle = {
        fontFamily: 'JetBrains Mono',
        fontSize: 14,
        color: white10,
        mb: 1,
    };

    return (
        <>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    backgroundColor: '#1e1e1e',
                    color: white10,
                    borderRadius: 2,
                    padding: 2,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2,
                    boxShadow: '0px 2px 6px rgba(0,0,0,0.4)',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                }}
            >
                <Typography sx={typographyStyle}>Filename: {selectedHistory?.fileName}</Typography>
                <Typography sx={typographyStyle}>Language: {capitalizeFirstLetter(selectedHistory?.language)}</Typography>
                <Typography sx={typographyStyle}>Date: {formattedDate}</Typography>
                <Typography sx={typographyStyle}>Time: {formattedTime}</Typography>
            </Box>

            {/* View Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        color: white10,
                        borderColor: white10,
                        fontFamily: 'JetBrains Mono',
                        textTransform: 'none'
                    }}
                >
                    View History Details
                </Button>
            </Box>

            {/* Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontFamily: 'JetBrains Mono', bgcolor: '#1E1E1E', color: white10 }}>History Details</DialogTitle>
                <DialogContent dividers sx={{ fontFamily: 'JetBrains Mono', bgcolor: '#1E1E1E', color: white10 }}>
                    <Typography sx={typographyStyle}>Filename: {selectedHistory?.fileName}</Typography>
                    <Typography sx={typographyStyle}>Language: {capitalizeFirstLetter(selectedHistory?.language)}</Typography>
                    <Typography sx={typographyStyle}>Date: {formattedDate}</Typography>
                    <Typography sx={typographyStyle}>Time: {formattedTime}</Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HistoryDetails;