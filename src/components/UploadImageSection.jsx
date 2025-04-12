//UploadImageSection
import { useState, useEffect, useRef, useCallback } from "react";
import { useAtom } from "jotai";
import {
  plantUmlCodeAtom, selectedModelAtom,
  uploadedImageAtom, processingErrorAtom,
  readableModelNameAtom, imageUploadLoadingAtom,
  generatedCodeAtom, uploadedFileNameAtom,
  selectedHistoryAtom,
} from "../atoms";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "@fontsource/jetbrains-mono";
import "@fontsource/inter"; // Import Inter font source
import LoadingOverlay from '../components/LoadingOverlay';
import logoDark from '../assets/images/logo_dark.png';
import { account } from "../appwrite/config";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';

const darkbgColor = "#1E1E1E";
const grayish = "#303030";
const greencolor = "#B6D9D7";
const zoombgColor = "#212121";

const ZoomButtonContainer = styled(Box)(({ theme }) => ({
  backgroundColor: zoombgColor,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden', // Clip the divider
}));

const ZoomButtonBox = styled(Button)(({ theme }) => ({
  color: '#eee',
  borderColor: '#555',
  minWidth: 50, // Ensure a minimum width for the button
  padding: theme.spacing(1),
  borderRadius: 0, // Remove individual button borders
  '&:hover': {
    borderColor: '#eee',
  },
}));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: '#555',
  height: '24px', // Adjust height as needed
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
    fontFamily: 'Inter, sans-serif', // Set default font to Inter
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
    fontFamily: 'Inter, sans-serif' // Ensure Inter is used
  },
  instructionText: {
    fontSize: '0.8em',
    color: '#aaa',
    margin: '5px 0 0 0',
    fontFamily: 'Inter, sans-serif' // Ensure Inter is used
  },
  browseButton: {
    backgroundColor: '#303030',
    color: '#eee',
    border: '2px solid #454545',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
    fontFamily: 'Inter, sans-serif' // Ensure Inter is used
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
    cursor: 'grab', /* Default hand cursor */
  },
  imageDisplay: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    transformOrigin: "center",
    transition: "transform 0.3s ease-in-out",
    userSelect: 'none', /* Prevent text selection during drag */
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
    fontFamily: 'Inter, sans-serif' // Ensure Inter is used
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const imageContainerRef = useRef(null);

  const errorColor = "#ff6b6b";

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


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      setIsProcessing(true);
      setProcessingError("");
      setPlantUMLCode("");
      setGeneratedCode("");

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
    setScale((prevScale) => {
      const zoomFactor = event.deltaY < 0 ? 0.1 : -0.1;
      const newScale = prevScale + zoomFactor;
      return Math.min(Math.max(newScale, 1), 3);
    });
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartX(e.clientX - translateX);
      setStartY(e.clientY - translateY);
      if (imageContainerRef.current) {
        imageContainerRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    requestAnimationFrame(() => {
      setTranslateX(e.clientX - startX);
      setTranslateY(e.clientY - startY);
    });
  }, [isDragging, startX, startY]);

  const handleMouseUp = () => {
    setIsDragging(false);
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grab';
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
            style={{ ...styles.imageContainer, cursor: scale > 1 ? 'grab' : 'default' }}
            onWheel={handleZoom}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {selectedHistory ? (
              <img
                src={selectedHistory.photoURL}
                alt="Image of selected history"
                style={{
                  ...styles.imageDisplay,
                  transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                }}
              />
            ) : (
              <img
                src={image}
                alt="Uploaded"
                style={{
                  ...styles.imageDisplay,
                  transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                }}
              />
            )}
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
                <ZoomButtonBox onClick={() => setScale(prev => Math.min(prev + 0.1, 3))} size="large">
                  <ZoomInIcon sx={{ fontSize: 30 }} />
                </ZoomButtonBox>
                <VerticalDivider orientation="vertical" />
                <ZoomButtonBox onClick={() => setScale(prev => Math.max(prev - 0.1, 1))} size="large">
                  <ZoomOutIcon sx={{ fontSize: 30 }} />
                </ZoomButtonBox>
              </ZoomButtonContainer>
            </Box>
          </Box>
        )}
      </div>
    </div>
  );
}