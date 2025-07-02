export default async function (app) {
  // Route to serve the UserProfile frontend app
  app.get('/userprofile', async (request, reply) => {
    try {
      // Data to pass to the frontend app
      const appData = {
        appName: 'UserProfile',
        framework: 'JavaScript',
        timestamp: new Date().toISOString(),
        user: request.user || null, // If user is authenticated
        // Add more data as needed
      };

      return reply.render('pages/userprofile.njk', {
        title: 'UserProfile - My Fastify App',
        pageTitle: 'UserProfile Application',
        leadText: 'A modern JavaScript application built with Fastify',
        appData: appData,
        // Additional template variables
        meta: {
          description: 'UserProfile - A modern web application',
          keywords: 'userprofile, javascript, fastify'
        }
      });
    } catch (error) {
      request.log.error('Error serving UserProfile app:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to load UserProfile application'
      });
    }
  });

  // API endpoint for the UserProfile app data
  app.get('/api/userprofile/data', async (request, reply) => {
    try {
      // Return JSON data for the frontend app
      return {
        success: true,
        data: {
          appName: 'UserProfile',
          framework: 'JavaScript',
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
      request.log.error('Error fetching UserProfile data:', error);
      reply.status(500).send({
        success: false,
        message: 'Failed to fetch app data'
      });
    }
  });

  // Health check for the UserProfile app
  app.get('/api/userprofile/health', async (request, reply) => {
    return {
      success: true,
      app: 'UserProfile',
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  });
}