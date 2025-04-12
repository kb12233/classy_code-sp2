import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useAtom } from 'jotai';
import { plantUmlCodeAtom, generatedCodeAtom, 
    selectedHistoryAtom, uploadedImageAtom,
    selectedModelAtom
} from '../atoms';
import UploadImageSection from "./UploadImageSection";
import UMLPreview from "./UmlPreview";
import CodeGeneratedSection from "./CodeGeneratedSection";
import MenuAppBar from "./AppBar";
import { useState, useEffect, useRef, Fragment } from "react";
import { account } from "../appwrite/config";   


export default function Homepage() {
    const [plantUMLCode] = useAtom(plantUmlCodeAtom);
    const [generatedCode] = useAtom(generatedCodeAtom);
    const [selectedHistory] = useAtom(selectedHistoryAtom);
    const [, setUploadedImage] = useAtom(uploadedImageAtom);
    const [, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
    const [, setGeneratedCode] = useAtom(generatedCodeAtom);
    const[, setHistory] = useAtom(selectedHistoryAtom);
    const [, setSelectedModel] = useAtom(selectedModelAtom);

    const umlSectionRef = useRef(null);
    const codeSectionRef = useRef(null);
    const [isUmlPreviewRendered, setIsUmlPreviewRendered] = useState(false);
    const [isCodeGeneratedRendered, setIsCodeGeneratedRendered] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const appBarRef = useRef(null);

    const darkbgColor = "#1E1E1E";

    useEffect(() => {
        const loadHistoryData = async () => {
            if (selectedHistory) {
                try {
                    await account.get();
                    setUploadedImage(selectedHistory.photoURL);
                    setPlantUMLCode(selectedHistory.umlCode); 
                    setGeneratedCode(selectedHistory.generatedCode); 

                    setIsUmlPreviewRendered(!!selectedHistory.umlCode);
                    setIsCodeGeneratedRendered(!!selectedHistory.generatedCode);
                    setIsScrollable(true);

                    if (appBarRef.current) {
                        if (selectedHistory.umlCode) {
                            appBarRef.current.setActiveIcon('uml');
                        }
                        if (selectedHistory.generatedCode) {
                            appBarRef.current.setActiveIcon('code');
                        }
                    }
                } catch (error) {
                    console.error("Failed to load history data:", error);
                }
            } else {
                setIsUmlPreviewRendered(!!plantUMLCode);
                setIsCodeGeneratedRendered(!!generatedCode);
                setIsScrollable(!!plantUMLCode || !!generatedCode);

                if (plantUMLCode) {
                    setTimeout(() => {
                        if (umlSectionRef.current) {
                            umlSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                            if (appBarRef.current) {
                                appBarRef.current.setActiveIcon('uml');
                            }
                        }
                    }, 10);
                }

                if (generatedCode) {
                    setTimeout(() => {
                        if (codeSectionRef.current) {
                            codeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                            if (appBarRef.current) {
                                appBarRef.current.setActiveIcon('code');
                            }
                        }
                    }, 10);
                }
            }
        };

        loadHistoryData();
    }, [plantUMLCode, generatedCode, selectedHistory, setUploadedImage, setPlantUMLCode, setGeneratedCode]);
    
    const handleRestart = () => {
        if(selectedHistory) {
            setHistory(null);
        } 
        setSelectedModel('');
        setUploadedImage(null);
        setPlantUMLCode('');
        setGeneratedCode('');
        setIsUmlPreviewRendered(false);      
        setIsCodeGeneratedRendered(false);
        setIsScrollable(false);

        const uploadSection = document.getElementById('upload-image-section');
        if (uploadSection) {
            uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
    
        if (appBarRef.current) {
            appBarRef.current.setActiveIcon('upload');
        }

        console.log('Model selection and related sections reset');
    }
    
    const handleSectionVisible = (sectionId) => {
        if (appBarRef.current) {
            const iconId = appBarRef.current.getIconIdFromSectionId(sectionId);
            appBarRef.current.setActiveIcon(iconId);
        }
    };

    return (
        <Fragment>
            <CssBaseline />
            <MenuAppBar ref={appBarRef} onRestart={handleRestart} />
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
                        <UploadImageSection />
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
                            flexDirection: "column",
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
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            backgroundColor: darkbgColor,
                            flexShrink: 0,
                            paddingTop: "2rem",
                        }}
                    >
                        <Box sx={{ width: "85%", flexGrow: 1 ,marginTop: 5}}>
                            <CodeGeneratedSection />
                        </Box>
                    </Box>
                )}
            </Box>
        </Fragment>
    );
}