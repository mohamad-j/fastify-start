# Fastify Full-Stack Starter

A modern, production-ready full-stack web application starter built with **Fastify** (backend) and **Vite** (frontend build tool). Features a powerful CLI for rapid development and scaffolding.

## 🚀 Features

### Backend (Fastify)
- ⚡ **High Performance**: Built on Fastify - one of the fastest Node.js frameworks
- 🔐 **Authentication & Authorization**: Route guards and middleware system
- 📊 **Validation**: JSON Schema-based request validation with AJV
- 🔧 **Dependency Injection**: Clean architecture with DI container
- 📁 **Plugin Architecture**: Modular and extensible plugin system
- 🎯 **Auto-loading**: Automatic route and plugin discovery
- 📝 **Template Engine**: Nunjucks for server-side rendering
- 🔍 **Logging**: Built-in request logging and error handling

### Frontend (Multi-App Architecture)
- 📦 **Multi-App Support**: Multiple independent frontend applications
- ⚡ **Vite Build System**: Fast development and optimized production builds
- 🎨 **Vue.js Support**: Optional Vue.js integration with CLI scaffolding
- 💅 **SCSS Support**: Advanced styling with Sass/SCSS
- 📱 **TypeScript Ready**: Full TypeScript support for type-safe development
- 🔄 **Hot Module Replacement**: Instant updates during development
- 🎯 **Component Architecture**: Reusable component system

### CLI Tool (`fa`)
- 🏗️ **Code Generation**: Scaffold apps, routes, services, plugins, and more
- 🚀 **Development Server**: Integrated dev server management
- 📦 **Build Management**: Streamlined build process for all apps
- 📋 **Project Overview**: List and manage project components
- 🎛️ **Configurable**: Multiple options for different use cases

## 📋 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd fastify-start
   npm run install:all
   ```

2. **Link the CLI Tool**
   ```bash
   npm run cli:link
   ```

3. **Start Development**
   ```bash
   # Start both frontend and backend
   fa serve
   
   # Or separately
   fa serve --backend    # Backend only
   fa serve --frontend   # Frontend only
   ```

4. **Visit Your App**
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:5173 (Vite dev server)

## 🏗️ Project Structure

```
fastify-start/
├── 📄 package.json                 # Root package (frontend deps & CLI)
├── ⚙️ vite.config.js              # Vite configuration
├── 📚 CLI-README.md               # CLI documentation
├── 🛠️ bin/                        # CLI tool
│   ├── fastify-start.js           # CLI entry point
│   ├── commands/                  # CLI commands
│   └── generators/                # Code generators
├── 🎨 frontend/
│   ├── apps/
│   │   ├── main/                  # Default app
│   │   ├── about/                 # About page app
│   │   └── [generated-apps]/      # Your generated apps
│   └── shared-components/         # Reusable components
└── ⚡ backend/
    ├── 📄 package.json           # Backend dependencies
    ├── 🚀 index.js               # Server entry point
    ├── 🛣️ routes/                # API routes
    ├── 🔌 plugins/               # Fastify plugins
    ├── ⚙️ services/              # Business logic
    ├── 🔧 middleware/            # Custom middleware
    ├── 🛡️ guards/                # Auth guards
    ├── 💉 di/                    # Dependency injection
    ├── 🎭 views/                 # Nunjucks templates
    └── 📁 public/                # Static files & built apps
```

## 🎯 Usage Guide

### CLI Commands (`fa`)

#### Generate Components
```bash
# Frontend Apps (creates frontend + backend integration)
fa g app Dashboard --vuejs --scss     # Vue.js app with SCSS + Nunjucks template + route
fa g app AdminPanel --typescript      # TypeScript app + backend integration

# Backend Components
fa g route users --crud --auth        # CRUD route with auth
fa g service UserService --database   # Service with DB examples
fa g plugin logger --decorators       # Plugin with decorators
fa g middleware cors --async          # Async middleware
fa g guard admin --role-based         # Role-based guard
```

#### Development & Build
```bash
fa serve                              # Start both servers
fa serve --backend --port 4000        # Backend on port 4000
fa serve --frontend --app Dashboard   # Specific frontend app
fa build --app Dashboard              # Build specific app
fa build --production                 # Production build
fa list                              # View all components
fa docs list                         # List API endpoints
fa docs open                         # Open docs in browser
fa docs generate                     # Generate documentation files
```

### Backend Development

#### Creating Routes
Routes are automatically loaded from `backend/routes/`. Each route file exports a Fastify plugin:

```javascript
// backend/routes/users.route.js
export default async function (app) {
  app.get('/users', async (request, reply) => {
    return { users: [] };
  });
}
```

#### Using Services with DI
```javascript
// In your route
export default async function (app) {
  app.get('/users', async (request, reply) => {
    const userService = request.di.resolve('UserService');
    const users = await userService.findAll();
    return { users };
  });
}
```

#### Adding Authentication
```javascript
import { authGuard } from '../guards/auth.guard.js';

export default async function (app) {
  app.get('/protected', { preHandler: authGuard }, async (request, reply) => {
    return { user: request.user };
  });
}
```

### Frontend Development

#### Multiple Apps
Each app in `frontend/apps/` is independent:
- Build separately: `fa build --app AppName`
- Serve separately: `fa serve --frontend --app AppName`
- Different frameworks: Mix Vue.js, vanilla JS, TypeScript

#### Vite Configuration
The `vite.config.js` supports multi-app builds:
```bash
# Build specific app
npm_config_src=Dashboard npm run build:frontend

# Or use CLI
fa build --app Dashboard
```

## 🔧 Configuration

### Environment Variables
Create `.env` files for configuration:

```bash
# Backend (.env or backend/.env)
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...

# Frontend
VITE_API_URL=http://localhost:3000
```

### Backend Configuration
```javascript
// backend/index.js
const app = Fastify({ 
  logger: true,
  // Add your Fastify options
});
```

### Frontend Configuration
```javascript
// vite.config.js - already configured for multi-app support
export default defineConfig({
  // Automatically handles app switching via npm_config_src
});
```

## 📦 Dependencies

### Root Package (Frontend)
- **Vite**: Build tool and dev server
- **Vue.js**: Frontend framework (optional)
- **SCSS**: Styling preprocessor
- **Commander**: CLI framework
- **Chalk**: Terminal colors

### Backend Package
- **Fastify**: Web framework
- **@fastify/autoload**: Auto-load plugins and routes
- **@fastify/static**: Static file serving
- **AJV**: JSON schema validation
- **Nunjucks**: Template engine
- **Nodemon**: Development auto-restart

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm ci --production
npm start
```

### Frontend Deployment
```bash
# Build all apps
fa build --production

# Deploy built files from backend/public/views/
# Each app is in its own subdirectory
```

### Docker Support
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ ./
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development Workflow

### 1. Create a New Feature
```bash
# Generate full-stack app (frontend + backend template + route)
fa g app UserDashboard --vuejs --scss

# Generate backend API
fa g route users --crud --auth --validation

# Generate service layer
fa g service UserService --singleton --database

# Generate authentication
fa g guard jwt --role-based
```

### 2. Development
```bash
# Start development servers
fa serve

# In separate terminals:
fa serve --backend     # API development
fa serve --frontend    # UI development
```

### 3. Testing & Building
```bash
# List all components
fa list

# Build for production
fa build --production

# Test specific app
fa serve --frontend --app UserDashboard
```

## 📖 API Documentation

### Interactive Documentation
The project includes a built-in API documentation system accessible at `/docs` when the backend is running:

```bash
fa serve --backend
# Open http://localhost:3000/docs
```

### CLI Documentation Commands
```bash
fa docs list                         # List all available endpoints
fa docs open                         # Open docs in browser  
fa docs generate                     # Generate HTML/JSON docs
fa docs test                         # Test endpoint availability
```

### Documentation Features
- **Interactive HTML Interface**: Clean, responsive documentation UI
- **Authentication Details**: Shows which endpoints require auth
- **Request/Response Examples**: Sample data for all endpoints
- **JSON Export**: Programmatic access to API documentation
- **CLI Integration**: Manage docs directly from command line

### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "...", "uptime": 123.45 }
```

### API Information
```
GET /info  
Response: { "name": "Fastify Starter API", "version": "1.0.0", "documentation": "/docs" }
```

### Products API
All product endpoints require authentication (`Authorization: Bearer token`):
- `GET /products` - List products with pagination
- `GET /products/:id` - Get specific product
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Generate components with CLI: `fa g route myFeature --crud`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**CLI not found:**
```bash
npm run cli:link
```

**Build errors:**
```bash
npm run install:all
fa list  # Check component status
```

**Port conflicts:**
```bash
fa serve --backend --port 4000
```

### Getting Help
- Check `CLI-README.md` for detailed CLI documentation
- Use `fa --help` for command reference
- Use `fa g --help` for generation options

## 🎉 What's Next?

- [ ] Add database migrations CLI
- [ ] Add testing scaffolding
- [ ] Add Docker compose setup
- [ ] Add deployment scripts
- [x] ✅ Add API documentation generation

---

**Happy coding! 🚀**

Built with ❤️ using Fastify, Vite, and modern web technologies.
