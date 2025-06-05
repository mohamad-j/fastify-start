import fp from 'fastify-plugin';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import AjvCompiler from '@fastify/ajv-compiler';
import { loggerMiddleware } from '../middleware/logger.middleware.js';

export default fp(async function (app) {
  const ajv = new Ajv({ removeAdditional: true, coerceTypes: true });
  ajvFormats(ajv);
  app.setValidatorCompiler(AjvCompiler({ Ajv: ajv }));

  app.addHook('onRequest', loggerMiddleware);
});
