

export default async function (app) {
  // Health check endpoint with comprehensive documentation
  app.get('/health', {
    schema: {
      description: 'Health check endpoint to verify API status',
      tags: ['Health'],
      summary: 'API Health Check',
      response: {
        200: {
          description: 'API is healthy and operational',
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              example: 'ok',
              description: 'Health status indicator'
            },
            timestamp: { 
              type: 'string', 
              format: 'date-time',
              description: 'Current server timestamp'
            },
            uptime: { 
              type: 'number',
              description: 'Server uptime in seconds'
            },
            version: { 
              type: 'string',
              example: '1.0.0',
              description: 'API version'
            },
            environment: { 
              type: 'string',
              example: 'development',
              description: 'Current environment'
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  });

  // API info endpoint
  app.get('/info', {
    schema: {
      description: 'Get API information and available endpoints',
      tags: ['Health'],
      summary: 'API Information',
      response: {
        200: {
          description: 'API information retrieved successfully',
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Fastify Starter API' },
            version: { type: 'string', example: '1.0.0' },
            description: { type: 'string', example: 'RESTful API built with Fastify' },
            documentation: { type: 'string', example: '/docs' },
            endpoints: {
              type: 'object',
              properties: {
                health: { type: 'string', example: '/health' },
                docs: { type: 'string', example: '/docs' },
                api: { type: 'string', example: '/api/openapi.json' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return {
      name: 'Fastify Starter API',
      version: '1.0.0',
      description: 'RESTful API built with Fastify framework',
      documentation: '/docs',
      endpoints: {
        health: '/health',
        docs: '/docs',
        api: '/api/openapi.json',
        yaml: '/api/openapi.yaml'
      }
    };
  });
}
