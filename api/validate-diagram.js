// api/validate-diagram.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate image with Google Gemini
async function validateWithGemini(model, prompt, imageBase64, mimeType) {
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const genModel = client.getGenerativeModel({ model });
  
  const image = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };
  
  const response = await genModel.generateContent([prompt, image]);
  const result = response.response.text().trim().toLowerCase();
  return result === 'yes';
}


export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelName, imageBase64, mimeType } = req.body;
    
    if (!modelName || !imageBase64) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // The prompt for validation - designed to get a simple yes/no response
    const prompt = `
      Look at the image provided and answer with ONLY a single word - "yes" or "no":
      Does this image contain a UML class diagram?
      
      A UML class diagram typically contains:
      - Rectangles representing classes with class names at the top
      - Sections for attributes/fields and methods
      - Connector lines showing relationships between classes (inheritance, association, etc.)
      - May include access modifiers (+, -, #)
      
      Answer only "yes" or "no".
    `;

    let isClassDiagram = false;

    // Validate using Gemini model
    isClassDiagram = await validateWithGemini(modelName, prompt, imageBase64, mimeType);

    res.status(200).json({ isClassDiagram });
  } catch (error) {
    console.error('Error validating image:', error);
    res.status(500).json({ error: error.message || 'Failed to validate image', isClassDiagram: false });
  }
}