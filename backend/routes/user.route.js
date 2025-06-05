import { container } from '../di/container.js';
import { authGuard } from '../guards/auth.guard.js';
import { withLogging } from '../interceptors/log.interceptor.js';
import { RequestIdService } from '../services/request-id.service.js';

export default async function (app) {
  const userService = container.get('UserService');

  app.get('/users', {
    preHandler: async (req, reply) => {
      req.di.set('RequestIdService', new RequestIdService());
      await authhGuard(req, reply);
    }
  }, withLogging(async (req) => {
    const requestIdService = req.di.get('RequestIdService');
    const users = userService.getAll();
    return { requestId: requestIdService.getId(), users };
  }));
}
