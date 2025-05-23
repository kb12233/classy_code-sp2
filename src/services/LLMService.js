// src/services/LLMService.js
// This service handles API calls to Vercel Edge Functions

class LLMService {
  constructor() {
    // Base URL for API calls - will be automatically determined based on environment
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

  // Process image with the selected model using our Vercel API
  async processImage(file, modelName) {
    try {
      if (!file || !modelName) {
        throw new Error("Missing file or model name");
      }

      console.log("Processing image with model:", modelName);
      console.log("API Endpoint:", `${this.baseUrl}/api/process-image`);

      // Convert image to base64
      const base64 = await this.imageToBase64(file);
      
      // Call our Vercel API endpoint with .js extension
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
        const errorText = await response.text();
        console.error(`Server returned ${response.status}: ${errorText}`);
        throw new Error(errorText || `Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }
}

export default new LLMService();