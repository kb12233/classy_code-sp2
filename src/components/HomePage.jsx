import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useAtom } from 'jotai';
import { plantUmlCodeAtom, generatedCodeAtom, 
    selectedHistoryAtom, uploadedImageAtom } from '../atoms';
import UploadImageSection from "./UploadImageSection";
import UMLPreview from "./UmlPreview";
import CodeGeneratedSection from "./CodeGeneratedSection";
import { Typography } from "@mui/material";
import MenuAppBar from "./AppBar";
import { useState, useEffect, useRef, Fragment } from "react";
import { account, PROJECT_ID } from "../appwrite/config"; 
import Upload from "./Upload";    

export default function Homepage() {
    const [plantUMLCode] = useAtom(plantUmlCodeAtom);
    const [generatedCode] = useAtom(generatedCodeAtom);
    const [selectedHistory] = useAtom(selectedHistoryAtom);
    const [, setUploadedImage] = useAtom(uploadedImageAtom);
    const [, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
    const [, setGeneratedCode] = useAtom(generatedCodeAtom);

    const umlSectionRef = useRef(null);
    const codeSectionRef = useRef(null);
    const [isUmlPreviewRendered, setIsUmlPreviewRendered] = useState(false);
    const [isCodeGeneratedRendered, setIsCodeGeneratedRendered] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const appBarRef = useRef(null);
    const darkbgColor = "#1E1E1E";

    const fetchTextContent = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    "X-Appwrite-Project": PROJECT_ID, 
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error("Error fetching text content:", error);
            return "";
        }
    };

    // useEffect(() => {
    //     const loadHistoryData = async () => {
    //         if (selectedHistory) {
    //             try {
    //                 await account.get();
    //                 setUploadedImage(selectedHistory.photoURL);
    //                 const umlContent = await fetchTextContent(selectedHistory.umlCodeURL);
    //                 const generatedContent = await fetchTextContent(selectedHistory.codeURL);
    //                 setPlantUMLCode(umlContent);
    //                 setGeneratedCode(generatedContent);
    
    //                 setIsUmlPreviewRendered(true);
    //                 setIsCodeGeneratedRendered(true);
    //                 setIsScrollable(true);
    //             } catch (error) {
    //                 console.error("Failed to load history data:", error);
    //             }
    //         }
    //     };
    
    //     loadHistoryData();
    // }, [selectedHistory, setUploadedImage, setPlantUMLCode, setGeneratedCode]);
    
    // // Separate useEffect for plantUMLCode
    // useEffect(() => {
    //     if (plantUMLCode) {
    //         setIsUmlPreviewRendered(true);
    //         setTimeout(() => {
    //             if (umlSectionRef.current) {
    //                 umlSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    //                 setIsScrollable(true);
    //                 if (appBarRef.current) {
    //                     appBarRef.current.setActiveIcon('uml');
    //                 }
    //             }
    //         }, 10);
    //     } else {
    //         setIsUmlPreviewRendered(false);
    //         if (!generatedCode) {
    //             setIsScrollable(false);
    //         }
    //     }
    // }, [plantUMLCode, generatedCode]);
    
    // // Separate useEffect for generatedCode
    // useEffect(() => {
    //     if (generatedCode) {
    //         setIsCodeGeneratedRendered(true);
    //         setIsScrollable(true);
    //         setTimeout(() => {
    //             if (codeSectionRef.current) {
    //                 codeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    //                 if (appBarRef.current) {
    //                     appBarRef.current.setActiveIcon('code');
    //                 }
    //             }
    //         }, 10);
    //     } else {
    //         setIsCodeGeneratedRendered(false);
    //         if (!plantUMLCode) {
    //             setIsScrollable(false);
    //         }
    //     }
    // }, [generatedCode, plantUMLCode]);

    useEffect(() => {
        const loadHistoryData = async () => {
            if (selectedHistory) {
                //setUploadedImage(selectedHistory.photoURL);
                try {
                    await account.get();

                    setUploadedImage(selectedHistory.photoURL);
                    const umlContent = await fetchTextContent(selectedHistory.umlCodeURL);
                    const generatedContent = await fetchTextContent(selectedHistory.codeURL);
                    setPlantUMLCode(umlContent);
                    setGeneratedCode(generatedContent);

                    setIsUmlPreviewRendered(true);
                    setIsCodeGeneratedRendered(true);
                    setIsScrollable(true);

                    if (appBarRef.current && plantUMLCode && generatedCode) {
                        appBarRef.current.setActiveIcon('uml');
                        appBarRef.current.setActiveIcon('code');
                    }
                } catch (error) {
                    console.error("Failed to load history data:", error);
                }
            } else {
                if (plantUMLCode) {
                    setIsUmlPreviewRendered(true);
                    setTimeout(() => {
                        if (umlSectionRef.current) {
                            umlSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                            setIsScrollable(true);
                            if (appBarRef.current) {
                                appBarRef.current.setActiveIcon('uml');
                            }
                        }
                    }, 10);
                } else {
                    setIsUmlPreviewRendered(false);
                    if (!generatedCode) {
                        setIsScrollable(false);
                    }
                }

                if (generatedCode) {
                    setIsCodeGeneratedRendered(true);
                    setIsScrollable(true);
                    setTimeout(() => {
                        if (codeSectionRef.current) {
                            codeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                            if (appBarRef.current) {
                                appBarRef.current.setActiveIcon('code');
                            }
                        }
                    }, 10);
                } else {
                    setIsCodeGeneratedRendered(false);
                    if (!plantUMLCode) {
                        setIsScrollable(false);
                    }
                }
            }
        };

        loadHistoryData();
    }, [plantUMLCode, generatedCode, selectedHistory, setUploadedImage, setPlantUMLCode, setGeneratedCode]);

    const handleSectionVisible = (sectionId) => {
        if (appBarRef.current) {
            const iconId = appBarRef.current.getIconIdFromSectionId(sectionId);
            appBarRef.current.setActiveIcon(iconId);
        }
    };

    return (
        <Fragment>
            <CssBaseline />
            <MenuAppBar ref={appBarRef} />
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
                        background: '#121212',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#333',
                        borderRadius: '5px',
                    }
                }}
                onScroll={(e) => {
                    const scrollTop = e.currentTarget.scrollTop;
                    const buffer = 50;

                    const uploadSection = document.getElementById('upload-image-section');
                    const umlSection = document.getElementById('uml-preview-section');
                    const codeSection = document.getElementById('code-generated-section');

                    if (uploadSection && scrollTop < uploadSection.offsetTop + buffer) {
                        handleSectionVisible('upload-image-section');
                    } else if (umlSection && isUmlPreviewRendered && scrollTop < umlSection.offsetTop + buffer) {
                        handleSectionVisible('uml-preview-section');
                    } else if (codeSection && isCodeGeneratedRendered && scrollTop < codeSection.offsetTop + buffer) {
                        handleSectionVisible('code-generated-section');
                    } else if (scrollTop < buffer && appBarRef.current) {
                        appBarRef.current.setActiveIcon('upload');
                    }
                }}
            >
                <Box
                    id="upload-image-section"
                    sx={{
                        height: "calc(100vh - 64px)",
                        scrollSnapAlign: "start",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: darkbgColor,
                        flexShrink: 0,
                    }}
                >
                    <Box sx={{ width: "85%" }}>
                        <Typography
                            sx={{ color: "white", fontFamily: "JetBrains Mono", fontSize: 20, marginBottom: "1rem" }}
                        >
                            Class Diagram
                        </Typography>
                        {/* <UploadImageSection /> */}
                        <Upload />
                    </Box>
                </Box>

                {isUmlPreviewRendered && (
                    <Box
                        id="uml-preview-section"
                        ref={umlSectionRef}
                        sx={{
                            height: "calc(100vh - 64px)",
                            scrollSnapAlign: "start",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: darkbgColor,
                            flexShrink: 0,
                        }}
                    >
                        <UMLPreview />
                    </Box>
                )}

                {isCodeGeneratedRendered && (
                    <Box
                        id="code-generated-section"
                        ref={codeSectionRef}
                        sx={{
                            height: "calc(100vh - 64px)",
                            scrollSnapAlign: "start",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: darkbgColor,
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
        </Fragment>
    );
}