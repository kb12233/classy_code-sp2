//HomePage.jsx
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
  const [isUmlPreviewRendered, setIsUmlPreviewRendered] = React.useState(false);
  const [isCodeGeneratedRendered, setIsCodeGeneratedRendered] = React.useState(false);
  const [isScrollable, setIsScrollable] = React.useState(false);

  // Render UML Preview section when plantUMLCode is available
  React.useEffect(() => {
    if (plantUMLCode) {
      setIsUmlPreviewRendered(true);
      // Scroll to UML Preview after it's rendered
      setTimeout(() => {
        if (umlSectionRef.current) {
          umlSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          setIsScrollable(true); // Enable scrolling after reaching the second section
        }
      }, 50); 
    } else {
      setIsUmlPreviewRendered(false);
      setIsScrollable(false); 
    }
  }, [plantUMLCode]);

  // Render Code Generated section when generatedCode is available
  React.useEffect(() => {
    if (generatedCode) {
      setIsCodeGeneratedRendered(true);
      // Scroll to Code Generated section after it's rendered
      setTimeout(() => {
        if (codeSectionRef.current) {
          codeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50); // Small delay to ensure rendering
    } else {
      setIsCodeGeneratedRendered(false);
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
          overflowY: isScrollable ? "auto" : "hidden", 
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
        {isUmlPreviewRendered && (
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
        )}

        {/* Section 3: Code Generated Section */}
        {isCodeGeneratedRendered && (
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
        )}
      </Box>
    </React.Fragment>
  );
}