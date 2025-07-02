export async function authMiddleware(request, reply) {
  try {
    const startTime = Date.now();
    
    // TODO: Implement your async middleware logic here
    console.log(`[${capitalizedName} Middleware] Processing request: ${request.method} ${request.url}`);
    
    // Example: async operations like database checks, external API calls
    // await someAsyncOperation();
    
    // Add data to request object
    request.auth = {
      processed: true,
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
    
    // Log completion
    request.log.info(`[${capitalizedName} Middleware] Completed in ${Date.now() - startTime}ms`);
    
  } catch (error) {
    request.log.error(`[${capitalizedName} Middleware] Error:`, error);
    
    // You can either:
    // 1. Continue processing (just log the error)
    // 2. Return an error response
    reply.status(500).send({
      success: false,
      message: 'Auth middleware error',
      error: error.message
    });
  }
}

// Alternative: Hook-style middleware
export async function authHook(request, reply) {
  // This can be used with app.addHook('onRequest', authHook)
  try {
    request.log.info(`[${capitalizedName} Hook] ${request.method} ${request.url}`);
    
    // TODO: Add your hook logic
    
  } catch (error) {
    request.log.error(`[${capitalizedName} Hook] Error:`, error);
    throw error; // Let Fastify handle the error
  }
}