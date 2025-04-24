import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
    plantUmlCodeAtom, selectedModelAtom,
    uploadedImageAtom, processingErrorAtom,
    readableModelNameAtom, imageUploadLoadingAtom,
    generatedCodeAtom, uploadedFileNameAtom,
    selectedHistoryAtom, fileObjectAtom
} from "../atoms";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "@fontsource/jetbrains-mono";
import "@fontsource/inter"; 
import LoadingOverlay from './LoadingOverlay';
import ValidationDialog from './ValidationDialog'; // Import the validation dialog
import logoDark from '../assets/images/logo_dark.png';
import { account } from "../appwrite/config";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled } from '@mui/material/styles';
import { Divider, Skeleton } from '@mui/material'; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 
import LLMService from "../services/LLMService";
import DiagramValidationService from "../services/DiagramValidationService";

const darkbgColor = "#1E1E1E";
const grayish = "#303030";
const greencolor = "#B6D9D7";
const zoombgColor = "#212121";

const ZoomButtonContainer = styled(Box)(({ theme }) => ({
    backgroundColor: zoombgColor,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden', 
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

const capitalizeFirstLetter = (str) => {
    if (!str) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

async function getUserName() {
    try {
        const user = await account.get();
        return capitalizeFirstLetter(user.name);
    } catch (error) {
        console.error("Error fetching user:", error);
        return "[username]";
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        backgroundColor: darkbgColor,
        fontFamily: 'Inter, sans-serif', 
        color: '#eee',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '85%',
    },
    helloContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logo: {
        height: 50,
        marginRight: '15px',
    },
    helloText: {
        fontSize: '2.5em',
        margin: 0,
        fontFamily:"JetBrains Mono, monospace",
    },
    uploadBox: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: darkbgColor,
        padding: '50px',
        borderRadius: '10px',
        border: '2px solid #555',
        marginBottom: '20px',
    },
    textContainer: {
        marginRight: '20px',
    },
    uploadText: {
        fontSize: '1em',
        margin: 0,
        fontFamily: 'Inter, sans-serif', 
        color: '#B4B4B4',
    },
    instructionText: {
        fontSize: '0.8em',
        color: '#6C6C6C',
        margin: '5px 0 0 0',
        fontFamily: 'Inter, sans-serif' 
    },
    browseButton: {
        backgroundColor: '#303030',
        color: '#B4B4B4',
        border: '2px solid #454545',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s ease',
        fontFamily: 'Inter, sans-serif' 
    },
    browseButtonHover: {
        backgroundColor: '#777',
    },
    imageContainer: {
        width: "80%",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        backgroundColor: grayish,
        borderRadius: "10px",
        cursor: 'grab', 
    },
    imageDisplay: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        transformOrigin: "center",
        transition: "transform 0.3s ease-in-out",
        userSelect: 'none',
    },
    placeholderText: {
        color: greencolor,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '1em',
    },
    zoomButton: {
        color: '#eee',
        borderColor: '#555',
        '&:hover': {
            borderColor: '#eee',
        },
        fontFamily: 'Inter, sans-serif'
    },
};

export default function UploadImageSection() {
    const [image, setImage] = useAtom(uploadedImageAtom);
    const [scale, setScale] = useState(1);
    const [isProcessing, setIsProcessing] = useAtom(imageUploadLoadingAtom);
    const [processingError, setProcessingError] = useAtom(processingErrorAtom);
    const [selectedModel] = useAtom(selectedModelAtom);
    const [readableModelName] = useAtom(readableModelNameAtom);
    const [, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
    const [, setGeneratedCode] = useAtom(generatedCodeAtom);
    const [, setFileName] = useAtom(uploadedFileNameAtom);
    const [selectedHistory] = useAtom(selectedHistoryAtom);
    const fileInputRef = useRef(null);
    const [userName, setUserName] = useState("");
    const [isLoadingImage, setIsLoadingImage] = useState(false); 
    const [loadingHistoryImage, setLoadingHistoryImage] = useState(false); 
    const imageContainerRef = useRef(null);
    const errorColor = "#ff6b6b";
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [fileObject, setFileObject] = useAtom(fileObjectAtom);
    
    // New state variables for diagram validation
    const [validationDialogOpen, setValidationDialogOpen] = useState(false);
    const [validationStatus, setValidationStatus] = useState({ title: "", message: "" });
    const [validatingDiagram, setValidatingDiagram] = useState(false);

    useEffect(() => {
        getUserName().then(name => setUserName(name));
    }, []);

    useEffect(() => {
        // Reset translation when scale changes back to 1
        if (scale === 1) {
            setTranslateX(0);
            setTranslateY(0);
        }
    }, [scale]);

    useEffect(() => {
        console.log("Image URL:", image);
    }, [image]);

    
    useEffect(() => {
      let loadingTimer;
      if (selectedHistory?.photoURL) {
          setLoadingHistoryImage(true);
          setIsLoadingImage(true);
          const img = new Image();
          img.onload = () => {
              loadingTimer = setTimeout(() => {
                  setLoadingHistoryImage(false);
                  setIsLoadingImage(false);
              }, 1000);
          };
          img.onerror = () => {
              clearTimeout(loadingTimer); 
              setLoadingHistoryImage(false);
              setIsLoadingImage(false);
          };
          img.src = selectedHistory.photoURL;
      } else {
          clearTimeout(loadingTimer); 
          setLoadingHistoryImage(false);
          setIsLoadingImage(false);
      }

      return () => clearTimeout(loadingTimer);
  }, [selectedHistory]);

    // Close validation dialog handler
    const handleCloseValidationDialog = () => {
        setValidationDialogOpen(false);
        // If the dialog is being closed and we had an invalid diagram, reset the image state
        if (validationStatus.title.includes("Invalid")) {
            setImage(null);
            setFileObject(null);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File selected:", file);
            
            if (!selectedModel) {
                setProcessingError("Please select a model first");
                return;
            }
            
            // Create object URL for preview
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setFileName(file.name);
            setScale(1);
            setTranslateX(0);
            setTranslateY(0);
            setFileObject(file);
            
            // Set validating state to show loading indicator
            setValidatingDiagram(true);
            setIsProcessing(true);
            setProcessingError("");
            
            try {
                // Validate the diagram first
                const isValid = await DiagramValidationService.validateDiagram(file);
                
                if (!isValid) {
                    // Show dialog for invalid diagram
                    setValidationStatus({
                        title: "Invalid UML Class Diagram",
                        message: "The uploaded image does not appear to contain a UML class diagram. Please upload a different image."
                    });
                    setValidationDialogOpen(true);
                    setValidatingDiagram(false);
                    setIsProcessing(false);
                    return;
                }
                
                // If valid, proceed with processing
                setPlantUMLCode("");
                setGeneratedCode("");
                
                // Use LLMService to process the image
                const result = await LLMService.processImage(file, selectedModel);
                
                if (result.plantUML) {
                    setPlantUMLCode(result.plantUML);
                } else {
                    console.error("Failed to generate PlantUML:", result.error);
                    setProcessingError(result.error || "Failed to process image");
                }
            } catch (error) {
                console.error("Error processing image:", error);
                setProcessingError("Error processing image. Please try again.");
            } finally {
                setValidatingDiagram(false);
                setIsProcessing(false);
            }
        }
    };

    // Fix for the wheel handler error by not using it directly
    const handleZoom = () => {
        // Let TransformWrapper handle zoom internally
        // This is an empty function to avoid the error
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {(!image && !selectedHistory) ? (
                    <div style={styles.helloContainer}>
                        <img src={logoDark} alt="Logo" style={styles.logo} />
                        <h1 style={styles.helloText}>Hello, {userName}</h1>
                    </div>
                ) : null}
                {(!image && !selectedHistory) ? (
                    <div style={styles.uploadBox}>
                        <div style={styles.textContainer}>
                            <p style={styles.uploadText}>Upload an image of a UML class diagram and convert it to code</p>
                            <p style={styles.instructionText}>// Click the "Browse File" button to select an image</p>
                        </div>
                        <button style={styles.browseButton} onClick={handleBrowseClick}>
                            Browse File
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                        />
                    </div>
                ) : null}

                {(image || selectedHistory) && (
                    <Box
                        ref={imageContainerRef}
                        style={styles.imageContainer}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {loadingHistoryImage ? (
                            <Skeleton height="100%" width="70%" animation="wave" sx={{ borderRadius: '10px', color: grayish }} />
                        ) : (
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.5}
                                maxScale={3}
                                wheel={{ step: 0.2 }}
                                pinch={{ step: 0.2 }}
                                doubleClick={{ step: 1 }}
                                options={{ limitToBounds: false }}
                            >
                                {({ zoomIn, zoomOut }) => (
                                    <>
                                        <TransformComponent>
                                            {selectedHistory ? (
                                                <img
                                                    src={selectedHistory.photoURL}
                                                    alt="Image of selected history"
                                                    style={styles.imageDisplay}
                                                />
                                            ) : (
                                                <img
                                                    src={image}
                                                    alt="Uploaded"
                                                    style={styles.imageDisplay}
                                                />
                                            )}
                                        </TransformComponent>
                                        {isProcessing && <LoadingOverlay message={`Processing with ${readableModelName}`} />}
                                        {processingError && (
                                            <Typography
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 16,
                                                    right: 16,
                                                    color: errorColor,
                                                    fontSize: "14px",
                                                    fontFamily: "JetBrains Mono",
                                                }}
                                            >
                                                Error: {processingError}
                                            </Typography>
                                        )}
                                        <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
                                            <ZoomButtonContainer>
                                                <ZoomButtonBox onClick={() => zoomIn()} size="large">
                                                    <ZoomInIcon sx={{ fontSize: 30 }} />
                                                </ZoomButtonBox>
                                                <VerticalDivider orientation="vertical" />
                                                <ZoomButtonBox onClick={() => zoomOut()} size="large">
                                                    <ZoomOutIcon sx={{ fontSize: 30 }} />
                                                </ZoomButtonBox>
                                            </ZoomButtonContainer>
                                        </Box>
                                    </>
                                )}
                            </TransformWrapper>
                        )}
                    </Box>
                )}
            </div>
            
            {/* Validation Dialog */}
            <ValidationDialog
                open={validationDialogOpen}
                onClose={handleCloseValidationDialog}
                title={validationStatus.title}
                message={validationStatus.message}
            />
        </div>
    );
}