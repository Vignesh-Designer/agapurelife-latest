const { spawn } = require('child_process');
const path = require('path');

console.log('🌿 Starting Agápure Platform (Node.js Backend + Next.js Frontend)...');

// 1. Start Backend on Port 5000
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Frontend on Port 3000
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
