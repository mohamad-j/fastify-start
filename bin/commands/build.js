import { Command } from 'commander';
import { spawn } from 'child_process';
import chalk from 'chalk';

export const buildCommand = new Command('build')
  .alias('b')
  .description('Build the project')
  .option('--app <name>', 'Build specific frontend app (default: all)')
  .option('--production', 'Build for production')
  .action((options) => {
    const app = options.app;
    const mode = options.production ? 'production' : 'development';
    
    console.log(chalk.blue(`🔨 Building project in ${mode} mode...`));
    
    if (app) {
      console.log(chalk.yellow(`📦 Building app: ${app}`));
      const buildProcess = spawn('npm', ['run', 'build:frontend'], {
        stdio: 'inherit',
        shell: true,
        env: { 
          ...process.env, 
          npm_config_src: app,
          NODE_ENV: mode
        }
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green(`✅ Successfully built ${app}`));
        } else {
          console.error(chalk.red(`❌ Failed to build ${app}`));
        }
      });
    } else {
      // Build all apps
      console.log(chalk.yellow('📦 Building all frontend apps...'));
      
      const apps = ['main', 'about']; // You can make this dynamic by reading the apps directory
      
      let completed = 0;
      apps.forEach((appName, index) => {
        setTimeout(() => {
          console.log(chalk.cyan(`Building ${appName}...`));
          const buildProcess = spawn('npm', ['run', 'build:frontend'], {
            stdio: 'inherit',
            shell: true,
            env: { 
              ...process.env, 
              npm_config_src: appName,
              NODE_ENV: mode
            }
          });
          
          buildProcess.on('close', (code) => {
            completed++;
            if (code === 0) {
              console.log(chalk.green(`✅ Successfully built ${appName}`));
            } else {
              console.error(chalk.red(`❌ Failed to build ${appName}`));
            }
            
            if (completed === apps.length) {
              console.log(chalk.green('🎉 All builds completed!'));
            }
          });
        }, index * 1000); // Stagger builds to avoid conflicts
      });
    }
  });
