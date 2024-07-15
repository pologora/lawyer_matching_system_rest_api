/* eslint-disable no-console */
import { app } from './app';
import { logger } from './config/logger/logger';

const port = 8000;
const PORT = process.env.PORT || port;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error(err);

  server.close(() => {
    process.exit(1);
  });
});
