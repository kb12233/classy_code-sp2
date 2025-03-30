import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useAtom } from 'jotai';
import { plantUmlCodeAtom, generatedCodeAtom } from '../atoms';
import UploadImageSection from "./UploadImageSection";
import UMLPreview from "./UmlPreview";
import CodeGeneratedSection from "./CodeGeneratedSection";
import { Typography } from "@mui/material";
import MenuAppBar from "./AppBar";

export default function Homepage() {
  const [plantUMLCode] = useAtom(plantUmlCodeAtom);
  const [generatedCode] = useAtom(generatedCodeAtom);
  const umlSectionRef = React.useRef(null);
  const codeSectionRef = React.useRef(null);

  // Scroll to UML Preview when plantUMLCode is available
  React.useEffect(() => {
    if (plantUMLCode && umlSectionRef.current) {
      umlSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [plantUMLCode]);

  // Scroll to CodeGeneratedSection when generatedCode is available
    React.useEffect(() => {
    if (generatedCode && codeSectionRef.current) {
      codeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedCode]);

  return (
    <React.Fragment>
      <CssBaseline />
      <MenuAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          scrollSnapType: "y proximity",
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#121212', // Dark background
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#333', // Black scrollbar
            borderRadius: '5px',
          }
        }}
      >

        {/* Section 1: Upload Image */}
        <Box
          sx={{
            height: "calc(100vh - 64px)",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#121212",
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: "85%" }}>
            <Typography
              sx={{
                color: "white",
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                marginBottom: "1rem",
              }}
            >
              Class Diagram
            </Typography>
            <UploadImageSection />
          </Box>
        </Box>

        {/* Section 2: UML Preview */}
        <Box
          ref={umlSectionRef}
          sx={{
            height: "calc(100vh - 64px)",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#121212",
            flexShrink: 0,
          }}
        >
          <UMLPreview />
        </Box>

        {/* Section 3: Code Generated Section */}
        <Box
          ref={codeSectionRef}
          sx={{
            height: "calc(100vh - 64px)",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#121212",
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: "85%" }}>
            <Typography
              sx={{
                color: "white",
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                marginBottom: "1rem",
              }}
            >
              Generated Code
            </Typography>
            <CodeGeneratedSection />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}