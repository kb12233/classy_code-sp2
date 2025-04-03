import { useState } from "react";
import { useAtom } from "jotai";
import {
    plantUmlCodeAtom, selectedModelAtom,
    uploadedImageAtom, processingErrorAtom,
    readableModelNameAtom, imageUploadLoadingAtom,
    generatedCodeAtom, uploadedFileNameAtom,
    selectedHistoryAtom,
} from "../atoms";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import LoadingOverlay from '../components/LoadingOverlay';
import "@fontsource/jetbrains-mono";

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

    const grayish = "#303134";
    const greencolor = "#B6D9D7";
    const errorColor = "#ff6b6b";

    const resetSections = () => {
        setPlantUMLCode("");
        setGeneratedCode("");
        setProcessingError("");
        setIsProcessing(false);
        setScale(1);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setScale(1);
            setIsProcessing(true);
            setProcessingError("");

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

    return (
        <Container
            maxWidth="sx"
            sx={{
                bgcolor: grayish,
                borderRadius: "1vh",
                height: "80vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                flexDirection: "column",
            }}
        >
            {image ? (
                <Box
                    sx={{
                        width: "100%",
                        height: "50vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        position: "relative",
                    }}
                    onWheel={handleZoom}
                >
                    {selectedHistory ? (
                        <img
                            src={selectedHistory.photoURL}
                            alt="Image of selected history"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                transform: `scale(${scale})`,
                                transformOrigin: "center",
                                transition: "transform 0.3s ease-in-out",
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "50vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                position: "relative",
                            }}
                            onWheel={handleZoom}
                        >
                            <img
                                src={image}
                                alt="Uploaded"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    transform: `scale(${scale})`,
                                    transformOrigin: "center",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                            />
                            <Button
                                component="label"
                                variant="contained"
                                onClick={resetSections}
                                sx={{
                                    position: "absolute",
                                    bottom: 16,
                                    right: 16,
                                    bgcolor: "rgba(77, 75, 75, 0.99)",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 60,
                                    height: 60,
                                    minWidth: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    "&:hover": { bgcolor: "rgba(134, 131, 131, 0.99)" },
                                }}
                            >
                                <AddIcon sx={{ fontSize: 28, color: greencolor }} />
                                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                            </Button>

                            {isProcessing && <LoadingOverlay message={`Processing with ${readableModelName}`} />}
                            {processingError && (
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        bottom: 90,
                                        right: 16,
                                        color: errorColor,
                                        fontSize: "14px",
                                        fontFamily: "JetBrains Mono",
                                    }}
                                >
                                    Error: {processingError}
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button
                        component="label"
                        variant="contained"
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.2)",
                            color: greencolor,
                            borderRadius: "50%",
                            width: 60,
                            height: 60,
                            minWidth: "auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                        }}
                    >
                        <AddIcon sx={{ fontSize: 32 }} />
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>

                    <Typography
                        sx={{
                            color: greencolor,
                            marginTop: 1.5,
                            fontSize: "16px",
                            fontWeight: 500,
                            textAlign: "center",
                            fontFamily: "JetBrains Mono",
                        }}
                    >
                        Upload a Class Diagram
                    </Typography>

                    {selectedModel && (
                        <Typography
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                marginTop: 1,
                                fontSize: "14px",
                                textAlign: "center",
                                fontFamily: "JetBrains Mono",
                            }}
                        >
                            Using {readableModelName}
                        </Typography>
                    )}
                </Box>
            )}
        </Container>
    );
}