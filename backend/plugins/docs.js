import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  // Simple API documentation endpoint
  fastify.get('/docs', async (request, reply) => {
    const apiDocs = {
      title: 'Fastify Starter API Documentation',
      version: '1.0.0',
      description: 'RESTful API built with Fastify framework',
      baseUrl: `${request.protocol}://${request.hostname}:3000`,
      endpoints: [
        {
          method: 'GET',
          path: '/health',
          description: 'Health check endpoint',
          response: { status: 'ok', timestamp: '2025-01-02T...' }
        },
        {
          method: 'GET',
          path: '/info',
          description: 'Get API information',
          response: { name: 'Fastify Starter API', version: '1.0.0' }
        },
        {
          method: 'GET',
          path: '/products',
          description: 'Get paginated list of products',
          auth: 'Required',
          query: { page: 1, limit: 10, search: 'optional' },
          response: { success: true, data: [], pagination: {} }
        },
        {
          method: 'GET',
          path: '/products/:id',
          description: 'Get specific product by ID',
          auth: 'Required',
          params: { id: 'string' },
          response: { success: true, data: {} }
        },
        {
          method: 'POST',
          path: '/products',
          description: 'Create new product',
          auth: 'Required',
          body: { name: 'string (required)', description: 'string' },
          response: { success: true, message: 'Product created', data: {} }
        },
        {
          method: 'PUT',
          path: '/products/:id',
          description: 'Update existing product',
          auth: 'Required',
          params: { id: 'string' },
          body: { name: 'string', description: 'string' },
          response: { success: true, message: 'Product updated', data: {} }
        },
        {
          method: 'DELETE',
          path: '/products/:id',
          description: 'Delete product',
          auth: 'Required',
          params: { id: 'string' },
          response: { success: true, message: 'Product deleted' }
        }
      ],
      authentication: {
        type: 'Bearer Token',
        description: 'Add Authorization header with Bearer token',
        example: 'Authorization: Bearer your-jwt-token'
      },
      examples: {
        'Create Product': {
          method: 'POST',
          url: '/products',
          headers: { 'Authorization': 'Bearer your-token', 'Content-Type': 'application/json' },
          body: { name: 'New Product', description: 'Product description' }
        },
        'Get Products': {
          method: 'GET',
          url: '/products?page=1&limit=10',
          headers: { 'Authorization': 'Bearer your-token' }
        }
      }
    };

    // Simple HTML documentation
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${apiDocs.title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
            h2 { color: #007acc; margin-top: 30px; }
            h3 { color: #555; }
            .endpoint { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #007acc; }
            .method { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; margin-right: 10px; }
            .get { background: #28a745; }
            .post { background: #007bff; }
            .put { background: #ffc107; color: #212529; }
            .delete { background: #dc3545; }
            .auth-required { color: #dc3545; font-weight: bold; }
            .code { background: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; margin: 10px 0; overflow-x: auto; }
            .example { background: #e9ecef; padding: 15px; border-radius: 4px; margin: 10px 0; }
            .nav { background: #007acc; color: white; padding: 20px; margin: -40px -40px 30px -40px; border-radius: 8px 8px 0 0; }
            .nav h1 { color: white; margin: 0; border: none; padding: 0; }
            .nav p { margin: 5px 0 0 0; opacity: 0.9; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nav">
                <h1>${apiDocs.title}</h1>
                <p>Version ${apiDocs.version} | ${apiDocs.description}</p>
                <p>Base URL: <strong>${apiDocs.baseUrl}</strong></p>
            </div>

            <h2>📋 Available Endpoints</h2>
            ${apiDocs.endpoints.map(endpoint => `
                <div class="endpoint">
                    <h3>
                        <span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
                        <code>${endpoint.path}</code>
                        ${endpoint.auth ? '<span class="auth-required">🔒 Auth Required</span>' : ''}
                    </h3>
                    <p>${endpoint.description}</p>
                    ${endpoint.params ? `<p><strong>Parameters:</strong> <code>${JSON.stringify(endpoint.params)}</code></p>` : ''}
                    ${endpoint.query ? `<p><strong>Query:</strong> <code>${JSON.stringify(endpoint.query)}</code></p>` : ''}
                    ${endpoint.body ? `<p><strong>Body:</strong> <code>${JSON.stringify(endpoint.body)}</code></p>` : ''}
                    <p><strong>Response:</strong></p>
                    <div class="code">${JSON.stringify(endpoint.response, null, 2)}</div>
                </div>
            `).join('')}

            <h2>🔐 Authentication</h2>
            <div class="example">
                <p><strong>Type:</strong> ${apiDocs.authentication.type}</p>
                <p><strong>Description:</strong> ${apiDocs.authentication.description}</p>
                <div class="code">${apiDocs.authentication.example}</div>
            </div>

            <h2>💡 Examples</h2>
            ${Object.entries(apiDocs.examples).map(([name, example]) => `
                <div class="example">
                    <h3>${name}</h3>
                    <div class="code">
${example.method} ${example.url}
${Object.entries(example.headers).map(([key, value]) => `${key}: ${value}`).join('\n')}

${example.body ? JSON.stringify(example.body, null, 2) : ''}
                    </div>
                </div>
            `).join('')}

            <h2>🔗 JSON API Documentation</h2>
            <p>Get the raw API documentation data: <a href="/api/docs.json">/api/docs.json</a></p>
        </div>
    </body>
    </html>
    `;

    reply.type('text/html');
    return html;
  });

  // JSON API documentation endpoint
  fastify.get('/api/docs.json', async (request, reply) => {
    return {
      title: 'Fastify Starter API',
      version: '1.0.0',
      description: 'RESTful API built with Fastify framework',
      baseUrl: `${request.protocol}://${request.hostname}:3000`,
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check endpoint' },
        { method: 'GET', path: '/info', description: 'Get API information' },
        { method: 'GET', path: '/products', description: 'Get paginated list of products', auth: true },
        { method: 'GET', path: '/products/:id', description: 'Get specific product by ID', auth: true },
        { method: 'POST', path: '/products', description: 'Create new product', auth: true },
        { method: 'PUT', path: '/products/:id', description: 'Update existing product', auth: true },
        { method: 'DELETE', path: '/products/:id', description: 'Delete product', auth: true }
      ]
    };
  });

  fastify.log.info('📚 API documentation available at /docs');
});
