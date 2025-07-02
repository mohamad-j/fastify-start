export default async function (app) {
  // Route to serve the Dashboard frontend app
  app.get('/dashboard', async (request, reply) => {
    try {
      // Data to pass to the frontend app
      const appData = {
        appName: 'Dashboard',
        framework: 'Vue.js',
        timestamp: new Date().toISOString(),
        user: request.user || null, // If user is authenticated
        // Add more data as needed
      };

      return reply.render('pages/dashboard.njk', {
        title: 'Dashboard - My Fastify App',
        pageTitle: 'Dashboard Application',
        leadText: 'A modern Vue.js application built with Fastify',
        appData: appData,
        // Additional template variables
        meta: {
          description: 'Dashboard - A modern web application',
          keywords: 'dashboard, vue.js, fastify'
        }
      });
    } catch (error) {
      request.log.error('Error serving Dashboard app:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to load Dashboard application'
      });
    }
  });

  // API endpoint for the Dashboard app data
  app.get('/api/dashboard/data', async (request, reply) => {
    try {
      // Return JSON data for the frontend app
      return {
        success: true,
        data: {
          appName: 'Dashboard',
          framework: 'Vue.js',
          features: [
            'Fast loading',
            'Modern UI',
            'Responsive design'
          ],
          stats: {
            users: 0,
            views: 0,
            uptime: process.uptime()
          }
        }
      };
    } catch (error) {
      request.log.error('Error fetching Dashboard data:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch app data'
      });
    }
  });

  // Health check for the Dashboard app
  app.get('/api/dashboard/health', async (request, reply) => {
    return {
      success: true,
      app: 'Dashboard',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  });
}