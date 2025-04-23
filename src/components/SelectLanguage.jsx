import { FormControl, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { selectedLanguageAtom } from "../atoms";

export default function SelectLanguage() {
    const [language, setLanguage] = useAtom(selectedLanguageAtom);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Adjust breakpoint as needed
    const greencolor = "#B6D9D7";
    const grayish = "#1E1E1E";
    const blackish = "#121212";
    const grayOutline = "#454545"

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <FormControl
            sx={{
                height: "auto",
                minHeight: "auto",
                width: isSmallScreen ? '100%' : "auto", // Modified width
                marginRight: "2%",
                color: blackish,
                fontFamily: "JetBrains Mono",
                minWidth: isSmallScreen ? 'auto' : 250, // Modified minWidth
                borderRadius: "1vh",
            }}
        >
            <Select
                value={language}
                onChange={handleChange}
                displayEmpty
                renderValue={language !== "" ? undefined : () => "Select Language"}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: blackish,
                            color: "white",
                        },
                    },
                }}
                sx={{
                    bgcolor: grayish,
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: grayOutline },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: greencolor },
                    ".MuiSvgIcon-root": { color: "white" },
                    fontFamily: "JetBrains Mono",
                }}
            >
                <MenuItem value="python" sx={{ fontFamily: "JetBrains Mono", borderRadius: "inherit", }}>
                    Python
                </MenuItem>
                <MenuItem value="java" sx={{ fontFamily: "JetBrains Mono" }}>
                    Java
                </MenuItem>
                <MenuItem value="csharp" sx={{ fontFamily: "JetBrains Mono" }}>
                    C#
                </MenuItem>
                <MenuItem value="ruby" sx={{ fontFamily: "JetBrains Mono" }}>
                    Ruby
                </MenuItem>
                <MenuItem value="kotlin" sx={{ fontFamily: "JetBrains Mono" }}>
                    Kotlin
                </MenuItem>
                <MenuItem value="typescript" sx={{ fontFamily: "JetBrains Mono" }}>
                    Typescript
                </MenuItem>
            </Select>
        </FormControl>
    );
}