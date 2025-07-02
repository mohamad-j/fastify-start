#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('fa')
  .description('Fastify App CLI - Generate apps, routes, plugins and more')
  .version(packageJson.version || '1.0.0');

// Import commands
import { generateCommand } from './commands/generate.js';
import { serveCommand } from './commands/serve.js';
import { buildCommand } from './commands/build.js';
import { listCommand } from './commands/list.js';
import { addDocsCommand } from './commands/docs.js';

// Register commands
program.addCommand(generateCommand);
program.addCommand(serveCommand);
program.addCommand(buildCommand);
program.addCommand(listCommand);
addDocsCommand(program);

program.parse();
