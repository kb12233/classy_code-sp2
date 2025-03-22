import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useAtom } from 'jotai';
import { generatedCodeAtom } from '../atoms';

export default function CodeGeneratedSection() {
  const [generatedCode] = useAtom(generatedCodeAtom);

  return (
    <Container
      maxWidth="sx"
      sx={{
        bgcolor: '#303134',
        borderRadius: '1%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        padding: '1%',
        marginRight: '2%',
        marginTop: -1,
      }}
    >
    
      {generatedCode ? (
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
              backgroundColor: "#303134", 
          }}  />
        </Box>
      ) : (
        <p style={{ color: "white", fontFamily: 'JetBrains Mono',}}>Click "Generate" to see the code...</p>
      )}
    </Container>
  );
}