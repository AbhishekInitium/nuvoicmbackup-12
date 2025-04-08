
const { spawn } = require('child_process');
const path = require('path');

// Start the React development server
const reactProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Start the consolidated server
const serverProcess = spawn('node', [path.join(__dirname, 'server/server.js')], {
  stdio: 'inherit',
  shell: true
});

// Start the proxy server
const proxyProcess = spawn('node', [path.join(__dirname, 'src/proxy/proxyServer.js')], {
  stdio: 'inherit',
  shell: true
});

// Handle process exit
process.on('SIGINT', () => {
  reactProcess.kill();
  serverProcess.kill();
  proxyProcess.kill();
  process.exit();
});

console.log('Started development server with API and proxy');
