//UploadImageSection
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
    plantUmlCodeAtom, selectedModelAtom,
    uploadedImageAtom, processingErrorAtom,
    readableModelNameAtom, imageUploadLoadingAtom,
    generatedCodeAtom, uploadedFileNameAtom,
    selectedHistoryAtom, fileObjectAtom} from "../atoms";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "@fontsource/jetbrains-mono";
import "@fontsource/inter"; 
import LoadingOverlay from '../components/LoadingOverlay';
import logoDark from '../assets/images/logo_dark.png';
import { account } from "../appwrite/config";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled } from '@mui/material/styles';
import { Divider, Skeleton } from '@mui/material'; 
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 

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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File selected:", file);
            setImage(URL.createObjectURL(file));
            console.log("Image URL:", image);
            setFileName(file.name);
            setScale(1);
            setTranslateX(0);
            setTranslateY(0);
            setIsProcessing(true);
            setProcessingError("");
            setPlantUMLCode("");
            setGeneratedCode("");
            setFileObject(file);

            const formData = new FormData();
            formData.append("image", file);

            if (selectedModel) {
                formData.append("model", selectedModel);
            }

            try {
                const response = await fetch("http://localhost:5000/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.plantUML) {
                    setPlantUMLCode(data.plantUML);
                } else {
                    console.error("Failed to generate PlantUML:", data.error);
                    setProcessingError(data.error || "Failed to process image");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                setProcessingError("Error uploading image. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleZoom = (event) => {
        event.preventDefault();
        // Zooming is now handled by the TransformWrapper
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
                                onWheel={handleZoom} 
                            >
                                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
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
        </div>
    );
}