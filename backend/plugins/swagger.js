import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default fp(async function (fastify) {
  // Register Swagger for API documentation
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fastify Starter API',
        description: 'RESTful API built with Fastify framework',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Products', description: 'Product management endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT Bearer token for authentication'
          }
        }
      }
    }
  });

  // Register Swagger UI for interactive documentation
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  });

  // Add route to get OpenAPI specification
  fastify.get('/api/openapi.json', async (request, reply) => {
    return fastify.swagger();
  });

  fastify.log.info('📚 Swagger documentation available at /docs');
});
