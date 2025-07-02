import { createLogger, Logger } from './js/utils.js';
import './css/main.css';

// Initialize logger
const logger: Logger = createLogger('UserProfile');

// Main app initialization
function initApp(): void {
  logger.info('🚀 UserProfile app starting...');
  
  // Create app container
  const appContainer: HTMLDivElement = document.createElement('div');
  appContainer.className = 'app-container';
  appContainer.innerHTML = `
    <header class="app-header">
      <h1>UserProfile App</h1>
    </header>
    <main class="app-main">
      <div class="welcome-card">
        <h2>Welcome to UserProfile</h2>
        <p>This is your new Fastify TypeScript app created with the CLI!</p>
        <button id="demo-btn" class="btn">Try me!</button>
      </div>
    </main>
  `;
  
  document.body.appendChild(appContainer);
  
  // Add event listeners
  setupEventListeners();
  
  logger.info('✅ UserProfile app initialized successfully');
}

function setupEventListeners(): void {
  const demoBtn: HTMLButtonElement | null = document.getElementById('demo-btn') as HTMLButtonElement;
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      logger.info('Demo button clicked!');
      showNotification('Hello from UserProfile!', 'success');
    });
  }
}

type NotificationType = 'info' | 'success' | 'warning' | 'error';

function showNotification(message: string, type: NotificationType = 'info'): void {
  const notification: HTMLDivElement = document.createElement('div');
  notification.className = `notification notification--${type}`;
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
}