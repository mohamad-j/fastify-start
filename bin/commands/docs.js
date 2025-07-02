import { Command } from 'commander';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function addDocsCommand(program) {
  const docsCommand = new Command('docs')
    .description('API documentation commands')
    .action(() => {
      docsCommand.help();
    });

  // Open documentation in browser
  docsCommand
    .command('open')
    .description('Open API documentation in browser')
    .option('-p, --port <port>', 'Server port', '3000')
    .action(async (options) => {
      console.log(chalk.blue('📚 Opening API documentation...'));
      
      try {
        const { default: open } = await import('open');
        await open(`http://localhost:${options.port}/docs`);
        console.log(chalk.green(`🌐 Documentation opened at http://localhost:${options.port}/docs`));
      } catch (error) {
        console.log(chalk.yellow(`💡 Please open http://localhost:${options.port}/docs in your browser`));
      }
    });

  // Generate documentation files
  docsCommand
    .command('generate')
    .description('Generate API documentation files')
    .option('-f, --format <format>', 'Output format (json|html|both)', 'both')
    .option('-o, --output <dir>', 'Output directory', './docs')
    .action(async (options) => {
      console.log(chalk.blue('📚 Generating API documentation...'));
      
      try {
        // Check if server is running
        try {
          const { stdout } = await execAsync('curl -s http://localhost:3000/health');
          const health = JSON.parse(stdout);
          if (health.status !== 'ok') {
            throw new Error('Server not healthy');
          }
        } catch (error) {
          console.log(chalk.yellow('⚠️  Server not running. Starting server temporarily...'));
          const serverProcess = exec('cd backend && npm run dev');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

        const fs = await import('fs');
        const path = await import('path');
        
        if (!fs.existsSync(options.output)) {
          fs.mkdirSync(options.output, { recursive: true });
        }

        // Generate JSON documentation
        if (options.format === 'json' || options.format === 'both') {
          try {
            const { stdout: jsonDocs } = await execAsync('curl -s http://localhost:3000/api/docs.json');
            fs.writeFileSync(path.join(options.output, 'api-docs.json'), jsonDocs);
            console.log(chalk.green(`✅ JSON documentation saved to ${options.output}/api-docs.json`));
          } catch (error) {
            console.error(chalk.red('❌ Failed to generate JSON documentation:'), error.message);
          }
        }

        // Generate HTML documentation
        if (options.format === 'html' || options.format === 'both') {
          try {
            const { stdout: htmlDocs } = await execAsync('curl -s http://localhost:3000/docs');
            fs.writeFileSync(path.join(options.output, 'api-docs.html'), htmlDocs);
            console.log(chalk.green(`✅ HTML documentation saved to ${options.output}/api-docs.html`));
          } catch (error) {
            console.error(chalk.red('❌ Failed to generate HTML documentation:'), error.message);
          }
        }

        console.log(chalk.green('🎉 Documentation generation complete!'));
        
      } catch (error) {
        console.error(chalk.red('❌ Failed to generate documentation:'), error.message);
        process.exit(1);
      }
    });

  // List API endpoints
  docsCommand
    .command('list')
    .description('List all API endpoints')
    .action(async () => {
      console.log(chalk.blue('� Listing API endpoints...'));
      
      try {
        const { stdout: spec } = await execAsync('curl -s http://localhost:3000/api/docs.json');
        const apiDocs = JSON.parse(spec);
        
        console.log(chalk.green('\n� Available Endpoints:\n'));
        
        apiDocs.endpoints.forEach(endpoint => {
          const authIcon = endpoint.auth ? '🔒' : '🌐';
          const methodColor = {
            'GET': 'green',
            'POST': 'blue', 
            'PUT': 'yellow',
            'DELETE': 'red'
          }[endpoint.method] || 'white';
          
          console.log(`${authIcon} ${chalk[methodColor](endpoint.method.padEnd(7))} ${endpoint.path.padEnd(25)} ${chalk.gray(endpoint.description)}`);
        });

        console.log(chalk.cyan(`\n📊 Total endpoints: ${apiDocs.endpoints.length}`));
        console.log(chalk.cyan(`🔒 Protected endpoints: ${apiDocs.endpoints.filter(e => e.auth).length}`));
        
      } catch (error) {
        console.error(chalk.red('❌ Failed to list endpoints:'), error.message);
        console.log(chalk.yellow('💡 Make sure the backend server is running: fa serve --backend'));
        process.exit(1);
      }
    });

  // Test API endpoints
  docsCommand
    .command('test')
    .description('Test API endpoint availability')
    .action(async () => {
      console.log(chalk.blue('🧪 Testing API endpoints...'));
      
      try {
        const { stdout: spec } = await execAsync('curl -s http://localhost:3000/api/docs.json');
        const apiDocs = JSON.parse(spec);
        
        console.log(chalk.green('\n� Testing endpoint availability:\n'));
        
        for (const endpoint of apiDocs.endpoints) {
          if (endpoint.method === 'GET' && !endpoint.auth) {
            try {
              const { stdout } = await execAsync(`curl -s -w "%{http_code}" http://localhost:3000${endpoint.path}`);
              const statusCode = stdout.slice(-3);
              const statusColor = statusCode.startsWith('2') ? 'green' : statusCode.startsWith('4') ? 'yellow' : 'red';
              console.log(`${chalk[statusColor](statusCode)} ${endpoint.method.padEnd(7)} ${endpoint.path}`);
            } catch (error) {
              console.log(`${chalk.red('ERR')} ${endpoint.method.padEnd(7)} ${endpoint.path}`);
            }
          } else {
            console.log(`${chalk.gray('---')} ${endpoint.method.padEnd(7)} ${endpoint.path} ${chalk.gray('(auth required or not GET)')}`);
          }
        }
        
      } catch (error) {
        console.error(chalk.red('❌ Failed to test endpoints:'), error.message);
        process.exit(1);
      }
    });

  program.addCommand(docsCommand);
}
