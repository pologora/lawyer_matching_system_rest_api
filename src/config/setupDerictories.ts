/* eslint-disable no-console */
// setupDirectories.js
import fs from 'fs';
import path from 'path';
// Define the directories you want to create
const directories = [
  path.join(__dirname, '..', '..', 'logs'),
  path.join(__dirname, '..', '..', 'public', 'img', 'users'),
];

// Function to create directories if they don't exist
directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});
