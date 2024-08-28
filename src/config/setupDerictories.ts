/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';

const directories = [
  path.join(__dirname, '..', '..', 'logs'),
  path.join(__dirname, '..', '..', 'public', 'img', 'users'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});
