// src/services/ModelsService.js
// This service provides the available models for AI processing via Vercel API

class ModelsService {
  constructor() {
    // Base URL for API calls - will be automatically determined based on environment
    this.baseUrl = this.getBaseUrl();
  }

  // Get the base URL for API calls
  getBaseUrl() {
    // In production, use the current origin
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback for development or SSR
    return import.meta.env.DEV ? 'http://localhost:3000' : '';
  }

  // Get all available models from the API
  async getAvailableModels() {
    try {
      // Add .js extension to the API endpoint
      console.log("Fetching models from:", `${this.baseUrl}/api/models.js`);
      
      const response = await fetch(`${this.baseUrl}/api/models.js`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error(`Failed to fetch models: ${response.status}. Response:`, text);
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Models fetched successfully:", data);
      return data;
    } catch (error) {
      console.error('Error fetching models:', error);
      // Return a default structure with an empty array to prevent further errors
      return { models: [] };
    }
  }
}

export default new ModelsService();