import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useAtom } from 'jotai';
import { codeGenerationLoadingAtom, generatedCodeAtom, } from '../atoms';
import Skeleton from '@mui/material/Skeleton';
import LoadingOverlay from './LoadingOverlay';
import * as React from 'react';

export default function CodeGeneratedSection() {
  const [generatedCode] = useAtom(generatedCodeAtom);
  const [isProcessing, setIsProcessing] = useAtom(codeGenerationLoadingAtom);
  const skeletonArray = [
    { height: 35, width: 800 },
    { height: 35, width: 700 },
    { height: 35, width: 850 },
    { height: 35, width: 750 },
    { height: 35, width: 720 },
    { height: 35, width: 550 },
    { height: 35, width: 750 },
    { height: 35, width: 670 },
    { height: 35, width: 590 },
    { height: 35, width: 700 },
    { height: 35, width: 550 },
    { height: 35, width: 500 },
  ];

  const simulateLoading = () => {
    setIsProcessing(true);
    const timer = setTimeout(() => setIsProcessing(false), 2000);
    return () => clearTimeout(timer);
  };

  React.useEffect(() => {
    if (generatedCode) {
      simulateLoading();
    } else {
      setIsProcessing(false);
    }
  }, [generatedCode]);

  return (
    <Container
      maxWidth="sx"
      sx={{
        height: "80vh",
        bgcolor: '#303030',
        borderRadius: '1vh',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        padding: '1%',
      }}
    >
      {isProcessing && <LoadingOverlay message="Generating Code..." /> ? (
        <Box className="flex flex-col space-y-3" sx={{ width: '100%', marginTop: '3%', marginLeft: '3%' }}>
          <Box className="space-y-5">
          {skeletonArray.map((skeleton, index) => (
      <Skeleton
        key={index}
        height={skeleton.height}
        width={skeleton.width}
        animation="wave"
      />
    ))}
          </Box>
        </Box>
      ) : generatedCode ? (
        <Box sx={{ height: '100%', overflowY: 'auto' }}>
          <MDEditor 
            value={generatedCode} 
            preview="preview"
            commands={[]}
            extraCommands={[commands.fullscreen]}
            style={{
              minHeight: "100%", 
              height: "100%", 
              width: "100%",
              backgroundColor: "#303030", 
          }}  />
        </Box>
      ) : (
        <p style={{ color: "white", fontFamily: 'JetBrains Mono',}}>No code generated yet.</p>
      )}
    </Container>
  );
}
