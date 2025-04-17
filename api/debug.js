// api/debug.js
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

  // Return environment variable information (without the actual values for security)
  const envInfo = {
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasOpenAIKey: !!process.env.GITHUB_TOKEN,
    hasAppwriteConfig: !!(
      process.env.VITE_ENDPOINT &&
      process.env.VITE_PROJECT_ID &&
      process.env.VITE_DATABASE_ID &&
      process.env.VITE_HISTORY_COLLECTION_ID &&
      process.env.VITE_IMAGES_BUCKET_ID
    ),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    deploymentUrl: process.env.VERCEL_URL || 'Not available'
  };

  res.status(200).json({ 
    status: 'ok',
    message: 'Debug API is working correctly',
    environment: envInfo,
    timestamp: new Date().toISOString()
  });
}