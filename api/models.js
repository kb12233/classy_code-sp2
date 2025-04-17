// api/models.js
export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    // Check if required environment variables are set to determine which models are available
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasOpenAIKey = !!process.env.GITHUB_TOKEN;
  
    // Base list of all models
    const allModels = [
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", available: hasGeminiKey },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", available: hasGeminiKey },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", available: hasGeminiKey },
      { id: "llama-3.2-11b-vision-preview", name: "Llama 3.2 11B Vision", provider: "Groq", available: hasGroqKey },
      { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision", provider: "Groq", available: hasGroqKey },
      { id: "gpt-4o", name: "GPT-4o", provider: "GitHub", available: hasOpenAIKey }
    ];
  
    // Filter to only include available models (where the API key is set)
    const availableModels = allModels.filter(model => model.available);
    
    // Remove the 'available' property from the response
    const models = availableModels.map(({ id, name, provider }) => ({ id, name, provider }));
  
    res.status(200).json({ models });
  }