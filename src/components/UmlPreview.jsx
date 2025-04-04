import { useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import plantumlEncoder from "plantuml-encoder";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAtom } from "jotai";
import { plantUmlCodeAtom } from "../atoms";
import SelectLanguage from "./SelectLanguage";
import GenerateCode from "./GenerateButton";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const UMLPreviewDisplay = () => {
  const [plantUMLCode, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
  const [umlImage, setUmlImage] = useState("");
  const [loading, setLoading] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const grayish = "#303134";
  const greencolor = "#B6D9D7";
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
      setTimeout(() => setLoading(false), 2000);
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
    <div className="grid grid-cols-2 gap-8" style={{ height: '80vh', width: '85%' }}>
      {/* Markdown Editor Section */}
      <div className="border rounded-lg shadow-lg overflow-hidden " style={{ backgroundColor: grayish, height: '70vh', maxHeight: '70vh' }}>
        <h2 className="text-xl p-4 border-b" style={{ color: "white", fontFamily: 'JetBrains Mono, monospace' }}>Markdown Editor</h2>
        {loading && !isEditing && plantUMLCode ? (
          <Box className="flex flex-col space-y-3" sx={{ width: '100%', padding: '3%' }}>
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
            height="calc(100% - 56px)"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
        )}
      </div>

     {/* UML Preview Section */}
      <div
        className="border rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: grayish, height: '70vh', maxHeight: '70vh' }}
      >   {loading && !isEditing ? (
            <Box className="flex flex-col space-y-3 " sx={{ marginTop: '3%' }}>
              <Skeleton height={500} width={700} animation="wave" />
            </Box>
          ): umlImage ? (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          wheel={{ step: 0.2 }}
          pinch={{ step: 0.2 }}
          doubleClick={{ step: 1 }}
        >
          <TransformComponent>
            <img
              src={umlImage}
              alt="PlantUML Diagram"
              className="w-full h-full object-contain"
            />
          </TransformComponent>
        </TransformWrapper>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p
            className="text-gray-500"
            style={{ color: greencolor, fontFamily: 'JetBrains Mono, monospace' }}
          >
            {plantUMLCode ? 'Generating UML diagram...' : 'Enter PlantUML code to preview.'}
          </p>
        </div>
      )}
    </div>

      <GenerateCode />
      <SelectLanguage />
    </div>
  );
};

export default UMLPreviewDisplay;