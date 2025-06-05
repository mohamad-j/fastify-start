
export default async function (app, options) {


  app.get('/', async (req, reply) => {
    return reply.render('pages/home.njk', {
      title: 'Home - My Fastify App',
      pageTitle: 'Welcome to Our Amazing App 22',
      leadText: 'Building fast and scalable web applications with Fastify and Nunjucks',
      features: [
        {
          title: 'High Performance',
          description: 'Blazing fast response times with Fastify\'s optimized architecture.'
        },
        {
          title: 'Easy Templating',
          description: 'Flexible and powerful templating with Nunjucks integration.'
        },
        {
          title: 'Dependency Injection',
          description: 'Clean and maintainable code with our custom DI container.'
        }
      ]
    });
  });
}