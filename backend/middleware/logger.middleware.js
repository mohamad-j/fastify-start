export async function loggerMiddleware(req, reply) {
  req.log.info(`[Middleware] ${req.method} ${req.url}`);
}
