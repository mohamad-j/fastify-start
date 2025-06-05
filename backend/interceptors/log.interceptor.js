export function withLogging(handler) {
  return async function (req, reply) {
    const start = Date.now();
    const result = await handler(req, reply);
    const duration = Date.now() - start;
    req.log.info({ msg: 'Request handled', duration });
    return result;
  };
}
