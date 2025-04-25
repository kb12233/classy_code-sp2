# ClassyCode


ClassyCode is an AI-powered web application that transforms UML class diagrams into functional code. Upload an image of your UML class diagram, and ClassyCode will convert it into proper PlantUML notation and then generate code in your preferred programming language.

## ✨ Features

- **AI-Powered UML Recognition**: Upload any UML class diagram image and get accurate PlantUML notation
- **Multi-Model Support**: Choose from various AI models including:
    - Google Gemini (1.5 Pro, 1.5 Flash, 2.0 Flash)
    - Meta Llama models (via Groq)
    - GPT-4o (via GitHub)
- **Code Generation**: Convert PlantUML to code in multiple languages:
    - Java
    - Python
    - C#
    - Ruby
    - Kotlin
    - TypeScript
- **Real-time Editing**: Edit the generated PlantUML in a live editor with instant preview
- **History Tracking**: Save and manage your diagram conversion history
- **Secure Authentication**: User accounts with Appwrite authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser
- Appwrite account (for backend services)
- API keys for AI services:
    - Google Gemini API key
    - Groq API key
    - GitHub token (for GPT-4o access)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/classycode.git
cd classycode
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Appwrite Configuration
VITE_ENDPOINT=your_appwrite_endpoint
VITE_PROJECT_ID=your_project_id
VITE_DATABASE_ID=your_database_id
VITE_HISTORY_COLLECTION_ID=your_collection_id
VITE_IMAGES_BUCKET_ID=your_images_bucket_id

# AI Service API Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS, Material-UI
- **State Management**: Jotai
- **Authentication**: Appwrite
- **AI Services**: Google Gemini, Groq (Llama), OpenAI (GPT-4o)
- **Code Generation**: PlantUML Transpiler
- **Deployment**: Vercel

## 📖 Usage

1. **Sign Up/Login**: Create an account or log in to your existing account
2. **Upload Diagram**: Click "Browse File" to upload a UML class diagram image
3. **Select Model**: Choose your preferred AI model for diagram recognition
4. **Generate PlantUML**: The system will automatically convert your diagram to PlantUML notation
5. **Edit (Optional)**: Modify the PlantUML code if needed in the live editor
6. **Generate Code**: Select your target programming language and click "Generate"
7. **Save/Export**: Save your work or export the generated code

## 🖼️ Supported Diagram Types

ClassyCode supports standard UML class diagrams with:

- Classes with attributes and methods
- Access modifiers (+, -, #, ~)
- Inheritance relationships (--|>)
- Interface implementations (..|>)
- Associations (-->)
- Aggregations (o--)
- Compositions (*--)
- Dependencies (..>)

## 🔧 Development

### Project Structure

```
classycode/
├── api/                    # Vercel Edge functions
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # React components
│   ├── services/          # API and service classes
│   ├── utils/             # Utility functions
│   ├── appwrite/          # Appwrite configuration
│   └── atoms.js           # Jotai state atoms
├── public/                # Public assets
└── vercel.json           # Vercel configuration
```

### Key Components

- **UploadImageSection**: Handles image upload and validation
- **UMLPreview**: Displays and allows editing of PlantUML code
- **CodeGeneratedSection**: Shows the generated code output
- **AppBar**: Navigation and model selection
- **SideBar**: History management

## 🚀 Deployment

The application is configured for deployment on Vercel with the following setup:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the required environment variables in Vercel's dashboard
4. Deploy!

The `vercel.json` configuration handles routing for both the frontend and API functions.

## 🙏 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/kb12233/classy_code-sp2?tab=MIT-1-ov-file) file for details.

## 👥 Authors

- Ashley Moriah Lazaraga - [AshleyMoriahLazaraga](https://github.com/AshleyMoriahLazaraga)
- Karl Brandon Ocfemia - [kb12233](https://github.com/kb12233)
- Mikka Ella Quiton - [Kaelaquiton](https://github.com/Kaelaquiton)
	
## 🌟 Acknowledgments

- [PlantUML](https://plantuml.com/) for the amazing diagramming tool
- [Appwrite](https://appwrite.io/) for backend services
- All the AI providers for their powerful models
- The open-source community for the various libraries used

---

Made with ❤️ by the ClassyCode team
