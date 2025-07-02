import { Command } from 'commander';
import { spawn } from 'child_process';
import chalk from 'chalk';

export const serveCommand = new Command('serve')
  .alias('s')
  .description('Start development servers')
  .option('--frontend', 'Start only frontend dev server')
  .option('--backend', 'Start only backend dev server')
  .option('--app <name>', 'Specify which frontend app to serve (default: main)')
  .option('--port <port>', 'Backend port (default: 3000)')
  .action((options) => {
    const app = options.app || 'main';
    
    if (options.frontend) {
      console.log(chalk.blue('🚀 Starting frontend development server...'));
      const viteProcess = spawn('npm', ['run', 'dev:frontend'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, npm_config_src: app }
      });
      
      viteProcess.on('error', (err) => {
        console.error(chalk.red('Failed to start frontend server:'), err);
      });
      return;
    }
    
    if (options.backend) {
      console.log(chalk.green('🚀 Starting backend development server...'));
      const backendProcess = spawn('npm', ['run', 'dev:backend'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PORT: options.port || '3000' }
      });
      
      backendProcess.on('error', (err) => {
        console.error(chalk.red('Failed to start backend server:'), err);
      });
      return;
    }
    
    // Start both by default
    console.log(chalk.yellow('🚀 Starting both frontend and backend servers...'));
    
    const backendProcess = spawn('npm', ['run', 'dev:backend'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: options.port || '3000' }
    });
    
    setTimeout(() => {
      const viteProcess = spawn('npm', ['run', 'dev:frontend'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, npm_config_src: app }
      });
      
      viteProcess.on('error', (err) => {
        console.error(chalk.red('Failed to start frontend server:'), err);
      });
    }, 2000);
    
    backendProcess.on('error', (err) => {
      console.error(chalk.red('Failed to start backend server:'), err);
    });
  });
