import { Command } from 'commander';
import { AppGenerator } from '../generators/app-generator.js';
import { RouteGenerator } from '../generators/route-generator.js';
import { PluginGenerator } from '../generators/plugin-generator.js';
import { ServiceGenerator } from '../generators/service-generator.js';
import { MiddlewareGenerator } from '../generators/middleware-generator.js';
import { GuardGenerator } from '../generators/guard-generator.js';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Generate project components');

// Generate App
generateCommand
  .command('app <name>')
  .description('Generate a new frontend app')
  .option('--vuejs', 'Create a Vue.js app')
  .option('--vanilla', 'Create a vanilla JavaScript app (default)')
  .option('--typescript', 'Use TypeScript')
  .option('--scss', 'Include SCSS support')
  .action((name, options) => {
    const generator = new AppGenerator();
    generator.generate(name, options);
  });

// Generate Route
generateCommand
  .command('route <name>')
  .description('Generate a new backend route')
  .option('--crud', 'Generate CRUD operations')
  .option('--auth', 'Add authentication guard')
  .option('--validation', 'Add request validation schemas')
  .action((name, options) => {
    const generator = new RouteGenerator();
    generator.generate(name, options);
  });

// Generate Plugin
generateCommand
  .command('plugin <name>')
  .description('Generate a new Fastify plugin')
  .option('--encapsulated', 'Create encapsulated plugin')
  .option('--decorators', 'Add request/reply decorators')
  .action((name, options) => {
    const generator = new PluginGenerator();
    generator.generate(name, options);
  });

// Generate Service
generateCommand
  .command('service <name>')
  .description('Generate a new service class')
  .option('--singleton', 'Register as singleton in DI container')
  .option('--database', 'Include database connection example')
  .action((name, options) => {
    const generator = new ServiceGenerator();
    generator.generate(name, options);
  });

// Generate Middleware
generateCommand
  .command('middleware <name>')
  .description('Generate a new middleware')
  .option('--async', 'Create async middleware')
  .action((name, options) => {
    const generator = new MiddlewareGenerator();
    generator.generate(name, options);
  });

// Generate Guard
generateCommand
  .command('guard <name>')
  .description('Generate a new route guard')
  .option('--role-based', 'Add role-based authorization')
  .action((name, options) => {
    const generator = new GuardGenerator();
    generator.generate(name, options);
  });
