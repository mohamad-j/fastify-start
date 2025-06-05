

export default async function (app) {
  app.get('/health', async (req, reply) => {
    return { status: 'ok' };
  });
}
