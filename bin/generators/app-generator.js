import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class AppGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const appDir = join(this.projectRoot, 'frontend', 'apps', name);
    
    if (existsSync(appDir)) {
      console.error(chalk.red(`❌ App '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.blue(`🏗️  Creating app: ${name}`));
    
    // Create app directory
    mkdirSync(appDir, { recursive: true });

    if (options.vuejs) {
      this.generateVueApp(appDir, name, options);
    } else {
      this.generateVanillaApp(appDir, name, options);
    }

    // Create corresponding Nunjucks template in backend
    this.generateNunjucksTemplate(name, options);

    // Optionally generate a route for the app
    this.generateAppRoute(name, options);

    console.log(chalk.green(`✅ Successfully created app: ${name}`));
    console.log(chalk.yellow(`📝 Frontend app: frontend/apps/${name}/`));
    console.log(chalk.yellow(`📝 Backend template: backend/views/pages/${name.toLowerCase()}.njk`));
    console.log(chalk.yellow(`📝 Backend route: backend/routes/${name.toLowerCase()}.route.js`));
    console.log(chalk.cyan(`🌐 App URL: http://localhost:3000/${name.toLowerCase()}`));
    console.log(chalk.yellow(`📦 To build this app: fa build --app ${name}`));
    console.log(chalk.yellow(`🚀 To serve this app: fa serve --app ${name} --frontend`));
  }

  generateVueApp(appDir, name, options) {
    // Create Vue app structure
    const dirs = ['components', 'assets', 'styles'];
    dirs.forEach(dir => mkdirSync(join(appDir, dir), { recursive: true }));

    // HTML template for Vue app
    const htmlContent = this.getHtmlTemplate(name);
    writeFileSync(join(appDir, 'index.html'), htmlContent);

    // Main Vue app file
    const mainVueContent = options.typescript ? this.getVueTypeScriptTemplate(name, options.scss) : this.getVueTemplate(name, options.scss);
    writeFileSync(join(appDir, 'index.js'), mainVueContent);

    // App.vue component
    const appVueContent = this.getAppVueTemplate(name, options.scss);
    writeFileSync(join(appDir, 'App.vue'), appVueContent);

    // Sample component
    const componentContent = this.getVueComponentTemplate();
    writeFileSync(join(appDir, 'components', 'HelloWorld.vue'), componentContent);

    // Styles
    const styleExt = options.scss ? 'scss' : 'css';
    const styleContent = this.getStyleTemplate(options.scss);
    writeFileSync(join(appDir, 'styles', `main.${styleExt}`), styleContent);

    // Package.json snippet for dependencies
    console.log(chalk.cyan('\n📦 Add these to your package.json dependencies:'));
    console.log(chalk.gray('  "vue": "^3.5.16"'));
    if (options.typescript) {
      console.log(chalk.gray('  "@vue/compiler-sfc": "^3.5.16"'));
      console.log(chalk.gray('  "typescript": "^5.0.0"'));
    }
    if (options.scss) {
      console.log(chalk.gray('  "sass": "^1.89.1"'));
    }
  }

  generateVanillaApp(appDir, name, options) {
    // Create vanilla app structure
    const dirs = ['js', 'css', 'assets'];
    dirs.forEach(dir => mkdirSync(join(appDir, dir), { recursive: true }));

    // HTML template
    const htmlContent = this.getHtmlTemplate(name);
    writeFileSync(join(appDir, 'index.html'), htmlContent);

    // Main JS file
    const mainContent = options.typescript ? this.getVanillaTypeScriptTemplate(name) : this.getVanillaTemplate(name);
    const ext = options.typescript ? 'ts' : 'js';
    writeFileSync(join(appDir, `index.${ext}`), mainContent);

    // Additional JS modules
    const utilsContent = this.getUtilsTemplate(options.typescript);
    writeFileSync(join(appDir, 'js', `utils.${ext}`), utilsContent);

    // Styles
    const styleExt = options.scss ? 'scss' : 'css';
    const styleContent = this.getStyleTemplate(options.scss);
    writeFileSync(join(appDir, 'css', `main.${styleExt}`), styleContent);

    if (options.typescript) {
      // TypeScript config
      const tsConfigContent = this.getTsConfigTemplate();
      writeFileSync(join(appDir, 'tsconfig.json'), tsConfigContent);
    }
  }

  getVueTemplate(name, hasScss) {
    const styleExt = hasScss ? 'scss' : 'css';
    return `import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.${styleExt}';

const app = createApp(App);
app.mount('#app');

console.log('🚀 ${name} Vue app started!');`;
  }

  getVueTypeScriptTemplate(name, hasScss) {
    const styleExt = hasScss ? 'scss' : 'css';
    return `import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.${styleExt}';

const app = createApp(App);
app.mount('#app');

console.log('🚀 ${name} Vue TypeScript app started!');`;
  }

  getAppVueTemplate(name, hasScss) {
    const styleTag = hasScss ? '<style lang="scss">' : '<style>';
    return `<template>
  <div id="app" class="app">
    <header class="app-header">
      <h1>{{ title }}</h1>
    </header>
    <main class="app-main">
      <HelloWorld :message="message" />
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: '${name}App',
  components: {
    HelloWorld
  },
  data() {
    return {
      title: '${name} App',
      message: 'Welcome to your new Vue.js app!'
    }
  }
}
</script>

${styleTag}
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.app-header {
  margin-bottom: 2rem;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>`;
  }

  getVueComponentTemplate() {
    return `<template>
  <div class="hello">
    <h2>{{ message }}</h2>
    <p>{{ description }}</p>
    <button @click="handleClick" class="btn">Click me!</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    message: String
  },
  data() {
    return {
      description: 'This is a sample Vue component generated by Fastify CLI.'
    }
  },
  methods: {
    handleClick() {
      alert('Hello from Vue component!');
    }
  }
}
</script>

<style scoped>
.hello {
  padding: 2rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin: 1rem 0;
}

.btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn:hover {
  background-color: #369870;
}
</style>`;
  }

  getVanillaTemplate(name) {
    return `import { createLogger } from './js/utils.js';
import './css/main.css';

// Initialize logger
const logger = createLogger('${name}');

// Main app initialization
function initApp() {
  logger.info('🚀 ${name} app starting...');
  
  // Create app container
  const appContainer = document.createElement('div');
  appContainer.className = 'app-container';
  appContainer.innerHTML = \`
    <header class="app-header">
      <h1>${name} App</h1>
    </header>
    <main class="app-main">
      <div class="welcome-card">
        <h2>Welcome to ${name}</h2>
        <p>This is your new Fastify app created with the CLI!</p>
        <button id="demo-btn" class="btn">Try me!</button>
      </div>
    </main>
  \`;
  
  document.body.appendChild(appContainer);
  
  // Add event listeners
  setupEventListeners();
  
  logger.info('✅ ${name} app initialized successfully');
}

function setupEventListeners() {
  const demoBtn = document.getElementById('demo-btn');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      logger.info('Demo button clicked!');
      showNotification('Hello from ${name}!', 'success');
    });
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = \`notification notification--\${type}\`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}`;
  }

  getVanillaTypeScriptTemplate(name) {
    return `import { createLogger, Logger } from './js/utils.js';
import './css/main.css';

// Initialize logger
const logger: Logger = createLogger('${name}');

// Main app initialization
function initApp(): void {
  logger.info('🚀 ${name} app starting...');
  
  // Create app container
  const appContainer: HTMLDivElement = document.createElement('div');
  appContainer.className = 'app-container';
  appContainer.innerHTML = \`
    <header class="app-header">
      <h1>${name} App</h1>
    </header>
    <main class="app-main">
      <div class="welcome-card">
        <h2>Welcome to ${name}</h2>
        <p>This is your new Fastify TypeScript app created with the CLI!</p>
        <button id="demo-btn" class="btn">Try me!</button>
      </div>
    </main>
  \`;
  
  document.body.appendChild(appContainer);
  
  // Add event listeners
  setupEventListeners();
  
  logger.info('✅ ${name} app initialized successfully');
}

function setupEventListeners(): void {
  const demoBtn: HTMLButtonElement | null = document.getElementById('demo-btn') as HTMLButtonElement;
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      logger.info('Demo button clicked!');
      showNotification('Hello from ${name}!', 'success');
    });
  }
}

type NotificationType = 'info' | 'success' | 'warning' | 'error';

function showNotification(message: string, type: NotificationType = 'info'): void {
  const notification: HTMLDivElement = document.createElement('div');
  notification.className = \`notification notification--\${type}\`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}`;
  }

  getUtilsTemplate(isTypeScript) {
    if (isTypeScript) {
      return `export interface Logger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function createLogger(context: string): Logger {
  return {
    info(message: string): void {
      console.log(\`[INFO] [\${context}] \${message}\`);
    },
    warn(message: string): void {
      console.warn(\`[WARN] [\${context}] \${message}\`);
    },
    error(message: string): void {
      console.error(\`[ERROR] [\${context}] \${message}\`);
    }
  };
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}`;
    } else {
      return `export function createLogger(context) {
  return {
    info(message) {
      console.log(\`[INFO] [\${context}] \${message}\`);
    },
    warn(message) {
      console.warn(\`[WARN] [\${context}] \${message}\`);
    },
    error(message) {
      console.error(\`[ERROR] [\${context}] \${message}\`);
    }
  };
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}`;
    }
  }

  getStyleTemplate(isScss) {
    if (isScss) {
      return `// Variables
$primary-color: #42b883;
$secondary-color: #369870;
$text-color: #2c3e50;
$border-color: #e1e1e1;
$border-radius: 8px;

// Mixins
@mixin button-style($bg-color: $primary-color, $hover-color: $secondary-color) {
  background-color: $bg-color;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: $hover-color;
  }
}

// Global styles
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: $text-color;
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem 0;
  
  h1 {
    margin: 0;
    font-size: 2.5rem;
    color: $primary-color;
  }
}

.app-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  margin: 1rem 0;
  
  h2 {
    color: $primary-color;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
}

.btn {
  @include button-style();
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1000;
  
  &--info { background-color: #3498db; }
  &--success { background-color: #2ecc71; }
  &--warning { background-color: #f39c12; }
  &--error { background-color: #e74c3c; }
}`;
    } else {
      return `/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem 0;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #42b883;
}

.app-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin: 1rem 0;
}

.welcome-card h2 {
  color: #42b883;
  margin-bottom: 1rem;
}

.welcome-card p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #369870;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1000;
}

.notification--info { background-color: #3498db; }
.notification--success { background-color: #2ecc71; }
.notification--warning { background-color: #f39c12; }
.notification--error { background-color: #e74c3c; }`;
    }
  }

  getTsConfigTemplate() {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`;
  }

  getHtmlTemplate(name) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/index.js"></script>
</body>
</html>`;
  }

  generateNunjucksTemplate(name, options) {
    const backendViewsDir = join(this.projectRoot, 'backend', 'views', 'pages');
    const templateFile = join(backendViewsDir, `${name.toLowerCase()}.njk`);
    
    if (existsSync(templateFile)) {
      console.log(chalk.yellow(`⚠️  Template ${name.toLowerCase()}.njk already exists, skipping...`));
      return;
    }

    // Ensure backend views directory exists
    if (!existsSync(backendViewsDir)) {
      mkdirSync(backendViewsDir, { recursive: true });
    }

    const templateContent = this.getNunjucksTemplate(name, options);
    writeFileSync(templateFile, templateContent);
  }

  getNunjucksTemplate(name, options) {
    const appNameLower = name.toLowerCase();
    const isVue = options.vuejs;
    const framework = isVue ? 'Vue.js' : 'Vanilla JavaScript';
    
    return `{% extends "layouts/base.njk" %}

{% block head %}
    <meta name="description" content="${name} - A modern ${framework} application">
    <meta name="keywords" content="${appNameLower}, ${framework.toLowerCase()}, fastify, web app">
{% endblock %}

{% block content %}
    <section class="app-container">
        <div class="app-header">
            <h1>{{ pageTitle | default('${name} Application') }}</h1>
            <p class="lead">{{ leadText | default('Welcome to your ${framework} application built with Fastify!') }}</p>
        </div>
        
        <!-- Frontend app will be mounted here -->
        <div id="app" class="app-mount-point">
            <!-- Loading state while app initializes -->
            <div class="app-loading">
                <div class="spinner"></div>
                <p>Loading ${name}...</p>
            </div>
        </div>
        
        {% if appData %}
            <script>
                // Pass server data to frontend app
                window.__APP_DATA__ = {{ appData | dump | safe }};
            </script>
        {% endif %}
    </section>
{% endblock %}

{% block scripts %}
    <!-- Load the built frontend app -->
    {{ renderScripts('${appNameLower}') | safe }}
    
    <script>
        // Handle app loading states
        document.addEventListener('DOMContentLoaded', function() {
            // Hide loading spinner once Vue/JS app is ready
            setTimeout(function() {
                const loading = document.querySelector('.app-loading');
                if (loading) {
                    loading.style.display = 'none';
                }
            }, 1000);
        });
    </script>
{% endblock %}

{% block styles %}
    <style>
        .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .app-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .app-mount-point {
            min-height: 400px;
            position: relative;
        }
        
        .app-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #666;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* App-specific styles */
        .${appNameLower}-app {
            width: 100%;
            height: 100%;
        }
    </style>
{% endblock %}`;
  }

  generateAppRoute(name, options) {
    const routesDir = join(this.projectRoot, 'backend', 'routes');
    const routeFile = join(routesDir, `${name.toLowerCase()}.route.js`);
    
    if (existsSync(routeFile)) {
      console.log(chalk.yellow(`⚠️  Route ${name.toLowerCase()}.route.js already exists, skipping...`));
      return;
    }

    // Ensure routes directory exists
    if (!existsSync(routesDir)) {
      mkdirSync(routesDir, { recursive: true });
    }

    const routeContent = this.getAppRouteTemplate(name, options);
    writeFileSync(routeFile, routeContent);
    
    console.log(chalk.cyan(`📝 Created route: backend/routes/${name.toLowerCase()}.route.js`));
    console.log(chalk.cyan(`🌐 Access your app at: http://localhost:3000/${name.toLowerCase()}`));
  }

  getAppRouteTemplate(name, options) {
    const appNameLower = name.toLowerCase();
    const framework = options.vuejs ? 'Vue.js' : 'JavaScript';
    
    return `export default async function (app) {
  // Route to serve the ${name} frontend app
  app.get('/${appNameLower}', async (request, reply) => {
    try {
      // Data to pass to the frontend app
      const appData = {
        appName: '${name}',
        framework: '${framework}',
        timestamp: new Date().toISOString(),
        user: request.user || null, // If user is authenticated
        // Add more data as needed
      };

      return reply.render('pages/${appNameLower}.njk', {
        title: '${name} - My Fastify App',
        pageTitle: '${name} Application',
        leadText: 'A modern ${framework} application built with Fastify',
        appData: appData,
        // Additional template variables
        meta: {
          description: '${name} - A modern web application',
          keywords: '${appNameLower}, ${framework.toLowerCase()}, fastify'
        }
      });
    } catch (error) {
      request.log.error('Error serving ${name} app:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to load ${name} application'
      });
    }
  });

  // API endpoint for the ${name} app data
  app.get('/api/${appNameLower}/data', async (request, reply) => {
    try {
      // Return JSON data for the frontend app
      return {
        success: true,
        data: {
          appName: '${name}',
          framework: '${framework}',
          features: [
            'Fast loading',
            'Modern UI',
            'Responsive design'
          ],
          stats: {
            users: 0,
            views: 0,
            uptime: process.uptime()
          }
        }
      };
    } catch (error) {
      request.log.error('Error fetching ${name} data:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch app data'
      });
    }
  });

  // Health check for the ${name} app
  app.get('/api/${appNameLower}/health', async (request, reply) => {
    return {
      success: true,
      app: '${name}',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  });
}`;
  }
}
