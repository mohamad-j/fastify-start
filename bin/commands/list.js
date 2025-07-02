import { Command } from 'commander';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export const listCommand = new Command('list')
  .alias('ls')
  .description('List project components')
  .option('--apps', 'List frontend apps')
  .option('--routes', 'List backend routes')
  .option('--plugins', 'List backend plugins')
  .option('--services', 'List backend services')
  .option('--all', 'List all components')
  .action((options) => {
    const projectRoot = process.cwd();
    
    if (options.apps || options.all) {
      listApps(projectRoot);
    }
    
    if (options.routes || options.all) {
      listRoutes(projectRoot);
    }
    
    if (options.plugins || options.all) {
      listPlugins(projectRoot);
    }
    
    if (options.services || options.all) {
      listServices(projectRoot);
    }
    
    if (!options.apps && !options.routes && !options.plugins && !options.services && !options.all) {
      // Default: show overview
      console.log(chalk.yellow('📋 Project Overview\n'));
      listApps(projectRoot);
      listRoutes(projectRoot);
      listPlugins(projectRoot);
      listServices(projectRoot);
    }
  });

function listApps(projectRoot) {
  console.log(chalk.blue('📱 Frontend Apps:'));
  try {
    const appsDir = join(projectRoot, 'frontend', 'apps');
    const apps = readdirSync(appsDir).filter(item => {
      return statSync(join(appsDir, item)).isDirectory();
    });
    
    if (apps.length === 0) {
      console.log(chalk.gray('  No apps found'));
    } else {
      apps.forEach(app => {
        const appPath = join(appsDir, app);
        const hasIndex = readdirSync(appPath).includes('index.js');
        const status = hasIndex ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} ${app}`);
      });
    }
  } catch (error) {
    console.log(chalk.red('  Error reading apps directory'));
  }
  console.log();
}

function listRoutes(projectRoot) {
  console.log(chalk.green('🛣️  Backend Routes:'));
  try {
    const routesDir = join(projectRoot, 'backend', 'routes');
    const routes = readdirSync(routesDir).filter(file => file.endsWith('.js'));
    
    if (routes.length === 0) {
      console.log(chalk.gray('  No routes found'));
    } else {
      routes.forEach(route => {
        const routeName = route.replace('.route.js', '').replace('.js', '');
        console.log(`  📄 ${routeName}`);
      });
    }
  } catch (error) {
    console.log(chalk.red('  Error reading routes directory'));
  }
  console.log();
}

function listPlugins(projectRoot) {
  console.log(chalk.magenta('🔌 Backend Plugins:'));
  try {
    const pluginsDir = join(projectRoot, 'backend', 'plugins');
    const plugins = readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    if (plugins.length === 0) {
      console.log(chalk.gray('  No plugins found'));
    } else {
      plugins.forEach(plugin => {
        const pluginName = plugin.replace('.js', '');
        console.log(`  🔧 ${pluginName}`);
      });
    }
  } catch (error) {
    console.log(chalk.red('  Error reading plugins directory'));
  }
  console.log();
}

function listServices(projectRoot) {
  console.log(chalk.cyan('⚙️  Backend Services:'));
  try {
    const servicesDir = join(projectRoot, 'backend', 'services');
    const services = readdirSync(servicesDir).filter(file => file.endsWith('.js'));
    
    if (services.length === 0) {
      console.log(chalk.gray('  No services found'));
    } else {
      services.forEach(service => {
        const serviceName = service.replace('.service.js', '').replace('.js', '');
        console.log(`  ⚡ ${serviceName}`);
      });
    }
  } catch (error) {
    console.log(chalk.red('  Error reading services directory'));
  }
  console.log();
}
