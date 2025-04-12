import { Typography } from "@mui/material";
import { Box } from "@mui/material";
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

    const white10 = '#B4B4B4';

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
            setFormattedTime(`${formattedTimePart}`)
        } else {
            setFormattedDate('');
            setFormattedTime('');
        }
    }, [selectedHistory]);

    return(
        <Box
            sx={{
                backgroundColor: '#1e1e1e',
                color: white10,
                borderRadius: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'row',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.4)',
                justifyContent: 'space-between',
            }}
        >
            <Typography
                sx={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 14,
                    color: white10,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '250px',
                    
                }}
            > Filename: {selectedHistory.fileName}
            </Typography>

            <Typography
                sx={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 14,
                    color: white10,
                }}
            > Language: {capitalizeFirstLetter(selectedHistory?.language)}
            </Typography>

            <Typography
                sx={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 14,
                    color: white10,
                }}
            > Date: {formattedDate}
            </Typography>

            <Typography
                sx={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 14,
                    color: white10,
                }}
            > Time: {formattedTime}
            </Typography>

        </Box>
    );
}

export default HistoryDetails;