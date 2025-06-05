

export async function authGuard(req, reply) {
  const token = req.headers['authorization'];
  if (!token || token !== 'Bearer secrettoken') {
    reply.code(401).send({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
