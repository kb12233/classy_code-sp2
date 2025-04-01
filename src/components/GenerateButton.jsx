import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import { useAtom } from 'jotai';
import { 
  plantUmlCodeAtom, 
  selectedLanguageAtom, 
  generatedCodeAtom,
  loadingOperationAtom 
} from '../atoms';
import PlantUMLTranspiler from 'plantuml-transpiler';

export default function GenerateCode() {
  const [plantUMLCode] = useAtom(plantUmlCodeAtom);
  const [language] = useAtom(selectedLanguageAtom);
  const [, setGeneratedCode] = useAtom(generatedCodeAtom);
  const [isLoading, setIsLoading] = useAtom(loadingOperationAtom);

  const handleGenerateClick = async () => {
    if (!plantUMLCode) {
      console.warn("No PlantUML code to convert");
      return;
    }
    
    setIsLoading(true);
    try {
      const transpiler = new PlantUMLTranspiler();
      const code = transpiler.transpile(plantUMLCode, language);
      console.log("Generated code:", code);
      setGeneratedCode(`\`\`\`${language}\n${code}\n\`\`\``); // Wrap in a code block
    } catch (error) {
      console.error("Error converting PlantUML to code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sx"
      sx={{
        height: '8vh',
        flex: 1,
        marginLeft: -0.5,
        width: '50vh',
      }}
    >
      <Button
        variant="contained"
        sx={{
          bgcolor: '#b8dbd9',
          color: 'black',
          fontFamily: 'JetBrains Mono',
          fontWeight: 'bold',
          fontSize: 24,
          paddingTop: '2%',
          paddingBottom: '2%',
          paddingLeft: '15%',
          paddingRight: '15%',
          height: "75%",
          minHeight: "75%",
          width: "100%",
          maxWidth: "11000px",
        }}
        onClick={handleGenerateClick}
        // disabled={isLoading || !plantUMLCode}
      >
        {/* {isLoading ? 'GENERATING...' : 'GENERATE'} */}
        GENERATE
      </Button>
    </Container>
  );
}