import { Button , useTheme, useMediaQuery} from '@mui/material';
import { useAtom } from 'jotai';
import { 
  plantUmlCodeAtom, selectedLanguageAtom, 
  generatedCodeAtom, loadingOperationAtom,
  uploadedImageAtom, uploadedFileNameAtom, 
  } from '../atoms';
import PlantUMLTranspiler from 'plantuml-transpiler';
import { account } from '../appwrite/config';
import { saveHistory } from '../appwrite/HistoryService';
import { useEffect, useState } from 'react';

export default function GenerateCode() {
  const [plantUMLCode] = useAtom(plantUmlCodeAtom);
  const [language] = useAtom(selectedLanguageAtom);
  const [, setGeneratedCode] = useAtom(generatedCodeAtom);
  const [, setIsLoading] = useAtom(loadingOperationAtom);
  const [image] = useAtom(uploadedImageAtom);
  const [fileName] = useAtom(uploadedFileNameAtom);
  const [userID, setUserID] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


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
      const transpiler = new PlantUMLTranspiler();
      const code = transpiler.transpile(plantUMLCode, language);
      setGeneratedCode(`\`\`\`${language}\n${code}\n\`\`\``); // Wrap in a code block
      const finalCode = `\`\`\`${language}\n${code}\n\`\`\``;

      if (code && userID && plantUMLCode) {
        if (typeof fileName !== 'string' || !fileName) {
            console.error('Filename is invalid', fileName);
            return;
        }
        saveHistory(userID, image, finalCode, language, plantUMLCode, fileName);
      }   
    } catch (error) {
      console.error("Error converting PlantUML to code:", error);
    } finally {
      setIsLoading(false);
    }
  };

return (
  <Button
    variant="contained"
    sx={{
      bgcolor: 'white',
      color: 'black',
      fontFamily: 'JetBrains Mono',
      fontWeight: 'bold',
      fontSize: {xs: '1.5rem', md: '1.6rem'},
      paddingLeft: '2%',  
      paddingRight: '2%', 
      height: "auto",     
      minHeight: "auto",  
      width: isSmallScreen ? '100%' : "auto",
      minWidth: isSmallScreen ? 'auto' : 250, // Modified minWidth
    }}
    onClick={handleGenerateClick}
  >
    GENERATE
  </Button>
);
}
