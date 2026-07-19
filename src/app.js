const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const env = require('./config/env');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    })
  );

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Cloud-Native TaskSphere API'
    });
  });

  if (env.swaggerEnabled) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.use('/api/v1', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
