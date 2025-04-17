// UMLPreviewDisplay.jsx
import { useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import plantumlEncoder from "plantuml-encoder";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAtom } from "jotai";
import { plantUmlCodeAtom, selectedHistoryAtom, selectedModelAtom,
  uploadedImageAtom, processingErrorAtom, imageUploadLoadingAtom,
  generatedCodeAtom, fileObjectAtom} from "../atoms";
import SelectLanguage from "./SelectLanguage";
import GenerateCode from "./GenerateButton";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import HistoryDetails from "./HistoryDetails";
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LLMService from "../services/llmservice";

const UMLPreviewDisplay = ({isCodeGeneratedVisible}) => {
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

  const grayish = "#303030";
  const whitish = "#ffffff";
  const markdownSkeletonArray = [
    { height: 30, width: 550 },
    { height: 30, width: 450 },
    { height: 30, width: 500 },
    { height: 30, width: 400 },
    { height: 30, width: 400 },
    { height: 30, width: 470 },
    { height: 30, width: 550 },
    { height: 30, width: 450 },
    { height: 30, width: 500 },
    { height: 30, width: 400 },
    { height: 30, width: 400 },
    { height: 30, width: 470 },
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
      // Use LLMService directly instead of calling the backend
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
    <div className="flex flex-col gap-8" style={{ height: '80vh', width: '85%', marginTop: '1%' }}>
      <div className="flex flex-row gap-8" style={{ height: '65vh' }}>
        {/* Markdown Editor Section */}
        <div className="rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ backgroundColor: grayish, flex: 1, maxHeight: '70vh' }}>
          <div className="w-full flex justify-end items-center p-2"> {/* Align items vertically */}
          
          {!selectedHistory && (
              <IconButton aria-label="restart" onClick={handleRestart} size="small" sx={{ color: whitish }} className="mr-2">
                <RestartAltIcon />
              </IconButton>
            )}
            
          </div>
          {loading && !isEditing && plantUMLCode ? (
            <Box className="flex flex-col space-y-3 flex-grow" sx={{ width: '100%', padding: '3%' }}>
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
              height="calc(100% - 10px)"
              style=
              {{
                fontFamily: 'JetBrains Mono, monospace',
                backgroundColor: grayish,
              }}
            />
          )}
        </div>

        {/* UML Preview Section */}
        <div
          className="rounded-lg shadow-lg overflow-hidden flex flex-col items-center justify-center"
          style={{ backgroundColor: grayish, flex: 1, maxHeight: '70vh', position: 'relative' }}
        >
          {loading && !isEditing ? (
            <Box className="flex flex-col space-y-3 flex-grow flex items-center justify-center" sx={{ marginTop: '3%' }}>
              <Skeleton height={500} width={700} animation="wave" />
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
                    <img
                      src={umlImage}
                      alt="PlantUML Diagram"
                      className="w-full h-full object-contain"
                    />
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
            <div className="flex items-center justify-center w-full h-full">
              <p
                className="text-gray-500"
                style={{ color: whitish, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {plantUMLCode ? 'Generating UML diagram...' : 'Enter PlantUML code to preview.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History Details and Generate/Select Language Section */}
      <div className="flex flex-col gap-4">
        {selectedHistory && (
        <HistoryDetails />
        )}
        {/* Conditionally render SelectLanguage and GenerateCode */}
        {!selectedHistory && !isCodeGeneratedVisible && (
        <div className="flex flex-row gap-4 justify-center">
          <SelectLanguage />
          <GenerateCode />
        </div>
        )}
      </div>
    </div>
  );
};

export default UMLPreviewDisplay;