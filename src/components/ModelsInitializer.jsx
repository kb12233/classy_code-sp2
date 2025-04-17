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
        
        // Use the ModelsService instead of making an API call
        const data = await ModelsService.getAvailableModelsWithValidCredentials();
        
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          
          // Set default model if not already set
          if (!selectedModel) {
            setSelectedModel(data.models[0].id);
          }
        } else {
          setError('No models available. Please check your API keys in environment variables.');
        }
      } catch (err) {
        console.error('Error getting models:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [setModels, setLoading, setError, selectedModel, setSelectedModel]);

  return null;
}