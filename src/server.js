const env = require('./config/env');
const logger = require('./config/logger');
const { createApp } = require('./app');

const app = createApp();

function startServer() {
  const server = app.listen(env.port, () => {
    logger.info(`Task Manager API listening on port ${env.port}`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
