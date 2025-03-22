import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CiChat2 } from "react-icons/ci";
import MDEditor, { commands } from "@uiw/react-md-editor";
import plantumlEncoder from "plantuml-encoder";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAtom } from "jotai";
import { plantUmlCodeAtom } from "../atoms";


const UMLPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [plantUMLCode, setPlantUMLCode] = useAtom(plantUmlCodeAtom);
  const [umlImage, setUmlImage] = useState("");

  // Generate UML Diagram
  const generatePlantUML = (umlText) => {
    if (!umlText) return;
    try {
      const encodedDiagram = plantumlEncoder.encode(umlText);
      setUmlImage(`http://www.plantuml.com/plantuml/svg/${encodedDiagram}`);
    } catch (error) {
      console.error("Error generating PlantUML diagram", error);
    }
  };

  useEffect(() => {
    if (plantUMLCode) {
      setPlantUMLCode(plantUMLCode);
      generatePlantUML(plantUMLCode);
    }
  }, [plantUMLCode]);

  return (
    <div>

      {/* Open modal button */}
      <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 mb-4" onClick={() => setIsOpen(true)}>
        <CiChat2 size={32} className="text-gray-700" />
      </button>

      {/* UML Popup */}
      <Transition show={isOpen} as="div">
        <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}></div>

          {/* Dialog Panel */}
          <Dialog.Panel className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-7xl h-[85vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1 right-1 p-2 text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Layout: Markdown Editor & UML Preview Side by Side */}
            <div className="flex flex-row gap-5 h-full" style={{marginTop: "1rem"}}>
              {/* Markdown Editor */}
              <div className="flex-1 min-w-[0%] max-w-[50%] border rounded-md overflow-auto">
                <MDEditor
                  value={plantUMLCode}
                  preview="edit"
                  commands={[]}
                  extraCommands={[commands.fullscreen]}
                  onChange={(value) => {
                    setPlantUMLCode(value || "");
                    generatePlantUML(value);
                  }}
                  height="100%" // Ensure editor takes full height
                  style={{ 
                    minHeight: "100%", 
                    fontFamily: 'JetBrains Mono, monospace',
                  }} // Ensure editor doesn't collapse
                />
              </div>

              {/* UML Preview */}
              <div className="flex-1 min-w-[50%] max-w-[60%] border p-2 bg-gray-50 rounded-md flex justify-center items-center overflow-hidden">
                {umlImage ? (
                  <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={3}
                    wheel={{ step: 0.2 }}
                    pinch={{ step: 0.2 }}
                    doubleClick={{ step: 1 }}
                  >
                    <TransformComponent>
                      <img src={umlImage} alt="PlantUML Diagram" className="max-w-full h-auto" />
                    </TransformComponent>
                  </TransformWrapper>
                ) : (
                  <p className="text-gray-500">Generating UML diagram...</p>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UMLPopup;