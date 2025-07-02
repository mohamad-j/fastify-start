# Fastify App CLI (fa)

A powerful CLI tool for scaffolding and managing your Fastify full-stack application with frontend apps, backend routes, plugins, services, and more.

## Installation

The CLI is already linked to your project. If you need to reinstall:

```bash
npm run cli:link
```

To unlink:
```bash
npm run cli:unlink
```

## Commands

### Generate Components (`fa generate` or `fa g`)

#### 🏗️ Generate Frontend Apps

Create new frontend applications with various configurations. **Automatically creates:**
- Frontend app structure in `frontend/apps/AppName/`
- Nunjucks template in `backend/views/pages/appname.njk`
- Backend route in `backend/routes/appname.route.js`

```bash
# Basic vanilla JavaScript app
fa g app MyApp

# Vue.js app with SCSS
fa g app Dashboard --vuejs --scss

# TypeScript app
fa g app AdminPanel --typescript

# Vue.js + TypeScript + SCSS
fa g app ComplexApp --vuejs --typescript --scss
```

**Generated Files:**
- `frontend/apps/AppName/` - Complete frontend application
- `backend/views/pages/appname.njk` - Server-side template
- `backend/routes/appname.route.js` - Route to serve the app
- Access at: `http://localhost:3000/appname`

**Options:**
- `--vuejs`: Create a Vue.js application
- `--vanilla`: Create a vanilla JavaScript app (default)
- `--typescript`: Use TypeScript
- `--scss`: Include SCSS support

#### 🛣️ Generate Backend Routes

Create RESTful API routes with authentication and validation:

```bash
# Basic route
fa g route posts

# CRUD route with authentication and validation
fa g route users --crud --auth --validation

# Route with just authentication
fa g route admin --auth
```

**Options:**
- `--crud`: Generate full CRUD operations (GET, POST, PUT, DELETE)
- `--auth`: Add authentication guard
- `--validation`: Add request validation schemas

#### 🔌 Generate Fastify Plugins

Create reusable Fastify plugins:

```bash
# Basic plugin
fa g plugin logger

# Encapsulated plugin with decorators
fa g plugin database --encapsulated --decorators
```

**Options:**
- `--encapsulated`: Create encapsulated plugin (isolated context)
- `--decorators`: Add request/reply/app decorators

#### ⚙️ Generate Services

Create service classes for business logic:

```bash
# Basic service
fa g service EmailService

# Service with database integration and DI registration
fa g service UserService --singleton --database
```

**Options:**
- `--singleton`: Register as singleton in DI container
- `--database`: Include database connection examples

#### 🔧 Generate Middleware

Create custom middleware functions:

```bash
# Synchronous middleware
fa g middleware cors

# Asynchronous middleware
fa g middleware rateLimit --async
```

**Options:**
- `--async`: Create async middleware

#### 🛡️ Generate Guards

Create authentication/authorization guards:

```bash
# Basic authentication guard
fa g guard api

# Role-based authorization guard
fa g guard admin --role-based
```

**Options:**
- `--role-based`: Add role-based authorization

### Development Server (`fa serve` or `fa s`)

Start development servers with various configurations:

```bash
# Start both frontend and backend servers
fa serve

# Start only backend
fa serve --backend

# Start only frontend
fa serve --frontend

# Start specific frontend app
fa serve --frontend --app Dashboard

# Start backend on custom port
fa serve --backend --port 4000
```

### Build Project (`fa build` or `fa b`)

Build your frontend applications:

```bash
# Build all frontend apps
fa build

# Build specific app
fa build --app Dashboard

# Production build
fa build --production
```

### List Components (`fa list` or `fa ls`)

View all components in your project:

```bash
# List all components
fa list

# List only frontend apps
fa list --apps

# List only routes
fa list --routes

# List only plugins
fa list --plugins

# List only services
fa list --services
```

## Project Structure

After using the CLI, your project will have this structure:

```
project-root/
├── package.json                    # Frontend dependencies and scripts
├── vite.config.js                  # Vite configuration
├── bin/                            # CLI tool files
│   ├── fastify-start.js           # Main CLI entry point
│   ├── commands/                   # CLI commands
│   └── generators/                 # Code generators
├── frontend/
│   ├── apps/
│   │   ├── main/                  # Default app
│   │   ├── about/                 # About app
│   │   └── [YourApp]/             # Generated apps
│   └── shared-components/
└── backend/
    ├── package.json               # Backend dependencies
    ├── index.js                   # Server entry point
    ├── routes/                    # API routes
    ├── plugins/                   # Fastify plugins
    ├── services/                  # Business logic services
    ├── middleware/                # Custom middleware
    ├── guards/                    # Authentication/authorization
    └── di/                        # Dependency injection
```

## Generated File Examples

### Frontend App Structure (Vue.js)
```
frontend/apps/MyApp/
├── index.js                       # App entry point
├── App.vue                        # Main Vue component
├── components/
│   └── HelloWorld.vue            # Sample component
├── styles/
│   └── main.scss                 # App styles
└── assets/                       # Static assets
```

### Backend Route (CRUD)
```javascript
export default async function (app) {
  // GET /users - List all users
  app.get('/users', { preHandler: authGuard }, async (request, reply) => {
    // Pagination, filtering, etc.
  });

  // POST /users - Create user
  app.post('/users', { 
    preHandler: authGuard, 
    schema: createUserSchema 
  }, async (request, reply) => {
    // User creation logic
  });

  // PUT /users/:id - Update user
  // DELETE /users/:id - Delete user
}
```

## Tips

1. **Frontend Apps**: Each app is independent and can be built/served separately
2. **Backend Integration**: Routes automatically integrate with your DI container
3. **Authentication**: Guards provide reusable auth logic across routes
4. **Validation**: JSON schemas are generated for request validation
5. **Development**: Use `fa serve` for hot reloading during development

## Workflow Example

```bash
# 1. Create a new frontend app
fa g app UserDashboard --vuejs --scss

# 2. Create backend API for users
fa g route users --crud --auth --validation

# 3. Create a user service
fa g service UserService --singleton --database

# 4. Create authentication guard
fa g guard jwt --role-based

# 5. Start development
fa serve

# 6. Build for production
fa build --production
```

## Dependencies

The CLI automatically manages dependencies:

- **Frontend**: Vite, Vue.js, SCSS, TypeScript (as needed)
- **Backend**: Fastify, plugins, validation, etc.
- **CLI**: Commander, Chalk for terminal UI

## Troubleshooting

- **CLI not found**: Run `npm run cli:link`
- **Permission errors**: Ensure you have write permissions in the project directory
- **Build errors**: Check that all dependencies are installed with `npm run install:all`
