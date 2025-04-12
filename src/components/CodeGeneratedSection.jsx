import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useAtom } from 'jotai';
import { generatedCodeAtom } from '../atoms';
import Skeleton from '@mui/material/Skeleton';
import * as React from 'react';

export default function CodeGeneratedSection() {
  const [generatedCode] = useAtom(generatedCodeAtom);
  const [loading, setLoading] = React.useState(true);
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

  const grayish = "#303030";

  const simulateLoading = () => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  };

  React.useEffect(() => {
    if (generatedCode) {
      simulateLoading();
    } else {
      setLoading(false);
    }
  }, [generatedCode]);

  return (
    <Container
      maxWidth="sx"
      sx={{
        height: "70vh",
        width: "70%",
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
      {loading ? (
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
              fontFamily: 'JetBrains Mono',
              backgroundColor: grayish, 
          }}  />
        </Box>
      ) : (
        <p style={{ color: "white", fontFamily: 'JetBrains Mono',}}>No code generated yet.</p>
      )}
    </Container>
  );
}
