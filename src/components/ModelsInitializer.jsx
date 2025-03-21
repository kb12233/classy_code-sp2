import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  modelsAtom, 
  modelsLoadingAtom, 
  modelsErrorAtom, 
  selectedModelAtom 
} from '../atoms';

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
        const response = await fetch('http://localhost:5000/models');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          
          // Set default model if not already set
          if (!selectedModel) {
            setSelectedModel(data.models[0].id);
          }
        } else {
          setError('No models available');
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [setModels, setLoading, setError, selectedModel, setSelectedModel]);

  return null;
}