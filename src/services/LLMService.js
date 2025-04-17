// src/services/LLMService.js
// This service handles API calls to Vercel Edge Functions

class LLMService {
    constructor() {
      // Base URL for API calls - will be automatically determined based on environment
      this.baseUrl = this.getBaseUrl();
    }
  
    // Get the base URL for API calls
    getBaseUrl() {
      // In production, the API endpoints are relative to the current domain
      // In development, we need to specify localhost with the correct port
      if (import.meta.env.DEV) {
        return 'http://localhost:3000'; // Default Vercel dev server port
      }
      return ''; // Empty string means relative to current domain
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
  
    // Process image with the selected model using our Vercel API
    async processImage(file, modelName) {
      try {
        if (!file || !modelName) {
          throw new Error("Missing file or model name");
        }
  
        // Convert image to base64
        const base64 = await this.imageToBase64(file);
        
        // Call our Vercel API endpoint
        const response = await fetch(`${this.baseUrl}/api/process-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modelName,
            imageBase64: base64,
            mimeType: file.type
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server returned ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error processing image:', error);
        throw error;
      }
    }
  }
  
  export default new LLMService();