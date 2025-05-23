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

  console.log("API keys available:", {
    Gemini: hasGeminiKey,
    Groq: hasGroqKey,
    OpenAI: hasOpenAIKey
  });

  // Base list of all models
  const allModels = [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", available: hasGeminiKey },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", available: hasGeminiKey },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", available: hasGeminiKey },
    { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", provider: "Groq", available: hasGroqKey },
    { id: "meta-llama/llama-4-maverick-17b-128e-instruct", name: "Llama 4 Maverick", provider: "Groq", available: hasGroqKey },
    { id: "gpt-4o", name: "GPT-4o", provider: "GitHub", available: hasOpenAIKey }
  ];

  // Filter to only include available models (where the API key is set)
  const availableModels = allModels.filter(model => model.available);
  
  // Remove the 'available' property from the response
  const models = availableModels.map(({ id, name, provider }) => ({ id, name, provider }));

  // If no models are available, include at least one default model to prevent frontend errors
  if (models.length === 0) {
    models.push({ id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" });
  }

  res.status(200).json({ models });
}