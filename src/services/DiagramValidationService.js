// src/services/DiagramValidationService.js
import ImageCompressionService from './ImageCompressionService';

class DiagramValidationService {
  constructor() {
    // Base URL for API calls
    this.baseUrl = this.getBaseUrl();
  }

  // Get the base URL for API calls
  getBaseUrl() {
    // Use current origin for production
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback for development or SSR
    return import.meta.env.DEV ? 'http://localhost:3000' : '';
  }

  // Convert image to base64
  async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result;
        // Extract the base64 part (remove the data:image/xxx;base64, prefix)
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Validate if the image contains a class diagram
  async validateDiagram(file) {
    let modelName = 'gemini-2.0-flash'; // Default model name
    try {
      if (!file) {
        throw new Error("Missing file");
      }

      console.log("Validating image with model:", modelName);
      
      // Compress the image if it's too large
      let processedFile = file;
      if (ImageCompressionService.needsCompression(file, 1)) {
        console.log(`Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds threshold, compressing...`);
        try {
          processedFile = await ImageCompressionService.compressImage(file, {
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 0.7
          });
          console.log(`Compressed image size: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (compressionError) {
          console.error("Error compressing image:", compressionError);
          // Continue with original file if compression fails
          console.log("Continuing with original file...");
        }
      }
      
      // Convert image to base64
      const base64 = await this.imageToBase64(processedFile);
      
      // Call the validation API endpoint
      const response = await fetch(`${this.baseUrl}/api/validate-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName,
          imageBase64: base64,
          mimeType: processedFile.type
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server returned ${response.status}: ${errorText}`);
        
        // If still getting payload too large error after compression
        if (response.status === 413) {
          // Try a more aggressive compression
          if (processedFile.size > 500 * 1024) { // If still larger than 500KB
            console.log("Attempting more aggressive compression...");
            try {
              const aggressivelyCompressed = await ImageCompressionService.compressImage(file, {
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.5
              });
              
              // Try again with the smaller image
              const smallerBase64 = await this.imageToBase64(aggressivelyCompressed);
              const retryResponse = await fetch(`${this.baseUrl}/api/validate-diagram`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  modelName,
                  imageBase64: smallerBase64,
                  mimeType: aggressivelyCompressed.type
                }),
              });
              
              if (!retryResponse.ok) {
                throw new Error(`Second attempt failed: ${retryResponse.status}`);
              }
              
              const retryResult = await retryResponse.json();
              return retryResult.isClassDiagram;
            } catch (retryError) {
              console.error("Error in second compression attempt:", retryError);
              // If we still can't validate, assume it's a valid diagram and let the main process continue
              console.log("Skipping validation due to size constraints");
              return true;
            }
          } else {
            // If we've already tried compression and still getting errors, skip validation
            console.log("Skipping validation due to size constraints");
            return true;
          }
        }
        
        throw new Error(errorText || `Server returned ${response.status}`);
      }

      const result = await response.json();
      return result.isClassDiagram;
    } catch (error) {
      console.error('Error validating image:', error);
      // In case of errors, we'll allow the process to continue
      // This prevents blocking the user due to validation issues
      return true;
    }
  }
}

export default new DiagramValidationService();