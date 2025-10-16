# SkillBhasha - AI-Powered Multilingual Skill Training Platform

A comprehensive skill training platform with integrated Gemini AI for content generation, translation, and learning assistance.

## 🚀 Features

### AI-Powered Content Generation
- **Gemini AI Integration**: Real-time content generation using Google's Gemini API
- **Multilingual Support**: Generate content in multiple Indian and international languages
- **Domain-Specific Training**: Content tailored for various industries (Solar, Construction, Healthcare, etc.)
- **Difficulty Levels**: Beginner, Intermediate, and Advanced content generation
- **Content Types**: Text, Video scripts, Interactive quizzes, and more

### Smart Chatbot
- **AI Learning Assistant**: Powered by Gemini AI for intelligent responses
- **Context-Aware**: Understands training content and provides relevant assistance
- **Quick Actions**: Translation, course summaries, learning tips, and help
- **Voice Support**: Text-to-speech and voice input capabilities

### Content Management
- **AI Content Creator**: Generate training modules with AI assistance
- **Translation Services**: Real-time translation between languages
- **Quiz Generation**: AI-powered assessment creation
- **Content Summarization**: Automatic content summarization

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Express.js, Node.js
- **AI Integration**: Google Gemini API
- **UI Components**: Radix UI, Lucide React
- **State Management**: React Hooks
- **Build Tools**: Vite, TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:Darshan2139/SkillBhasha-deploye-ai.git
cd SkillBhasha-deploye-ai
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PING_MESSAGE=SkillBhasha AI Server is running
PORT=3000
```

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in your `.env` file

### 5. Run the Development Server

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
SkillBhasha 2/
├── client/                 # React frontend
│   ├── components/         # UI components
│   │   ├── ai/            # AI-related components
│   │   ├── chat/          # Chatbot components
│   │   ├── trainer/       # Training modules
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utilities and API services
│   ├── pages/             # Route components
│   └── hooks/             # Custom React hooks
├── server/                # Express backend
│   ├── routes/            # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and services
│   ├── api.ts             # API interfaces
│   └── gemini.ts          # Gemini AI service
└── public/                # Static assets
```

## 🔧 API Endpoints

### AI Content Generation
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/translate` - Translate text
- `POST /api/ai/generate-quiz` - Generate quiz questions
- `POST /api/ai/summarize` - Summarize content

### General
- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint

## 🎯 Usage

### AI Content Generation

1. **Select a Template**: Choose from predefined content templates
2. **Configure Settings**: Set language, domain, and difficulty level
3. **Enter Prompt**: Describe what content you want to generate
4. **Generate**: Click generate to create AI-powered content
5. **Review & Edit**: Review the generated content and make edits as needed

### Chatbot Features

1. **Open Chat**: Click the chat widget in the bottom-right corner
2. **Ask Questions**: Type your questions about training content
3. **Quick Actions**: Use predefined actions for common tasks
4. **Voice Input**: Use voice input for hands-free interaction

### Translation Services

1. **Select Text**: Choose text to translate
2. **Choose Language**: Select target language
3. **Translate**: Get instant AI-powered translation
4. **Review**: Review and edit translated content

## 🌐 Supported Languages

- English (en)
- Hindi (hi)
- Tamil (ta)
- Bengali (bn)
- Marathi (mr)
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Portuguese (pt)

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run type checking
npm run typecheck
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PING_MESSAGE` | Server ping message | No |
| `PORT` | Server port | No (default: 3000) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Darshan2139/SkillBhasha-deploye-ai/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Roadmap

- [ ] User authentication and authorization
- [ ] Progress tracking and analytics
- [ ] Advanced AI features (image generation, video processing)
- [ ] Mobile app development
- [ ] Offline support
- [ ] Multi-tenant architecture

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- React and Vite teams for excellent development tools
- Radix UI for accessible component library
- All contributors and testers

---

**Made with ❤️ for skill development and learning**
