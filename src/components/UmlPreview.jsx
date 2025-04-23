import React, { useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import plantumlEncoder from "plantuml-encoder";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAtom } from "jotai";
import {
    plantUmlCodeAtom, selectedHistoryAtom, selectedModelAtom,
    uploadedImageAtom, processingErrorAtom, imageUploadLoadingAtom,
    generatedCodeAtom, fileObjectAtom
} from "../atoms";
import SelectLanguage from "./SelectLanguage";
import GenerateCode from "./GenerateButton";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import HistoryDetails from "./HistoryDetails";
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LLMService from "../services/LLMService";
import { useMediaQuery } from '@mui/material';

const UMLPreviewDisplay = ({ isCodeGeneratedVisible }) => {
    const [plantUMLCode, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
    const [umlImage, setUmlImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedHistory] = useAtom(selectedHistoryAtom);
    const [image] = useAtom(uploadedImageAtom);
    const [, setIsProcessing] = useAtom(imageUploadLoadingAtom);
    const [, setProcessingError] = useAtom(processingErrorAtom);
    const [selectedModel] = useAtom(selectedModelAtom);
    const [, setGeneratedCode] = useAtom(generatedCodeAtom);
    const [fileObject] = useAtom(fileObjectAtom);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Key breakpoint

    const grayish = "#303030";
    const whitish = "#ffffff";

    const markdownSkeletonArray = [
        { height: 30, width: isSmallScreen ? '95%' : 550 },
        { height: 30, width: isSmallScreen ? '85%' : 450 },
        { height: 30, width: isSmallScreen ? '90%' : 500 },
        { height: 30, width: isSmallScreen ? '80%' : 400 },
        { height: 30, width: isSmallScreen ? '80%' : 400 },
        { height: 30, width: isSmallScreen ? '87%' : 470 },
        { height: 30, width: isSmallScreen ? '95%' : 550 },
        { height: 30, width: isSmallScreen ? '85%' : 450 },
        { height: 30, width: isSmallScreen ? '90%' : 500 },
        { height: 30, width: isSmallScreen ? '80%' : 400 },
        { height: 30, width: isSmallScreen ? '80%' : 400 },
        { height: 30, width: isSmallScreen ? '87%' : 470 },
    ];

    const ZoomButtonContainer = styled(Box)(({ theme }) => ({
        backgroundColor: "#212121",
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'absolute',
        bottom: 20,
        right: 20,
    }));

    const ZoomButtonBox = styled(Button)(({ theme }) => ({
        color: '#eee',
        borderColor: '#555',
        minWidth: 50,
        padding: theme.spacing(1),
        borderRadius: 0,
        '&:hover': {
            borderColor: '#eee',
        },
    }));

    const VerticalDivider = styled(Divider)(({ theme }) => ({
        backgroundColor: '#555',
        height: '24px',
        width: '1px',
    }));

    const generatePlantUML = (umlText) => {
        if (!umlText) {
            setUmlImage("");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const encodedDiagram = plantumlEncoder.encode(umlText);
            setUmlImage(`http://www.plantuml.com/plantuml/svg/${encodedDiagram}`);
        } catch (error) {
            console.error("Error generating PlantUML diagram", error);
            setUmlImage("");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleRestart = async () => {
        if (!fileObject) {
            console.warn("No file object available to restart.");
            return;
        }
        setIsProcessing(true);
        setProcessingError("");
        setPlantUMLCode("");
        setGeneratedCode("");
        try {
            if (!selectedModel) {
                throw new Error("Please select a model first");
            }
            const result = await LLMService.processImage(fileObject, selectedModel);
            if (result.plantUML) {
                setPlantUMLCode(result.plantUML);
            } else {
                console.error("Failed to regenerate PlantUML:", result.error);
                setProcessingError(result.error || "Failed to process image");
            }
        } catch (error) {
            console.error("Error during PlantUML regeneration:", error);
            setProcessingError("Error regenerating PlantUML. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (plantUMLCode !== null) {
            generatePlantUML(plantUMLCode);
        } else {
            setUmlImage("");
            setLoading(false);
        }
    }, [plantUMLCode]);

    return (
        <Box
            sx={{
                height: '80vh',
                width: '95%',
                marginTop: '1%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}
        >
            <Box  //  This Box contains the editor and preview
                sx={{
                    height: isSmallScreen ? 'auto' : '65vh',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row', // Row on larger, Column on small
                    gap: 8,
                }}
            >
                {/* Markdown Editor Section */}
                <Box
                    sx={{
                        backgroundColor: grayish,
                        flex: 1,
                        maxHeight: '100%',
                        width: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
                        {!selectedHistory && (
                            <IconButton
                                aria-label="restart"
                                onClick={handleRestart}
                                size="small"
                                sx={{ color: whitish }}
                            >
                                <RestartAltIcon />
                            </IconButton>
                        )}
                    </Box>
                    {loading && !isEditing && plantUMLCode ? (
                        <Box sx={{ width: '100%', p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {markdownSkeletonArray.map((skeleton, index) => (
                                <Skeleton
                                    key={index}
                                    height={skeleton.height}
                                    width={skeleton.width}
                                    animation="wave"
                                />
                            ))}
                        </Box>
                    ) : (
                        <MDEditor
                            value={plantUMLCode}
                            preview="edit"
                            commands={[]}
                            extraCommands={[commands.fullscreen]}
                            onChange={(value) => {
                                setPlantUMLCode(value || "");
                                setIsEditing(true);
                            }}
                            onBlur={() => setIsEditing(false)}
                            style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                backgroundColor: grayish,
                                height: 'calc(100% - 40px)',
                                width: '100%',
                            }}
                        />
                    )}
                </Box>

                {/* UML Preview Section */}
                <Box
                    sx={{
                        backgroundColor: grayish,
                        flex: 1,
                        maxHeight: '100%',
                        width: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        position: 'relative',
                    }}
                >
                    {loading && !isEditing ? (
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                            <Skeleton height={500} width={isSmallScreen ? '90%' : 700} animation="wave" />
                        </Box>
                    ) : umlImage ? (
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={3}
                            wheel={{ step: 0.2 }}
                            pinch={{ step: 0.2 }}
                            doubleClick={{ step: 1 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <>
                                    <TransformComponent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                            <img
                                                src={umlImage}
                                                alt="PlantUML Diagram"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        </Box>
                                    </TransformComponent>
                                    <ZoomButtonContainer>
                                        <ZoomButtonBox onClick={() => zoomIn()} size="large">
                                            <ZoomInIcon sx={{ fontSize: 30 }} />
                                        </ZoomButtonBox>
                                        <VerticalDivider orientation="vertical" />
                                        <ZoomButtonBox onClick={() => zoomOut()} size="large">
                                            <ZoomOutIcon sx={{ fontSize: 30 }} />
                                        </ZoomButtonBox>
                                    </ZoomButtonContainer>
                                </>
                            )}
                        </TransformWrapper>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <p style={{ color: whitish, fontFamily: 'JetBrains Mono, monospace' }}>
                                {plantUMLCode ? 'Generating UML diagram...' : 'Enter PlantUML code to preview.'}
                            </p>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* History Details and Generate/Select Language Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {selectedHistory && <HistoryDetails />}
                {!selectedHistory && !isCodeGeneratedVisible && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <SelectLanguage />
                        <GenerateCode />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default UMLPreviewDisplay;