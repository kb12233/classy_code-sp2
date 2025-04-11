//SelectLanguage.jsx
import { FormControl, MenuItem, Select } from "@mui/material";
import { useAtom } from "jotai";
import { selectedLanguageAtom } from "../atoms";

export default function SelectLanguage() {
  const [language, setLanguage] = useAtom(selectedLanguageAtom);
  const greencolor = "#B6D9D7";
  const grayish = "#1E1E1E";
  const blackish = "#121212";

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <FormControl
      sx={{
        // display: "flex", // No need for flex here, let the parent handle layout
        // justifyContent: "center",
        // alignItems: "flex-start",
        height: "auto", // Adjust height as needed
        minHeight: "auto", // Adjust minHeight as needed
        width: "auto", // Allow width to adjust to content
        marginRight: "2%",
        color: blackish,
        fontFamily: "JetBrains Mono",
        minWidth: 250,
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
          ".MuiOutlinedInput-notchedOutline": { borderColor: greencolor },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: greencolor },
          ".MuiSvgIcon-root": { color: "white" },
          fontFamily: "JetBrains Mono",
        }}
      >
        <MenuItem value="python" sx={{ fontFamily: "JetBrains Mono", borderRadius: "inherit",}}>
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