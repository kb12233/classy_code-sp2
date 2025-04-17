// src/services/ModelsService.js
// This service provides the available models for AI processing via Vercel API

class ModelsService {
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
  
    // Get all available models from the API
    async getAvailableModels() {
      try {
        const response = await fetch(`${this.baseUrl}/api/models`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching models:', error);
        return { models: [] };
      }
    }
  }
  
  export default new ModelsService();