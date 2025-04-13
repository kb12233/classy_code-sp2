import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useAtom } from 'jotai';
import { generatedCodeAtom } from '../atoms';
import Skeleton from '@mui/material/Skeleton';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { saveAs } from 'file-saver';
import { styled } from '@mui/material/styles';

const IconBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#303030', 
  borderRadius: '8px',
  padding: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

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
  const iconColor = "#eee";
  const commentColor = "#6C6C6C";

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

  const handleSave = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode.replace(/```[\w]*\n/g, '').replace(/```/g, '')], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'generated_code.txt');
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.replace(/```[\w]*\n/g, '').replace(/```/g, ''));
    }
  };

  return (
    <Box sx={{ width: '70%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1rem'}}>
        <p style={{ color: commentColor, fontFamily: 'JetBrains Mono, monospace' }}>// Generated Code</p>
        <Box sx={{ display: 'flex' }}>
          <IconBox>
            <IconButton
              onClick={handleSave}
              aria-label="save"
              size="small"
              sx={{ color: iconColor, '&:hover': { color: '#B6D9D7' } }}
            >
              <SaveIcon />
            </IconButton>
          </IconBox>
          <IconBox>
            <IconButton
              onClick={handleCopy}
              aria-label="copy"
              size="small"
              sx={{ color: iconColor, '&:hover': { color: '#B6D9D7' } }}
            >
              <FileCopyIcon />
            </IconButton>
          </IconBox>
        </Box>
      </Box>
      <Container
        maxWidth="sx"
        sx={{
          height: "70vh",
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
          <Box className="flex flex-col space-y-3" sx={{ width: '100%', mt: '3%', ml: '3%' }}>
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
              }}
            />
          </Box>
        ) : (
          <p style={{ color: "white", fontFamily: 'JetBrains Mono', }}>No code generated yet.</p>
        )}
      </Container>
    </Box>
  );
}