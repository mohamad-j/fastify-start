import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from '@fastify/static';
import { container } from './di/container.js';
import { UserService } from './services/user.service.js';
import { RequestContainer } from './di/request-container.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({ logger: true });
 // Register the static file handler
  app.register(fastifyStatic, {
    root: join(__dirname, 'public'),
    prefix: '/public/', // all requests with /public/ will be served from the public directory
    decorateReply: false, // the reply decorator has been added by the first plugin registration
  });

container.register('UserService', UserService);

app.addHook('onRequest', async (req, reply) => {
  req.di = new RequestContainer(container);
});

app.register(AutoLoad, { dir: join(__dirname, 'plugins') });

app.register(AutoLoad, { dir: join(__dirname, 'routes') });

app.listen({ port: 3000, host: '0.0.0.0'  }, (err, address) => {
  if (err) throw err;
  console.log(`Server ready at ${address}`);
});
