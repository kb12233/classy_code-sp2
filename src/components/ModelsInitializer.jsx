import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  modelsAtom, 
  modelsLoadingAtom, 
  modelsErrorAtom, 
  selectedModelAtom 
} from '../atoms';
import ModelsService from '../services/ModelsService';

// This component doesn't render anything, it just initializes models data
export default function ModelsInitializer() {
  const [models, setModels] = useAtom(modelsAtom);
  const [, setLoading] = useAtom(modelsLoadingAtom);
  const [, setError] = useAtom(modelsErrorAtom);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  // Fetch available models when the component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        
        // Use the ModelsService to fetch available models
        const data = await ModelsService.getAvailableModels();
        
        if (data?.models && data.models.length > 0) {
          setModels(data.models);
          
          // Set default model if not already set or if current selection isn't available
          if (!selectedModel || !data.models.some(m => m.id === selectedModel)) {
            setSelectedModel(data.models[0].id);
          }
        } else {
          console.warn('No models available or error in API response. Using fallback model.');
          
          // Create a fallback model to prevent errors in the UI
          const fallbackModels = [
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Fallback)", provider: "Google" }
          ];
          
          setModels(fallbackModels);
          setSelectedModel(fallbackModels[0].id);
          setError('No models available from the API. Using fallback model for UI display.');
        }
      } catch (err) {
        console.error('Error getting models:', err);
        
        // Create a fallback model on error
        const fallbackModels = [
          { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Fallback)", provider: "Google" }
        ];
        
        setModels(fallbackModels);
        setSelectedModel(fallbackModels[0].id);
        setError(`Error fetching models: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [setModels, setLoading, setError, selectedModel, setSelectedModel]);

  return null;
}