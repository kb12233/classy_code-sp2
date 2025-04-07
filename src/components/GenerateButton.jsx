import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import { useAtom } from 'jotai';
import { 
  plantUmlCodeAtom, 
  selectedLanguageAtom, 
  generatedCodeAtom,
  loadingOperationAtom, 
  historyAtom,
  uploadedImageAtom,
  uploadedFileNameAtom,
} from '../atoms';
import { account } from '../appwrite/config';
import { saveHistory } from '../appwrite/HistoryService';
import { useEffect, useState } from 'react';

export default function GenerateCode({}) {
  const [plantUMLCode] = useAtom(plantUmlCodeAtom);
  const [language] = useAtom(selectedLanguageAtom);
  const [generatedCode, setGeneratedCode] = useAtom(generatedCodeAtom);
  const [isLoading, setIsLoading] = useAtom(loadingOperationAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [image] = useAtom(uploadedImageAtom);
  const [fileName] = useAtom(uploadedFileNameAtom);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await account.get();
        setUserID(user.$id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleGenerateClick = async () => {
    if (!plantUMLCode) {
      console.warn("No PlantUML code to convert");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantUML: plantUMLCode, language }),
      });

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(`\`\`\`${language}\n${data.code}\n\`\`\``);
      } else {
        console.error("Conversion failed:", data.error);
      }
    } catch (error) {
      console.error("Error converting PlantUML to code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (generatedCode && userID && plantUMLCode) {
        if (typeof fileName !== 'string' || !fileName) {
            console.error('Filename is invalid', fileName);
            return;
        }
        saveHistory(userID, image, generatedCode, language, plantUMLCode, fileName);
    }
  }, [generatedCode, userID, image, fileName, plantUMLCode]);

  return (
    <Container
      maxWidth="sx"
      sx={{
        height: '8vh',
        flex: 1,
        marginLeft: -3,
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