import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class RouteGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const routeFile = join(this.projectRoot, 'backend', 'routes', `${name}.route.js`);
    
    if (existsSync(routeFile)) {
      console.error(chalk.red(`❌ Route '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.green(`🛣️  Creating route: ${name}`));
    
    let routeContent;
    
    if (options.crud) {
      routeContent = this.getCrudRouteTemplate(name, options);
    } else {
      routeContent = this.getBasicRouteTemplate(name, options);
    }

    writeFileSync(routeFile, routeContent);
    
    console.log(chalk.green(`✅ Successfully created route: ${name}`));
    console.log(chalk.yellow(`📝 Route file: backend/routes/${name}.route.js`));
    
    if (options.validation) {
      console.log(chalk.cyan('💡 Remember to implement your validation schemas'));
    }
    
    if (options.auth) {
      console.log(chalk.cyan('💡 Auth guard has been added - make sure your auth system is configured'));
    }
  }

  getBasicRouteTemplate(name, options) {
    const hasAuth = options.auth;
    const hasValidation = options.validation;
    
    let imports = '';
    
    if (hasAuth) {
      imports += `import { authGuard } from '../guards/auth.guard.js';\n`;
    }
    
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return `${imports}
export default async function (app) {
  // GET /${name}
  app.get('/${name}', {
    ${hasAuth ? 'preHandler: authGuard,' : ''}
    schema: {
      description: 'Get ${name} data',
      tags: ['${capitalizedName}'],
      ${hasAuth ? 'security: [{ bearerAuth: [] }],' : ''}
      response: {
        200: {
          description: '${capitalizedName} data retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Welcome to ${capitalizedName} endpoint' },
            data: { type: 'array', items: { type: 'object' } }
          }
        }${hasAuth ? `,
        401: {
          description: 'Authentication required',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Authentication required' }
          }
        }` : ''}
      }
    }
  }, async (request, reply) => {
    try {
      // TODO: Implement ${name} retrieval logic
      return {
        success: true,
        message: 'Welcome to ${capitalizedName} endpoint',
        data: []
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  // POST /${name}
  app.post('/${name}', {
    ${hasAuth ? 'preHandler: authGuard,' : ''}
    schema: {
      description: 'Create new ${name}',
      tags: ['${capitalizedName}'],
      ${hasAuth ? 'security: [{ bearerAuth: [] }],' : ''}
      ${hasValidation ? `body: create${capitalizedName}Schema.body,` : `body: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '${capitalizedName} name' }
        },
        required: ['name']
      },`}
      response: {
        200: {
          description: '${capitalizedName} created successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: '${capitalizedName} created successfully' },
            data: { type: 'object' }
          }
        }${hasAuth ? `,
        401: {
          description: 'Authentication required',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Authentication required' }
          }
        }` : ''}
      }
    }
  }, async (request, reply) => {
    try {
      const data = request.body;
      
      // TODO: Implement ${name} creation logic
      console.log('Creating ${name} with data:', data);
      
      return {
        success: true,
        message: '${capitalizedName} created successfully',
        data: { id: 1, ...data }
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to create ${name}'
      });
    }
  });
}

${hasValidation ? this.getValidationSchemas(capitalizedName) : ''}`;
  }

  getCrudRouteTemplate(name, options) {
    const hasAuth = options.auth;
    const hasValidation = options.validation;
    
    let imports = '';
    let routeOptions = '';
    
    if (hasAuth) {
      imports += `import { authGuard } from '../guards/auth.guard.js';\n`;
    }
    
    // Build route options object
    const optionsParts = [];
    if (hasAuth) {
      optionsParts.push('preHandler: authGuard');
    }
    
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const serviceName = `${capitalizedName}Service`;
    
    return `${imports}
export default async function (app) {
  // TODO: Inject ${serviceName} from DI container
  // const ${name}Service = app.di.resolve('${serviceName}');

  // GET /${name} - List all ${name}s
  app.get('/${name}'${hasAuth || hasValidation ? ', { ' + (hasAuth ? 'preHandler: authGuard' : '') + ' }' : ''}, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search } = request.query;
      
      // TODO: Implement pagination and search
      // const result = await ${name}Service.findAll({ page, limit, search });
      
      return {
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0
        }
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to retrieve ${name}s'
      });
    }
  });

  // GET /${name}/:id - Get single ${name}
  app.get('/${name}/:id'${this.buildRouteOptions(hasAuth, hasValidation, `get${capitalizedName}Schema`)}, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // TODO: Implement ${name} retrieval by ID
      // const ${name} = await ${name}Service.findById(id);
      
      // if (!${name}) {
      //   return reply.status(404).send({
      //     success: false,
      //     message: '${capitalizedName} not found'
      //   });
      // }
      
      return {
        success: true,
        data: { id, placeholder: true }
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to retrieve ${name}'
      });
    }
  });

  // POST /${name} - Create new ${name}
  app.post('/${name}'${this.buildRouteOptions(hasAuth, hasValidation, `create${capitalizedName}Schema`)}, async (request, reply) => {
    try {
      const data = request.body;
      
      // TODO: Implement ${name} creation
      // const new${capitalizedName} = await ${name}Service.create(data);
      
      reply.status(201).send({
        success: true,
        message: '${capitalizedName} created successfully',
        data: { id: 1, ...data }
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to create ${name}'
      });
    }
  });

  // PUT /${name}/:id - Update ${name}
  app.put('/${name}/:id'${this.buildRouteOptions(hasAuth, hasValidation, `update${capitalizedName}Schema`)}, async (request, reply) => {
    try {
      const { id } = request.params;
      const data = request.body;
      
      // TODO: Implement ${name} update
      // const updated${capitalizedName} = await ${name}Service.update(id, data);
      
      return {
        success: true,
        message: '${capitalizedName} updated successfully',
        data: { id, ...data }
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to update ${name}'
      });
    }
  });

  // DELETE /${name}/:id - Delete ${name}
  app.delete('/${name}/:id'${this.buildRouteOptions(hasAuth, hasValidation, `delete${capitalizedName}Schema`)}, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // TODO: Implement ${name} deletion
      // await ${name}Service.delete(id);
      
      return {
        success: true,
        message: '${capitalizedName} deleted successfully'
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        message: 'Failed to delete ${name}'
      });
    }
  });
}

${hasValidation ? this.getCrudValidationSchemas(capitalizedName) : ''}`;
  }

  getValidationSchemas(name) {
    return `
// Validation schemas
const create${name}Schema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: 'string', maxLength: 500 },
      // TODO: Add more properties as needed
    },
    additionalProperties: false
  }
};`;
  }

  getCrudValidationSchemas(name) {
    return `
// Validation schemas
const get${name}Schema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' }
    },
    additionalProperties: false
  }
};

const create${name}Schema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: 'string', maxLength: 500 },
      // TODO: Add more properties as needed
    },
    additionalProperties: false
  }
};

const update${name}Schema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' }
    },
    additionalProperties: false
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100 },
      description: { type: 'string', maxLength: 500 },
      // TODO: Add more properties as needed
    },
    additionalProperties: false
  }
};

const delete${name}Schema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' }
    },
    additionalProperties: false
  }
};`;
  }

  buildRouteOptions(hasAuth, hasValidation, schemaName) {
    const options = [];
    
    if (hasAuth) {
      options.push('preHandler: authGuard');
    }
    
    // TODO: Add schema validation back when schema format is fixed
    // if (hasValidation) {
    //   options.push(`schema: ${schemaName}`);
    // }
    
    if (options.length > 0) {
      return `, { ${options.join(', ')} }`;
    }
    
    return '';
  }
}
