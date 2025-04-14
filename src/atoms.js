// src/atoms.js
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Existing atom for PlantUML code
export const plantUmlCodeAtom = atom("");

// Store selected model in localStorage for persistence
export const selectedModelAtom = atomWithStorage('selectedModel', '');

// Available models
export const modelsAtom = atom([]);

// Loading state for models
export const modelsLoadingAtom = atom(true);

// Error state for models
export const modelsErrorAtom = atom(null);

// Grouped models by provider
export const groupedModelsAtom = atom((get) => {
  const models = get(modelsAtom);
  return models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {});
});

// Selected language for code generation
export const selectedLanguageAtom = atomWithStorage('selectedLanguage', 'java');

// Generated code
export const generatedCodeAtom = atom('');

// Loader atom for any async operations
export const loadingOperationAtom = atom(false);

// Image upload state
export const uploadedImageAtom = atom(null);

// Processing error
export const processingErrorAtom = atom('');

// Convenience derived atom for readable model name
export const readableModelNameAtom = atom((get) => {
  const modelId = get(selectedModelAtom);
  if (!modelId) return 'default model';
  
  if (modelId.startsWith('gemini')) {
    return modelId.replace('gemini-', 'Gemini ');
  } else if (modelId.startsWith('llama')) {
    return modelId.replace('llama-', 'Llama ').replace('-vision-preview', '');
  }
  
  return modelId;
});

export const historyAtom = atom([]);
export const selectedHistoryAtom = atom(null);
export const uploadedFileNameAtom = atom("");
 
export const historyDataAtom = atom([]);
export const historyLoadingAtom = atom(false);
export const selectedHistoryItemAtom = atom(null);

export const imageUploadLoadingAtom = atom(false);

export const fileObjectAtom = atom(null); 