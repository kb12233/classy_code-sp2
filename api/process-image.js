// api/process-image.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';

// Initialize API clients based on provider
const initClient = (provider) => {
  switch (provider) {
    case 'google':
      return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    case 'groq':
      return new Groq({ apiKey: process.env.GROQ_API_KEY });
    case 'openai':
      return new OpenAI({ 
        baseURL: "https://models.inference.ai.azure.com", 
        apiKey: process.env.GITHUB_TOKEN 
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

// Get the provider for a model
const getProviderForModel = (modelName) => {
  if (modelName.startsWith('gemini')) {
    return 'google';
  } else if (modelName.startsWith('meta-llama')) {
    return 'groq';
  } else if (modelName === 'gpt-4o') {
    return 'openai';
  } else {
    throw new Error(`Unsupported model: ${modelName}`);
  }
};

// Process image with Google Gemini
async function processWithGemini(model, prompt, imageBase64, mimeType) {
  const client = initClient('google');
  const genModel = client.getGenerativeModel({ model });
  
  const image = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };
  
  const response = await genModel.generateContent([prompt, image]);
  return response.response.text();
}

// Process image with Groq (Llama)
async function processWithGroq(model, prompt, imageDataUrl) {
  const client = initClient('groq');
  
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });
  
  return response.choices[0].message.content;
}

// Process image with OpenAI
async function processWithOpenAI(model, prompt, imageDataUrl) {
  const client = initClient('openai');
  
  const response = await client.chat.completions.create({
    model,
    messages: [
      { 
        role: "system", 
        content: "You are a helpful assistant that specializes in converting UML diagrams to PlantUML notation." 
      },
      { 
        role: "user", 
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: {
              url: imageDataUrl, 
              detail: "high"
            }
          }
        ]
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });
  
  return response.choices[0].message.content;
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

    const provider = getProviderForModel(modelName);
    
    // The prompts for the model
    const promptBasic = `Convert this UML class diagram to PlantUML notation. Provide only the raw PlantUML notation (no markdown code blocks).`;

    const promptDetailed = `Given the image of a UML class diagram provided, can you accurately convert it into PlantUML notation, ensuring fidelity to the original structure and relationships between classes? Please pay close attention to attributes, methods, and their respective visibilities. Provide only the raw PlantUML notation (no markdown code blocks).`;

    const promptSpecific = `
      Given the image of a UML class diagram provided, faithfully translate it into PlantUML notation that is fully compatible with a standard PlantUML transpiler. Your translation should:

      1. Begin with @startuml and end with @enduml
      2. Preserve all class relationships, including:
        - Inheritance: Child --|> Parent
        - Implementation: Class ..|> Interface
        - Association: ClassA --> ClassB
        - Aggregation: Container o--> Element
        - Composition: Container *--> Element
        - Dependency: Client ..> Service
      3. Accurately represent attributes and methods with their access modifiers:
        - +publicAttr: Type
        - -privateAttr: Type
        - #protectedAttr: Type
        - ~packageAttr: Type
      4. Define methods with parameters and return types:
        - +publicMethod(param: Type): ReturnType
      5. Use these modifiers in curly braces where needed:
        - {abstract}, {static}, {final}
      6. For constructors: +ClassName(param: Type)
      7. Define packages where appropriate: package packageName { ... }
      8. For generics use angle brackets: class List<T> { }

      Important style guidelines:
      - Do not surround class names in quotes
      - Use camelCase for compound class names
      - Maintain the integrity and structure of the original diagram
      - Provide only the raw PlantUML notation (no markdown code blocks)

      Your response should be a clear, coherent, and accurate representation of the diagram that can be directly used with a PlantUML transpiler.
    `;

    const prompt = promptBasic;

    let plantUML;

    // Process based on the provider
    if (provider === 'google') {
      plantUML = await processWithGemini(modelName, prompt, imageBase64, mimeType);
    } else if (provider === 'groq') {
      // For Groq, we need the full data URL
      const dataUrl = `data:${mimeType};base64,${imageBase64}`;
      plantUML = await processWithGroq(modelName, prompt, dataUrl);
    } else if (provider === 'openai') {
      // For OpenAI, we need the full data URL
      const dataUrl = `data:${mimeType};base64,${imageBase64}`;
      plantUML = await processWithOpenAI(modelName, prompt, dataUrl);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    res.status(200).json({ plantUML });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: error.message || 'Failed to process image' });
  }
}