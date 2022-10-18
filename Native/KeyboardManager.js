const { spawn, ChildProcess } = require('node:child_process');
const path = require('path');

const getKeyCode = require('./MacKeyMap.js');



let keyThread;
// Marker stuff
let prevTime = Date.now();

function loop() {
  keyThread.stdin.cork();
  keyThread.stdin.write('000\r\n');
  keyThread.stdin.uncork();
}

function pressKey(key) {
  const hex = getKeyCode(key);
  keyThread.stdin.cork();
  keyThread.stdin.write(`P:${hex}\r\n`);
  keyThread.stdin.uncork();
}

function releaseKey(key) {
  const hex = getKeyCode(key);
  keyThread.stdin.cork();
  keyThread.stdin.write(`R:${hex}\r\n`);
  keyThread.stdin.uncork();
}


function init() {
  keyThread = spawn(path.join(__dirname, './KeyboardEmulation/build/keyboardEmulation'));
  keyThread.stdin.setDefaultEncoding('utf-8');
  keyThread.stdout.on('data', (rawData) => {
      console.log(`stdout: ${rawData}`);
      // const data = JSON.parse(rawData);
  });
  
  // Make sure to kill the child process on exit or mem leak
  process.on('SIGINT', () => { process.exit(0); });
  process.on('SIGTERM', () => { process.exit(0); });
  process.on('exit', () => {
      console.log('Killing child process');
      keyThread.kill();
  });
}

module.exports = { init, pressKey, releaseKey };
