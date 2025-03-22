import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useAtom } from 'jotai';
import { plantUmlCodeAtom } from '../atoms';
import UploadImageSection from "./UploadImageSection";
import CodeGeneratedSection from "./CodeGeneratedSection";
import GenerateCode from "./GenerateButton";
import { Typography } from "@mui/material";
import MenuAppBar from "./AppBar";
import SelectLanguage from "./SelectLanguage";
import UMLPopup from "./UmlPreview";

export default function Homepage() {
  // We only need plantUMLCode for the visibility of UMLPopup
  const [plantUMLCode] = useAtom(plantUmlCodeAtom);

  return (
    <React.Fragment>
      <CssBaseline />
      <MenuAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "calc(100vh - 64px)",
          gap: 4,
          paddingTop: "1%",
          width: "100vw",
          overflow: "hidden",
          backgroundColor: "#121212",
        }}
      >
        {/* Left Section: Upload Image + Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: 2,
            height: "100%",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "white",
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                marginLeft: "3%",
              }}
            >
              Class Diagram
            </Typography>
          </Box>

          <UploadImageSection />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <GenerateCode />
            <SelectLanguage />
            {plantUMLCode && <UMLPopup />}
          </Box>
        </Box>

        {/* Right Section: Code Output */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            gap: 2,
            height: "99%",
            paddingRight: "1%",
            paddingBottom: "0.8%",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "white",
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                marginLeft: "0.3%",
              }}
            >
              Code Generation
            </Typography>
          </Box>

          <CodeGeneratedSection />
        </Box>
      </Box>
    </React.Fragment>
  );
}