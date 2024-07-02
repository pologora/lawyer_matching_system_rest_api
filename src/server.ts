/* eslint-disable no-console */
import { app } from './app';

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});
