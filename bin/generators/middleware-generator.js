import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class MiddlewareGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const middlewareFile = join(this.projectRoot, 'backend', 'middleware', `${name}.middleware.js`);
    
    if (existsSync(middlewareFile)) {
      console.error(chalk.red(`❌ Middleware '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.magenta(`🔧 Creating middleware: ${name}`));
    
    const middlewareContent = this.getMiddlewareTemplate(name, options);
    writeFileSync(middlewareFile, middlewareContent);
    
    console.log(chalk.green(`✅ Successfully created middleware: ${name}`));
    console.log(chalk.yellow(`📝 Middleware file: backend/middleware/${name}.middleware.js`));
    console.log(chalk.cyan('💡 Remember to register this middleware in your routes or plugins'));
  }

  getMiddlewareTemplate(name, options) {
    const isAsync = options.async;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (isAsync) {
      return `export async function ${name}Middleware(request, reply) {
  try {
    const startTime = Date.now();
    
    // TODO: Implement your async middleware logic here
    console.log(\`[\${capitalizedName} Middleware] Processing request: \${request.method} \${request.url}\`);
    
    // Example: async operations like database checks, external API calls
    // await someAsyncOperation();
    
    // Add data to request object
    request.${name} = {
      processed: true,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
    
    // Log completion
    request.log.info(\`[\${capitalizedName} Middleware] Completed in \${Date.now() - startTime}ms\`);
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Middleware] Error:\`, error);
    
    // You can either:
    // 1. Continue processing (just log the error)
    // 2. Return an error response
    reply.status(500).send({
      success: false,
      message: '${capitalizedName} middleware error',
      error: error.message
    });
  }
}

// Alternative: Hook-style middleware
export async function ${name}Hook(request, reply) {
  // This can be used with app.addHook('onRequest', ${name}Hook)
  try {
    request.log.info(\`[\${capitalizedName} Hook] \${request.method} \${request.url}\`);
    
    // TODO: Add your hook logic
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Hook] Error:\`, error);
    throw error; // Let Fastify handle the error
  }
}`;
    } else {
      return `export function ${name}Middleware(request, reply, done) {
  try {
    const startTime = Date.now();
    
    // TODO: Implement your middleware logic here
    console.log(\`[\${capitalizedName} Middleware] Processing request: \${request.method} \${request.url}\`);
    
    // Example: synchronous operations like header manipulation, validation
    
    // Add data to request object
    request.${name} = {
      processed: true,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
    
    // Log completion
    request.log.info(\`[\${capitalizedName} Middleware] Completed in \${Date.now() - startTime}ms\`);
    
    // Call done() to continue to the next middleware/handler
    done();
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Middleware] Error:\`, error);
    
    // Pass error to done() to stop processing
    done(error);
  }
}

// Alternative: Fastify hook style (async)
export async function ${name}Hook(request, reply) {
  // This can be used with app.addHook('onRequest', ${name}Hook)
  try {
    request.log.info(\`[\${capitalizedName} Hook] \${request.method} \${request.url}\`);
    
    // TODO: Add your hook logic
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Hook] Error:\`, error);
    throw error; // Let Fastify handle the error
  }
}

// Utility function to create configurable middleware
export function create${capitalizedName}Middleware(options = {}) {
  const config = {
    enabled: true,
    logLevel: 'info',
    ...options
  };
  
  return function ${name}ConfigurableMiddleware(request, reply, done) {
    if (!config.enabled) {
      return done();
    }
    
    try {
      // Use the configuration
      if (config.logLevel === 'debug') {
        request.log.debug(\`[\${capitalizedName}] Debug mode enabled\`);
      }
      
      // TODO: Implement configurable logic
      
      done();
    } catch (error) {
      done(error);
    }
  };
}`;
    }
  }
}
