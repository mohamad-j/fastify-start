import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class PluginGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const pluginFile = join(this.projectRoot, 'backend', 'plugins', `${name}.js`);
    
    if (existsSync(pluginFile)) {
      console.error(chalk.red(`❌ Plugin '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.purple(`🔌 Creating plugin: ${name}`));
    
    const pluginContent = this.getPluginTemplate(name, options);
    writeFileSync(pluginFile, pluginContent);
    
    console.log(chalk.green(`✅ Successfully created plugin: ${name}`));
    console.log(chalk.yellow(`📝 Plugin file: backend/plugins/${name}.js`));
    
    if (options.decorators) {
      console.log(chalk.cyan('💡 Decorators have been added - remember to use them in your routes'));
    }
  }

  getPluginTemplate(name, options) {
    const isEncapsulated = options.encapsulated;
    const hasDecorators = options.decorators;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    let pluginContent = `import fp from 'fastify-plugin';

async function ${name}Plugin(app, options) {
  // Plugin options with defaults
  const pluginOptions = {
    // Set default options here
    enabled: true,
    ...options
  };

  if (!pluginOptions.enabled) {
    app.log.info('${capitalizedName} plugin is disabled');
    return;
  }

  app.log.info('${capitalizedName} plugin loaded');

  // TODO: Implement your plugin logic here
  
`;

    if (hasDecorators) {
      pluginContent += `  // Request decorator
  app.decorateRequest('${name}Data', null);
  
  // Reply decorator
  app.decorateReply('send${capitalizedName}', function(data) {
    return this.send({
      success: true,
      plugin: '${name}',
      data
    });
  });

  // App decorator
  app.decorate('${name}Helper', {
    processData(data) {
      // TODO: Add your helper logic
      return { processed: true, ...data };
    },
    
    validateData(data) {
      // TODO: Add validation logic
      return data && typeof data === 'object';
    }
  });

`;
    }

    pluginContent += `  // Plugin hooks
  app.addHook('onRequest', async (request, reply) => {
    // TODO: Add onRequest hook logic if needed
    request.log.debug('${capitalizedName} plugin: onRequest hook');
  });

  // Plugin routes (if needed)
  app.get('/plugin/${name}/status', async (request, reply) => {
    return {
      plugin: '${name}',
      status: 'active',
      timestamp: new Date().toISOString()
    };
  });
}

// Export with fastify-plugin wrapper
export default fp(${name}Plugin, {
  fastify: '5.x',
  name: '${name}-plugin'${isEncapsulated ? '' : ',\n  encapsulate: false'}
});`;

    return pluginContent;
  }
}
