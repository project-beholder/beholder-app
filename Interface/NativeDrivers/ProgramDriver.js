const { spawn, exec } = require('node:child_process');
const process = require('node:process');
const R = require('ramda');
// const Vec2 = require('./Utils/Vec2.js');
const xs = require('xstream').default;


let getKeyCode;
if (process.platform === 'win32') getKeyCode = require('./NativeDrivers/Utils/WinKeyMap.js');
else getKeyCode = require('./NativeDrivers/Utils/MacKeyMap.js');

let keyThread;

function pressKey(key) {
  const hex = getKeyCode(key);
  console.log(hex);
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

function initKeyboard() {
  if (process.platform === 'win32') keyThread = spawn('./Native/KeyboardEmulation/build/keyboardEmulation.exe');
  else keyThread = spawn('./Native/KeyboardEmulation/build/keyboardEmulation');
  keyThread.stdin.setDefaultEncoding('utf-8');
  keyThread.stdout.on('data', (rawData) => {
      console.log(`stdout keyboard: ${rawData}`);
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


let programGraph = {}
function updateNode(node, input) {
  let trigger = false;
  switch (node.type) {
    case 'key-press':
      console.log(input);
      // 2 process listers and dispatch key events
      if (input && !node.isDown) {
        pressKey(node.value);
        node.isDown = true;
      }

      if (!input && node.isDown) {
        releaseKey(node.value);
        node.isDown = false;
      }
      break;
    case 'key-tap':
      // tap key once when triggered
      if (input && !node.isDown) {
        pressKey(node.value);
        releaseKey(node.value);
        node.isDown = true;
      }

      if (!input && node.isDown) node.isDown = false;
      break;
    case 'marker':
      // input for a marker node will be the markers

      // make sure marker properties match in the detection code
      input[node.ID].timeout = node.timeout;
      // set node properties for rendering

      // this could possibly change when displaying data live feed
      node.output.forEach((out) => {
        updateNode(programGraph[out.target.parent], input[node.ID][out.field]);
      });
      break;
    case 'value-change':
      // add value to running tab
      node.totalDelta += input - node.lastValue;
      node.lastValue = input;

      // if threshold is exceeded, reset to zero and pass true to all children
      if (node.threshold >= 0) {
        if (node.totalDelta >= node.threshold) {
          trigger = true;
          node.totalDelta = 0;
        }
        // need to clamp at zero
        node.totalDelta = R.clamp(0, node.threshold, node.totalDelta);
      } else {
        if (node.totalDelta <= node.threshold) {
          trigger = true;
          node.totalDelta = 0;
        }

        node.totalDelta = R.clamp(node.threshold, 0, node.totalDelta);
      }

      // pass trigger state to all children
      node.output.forEach((out) => updateNode(programGraph[out.target.parent], trigger));
      break;
    case 'angle-change':
      // add value to running tab
      const currentRotVec = Vec2.fromAngle(input / 180 * Math.PI);
      const prevRotVec = Vec2.fromAngle(node.lastValue / 180 * Math.PI);
      node.totalDelta += prevRotVec.angleBetween(currentRotVec) / Math.PI * 180;
      node.lastValue = input;

      // if threshold is exceeded, reset to zero and pass true to all children
      if (node.threshold >= 0) {
        if (node.totalDelta >= node.threshold) {
          trigger = true;
          node.totalDelta = 0;
        }
        // need to clamp at zero
        node.totalDelta = R.clamp(0, node.threshold, node.totalDelta);
      } else {
        if (node.totalDelta <= node.threshold) {
          trigger = true;
          node.totalDelta = 0;
        }

        node.totalDelta = R.clamp(node.threshold, 0, node.totalDelta);
      }

      // pass trigger state to all children
      node.output.forEach((out) => updateNode(programGraph[out.target.parent], trigger));
      break;
      break;
    default: break;
  }
}

function runProgram(markerData) {
  Object.values(programGraph)
    .filter(R.propEq('type', 'detection'))
    .forEach((node) => {
      // console.log(node);
      node.output.forEach((out) => {
        updateNode(programGraph[out.target.parent], markerData);
      });
    });
}

function ProgramDriver(programGraph$) {
  initKeyboard();
  console.log(keyThread);
  programGraph$.subscribe({
    next: (p) => {
      // console.log('program set', p)
      programGraph = R.clone(p)
    },
  });

  return xs.empty();
}

// EX marker datastructure
// 0981d347-6b9a-4090-963b-a9be2fa7249e:
  // input: []
  // key: "x"
  // type: "key"
  // uuid: "0981d347-6b9a-4090-963b-a9be2fa7249e"
  // x: 318
  // y: 260
// d7797737-8fd7-4233-b15c-598f7e6484aa:
  // markerID: 0
  // output: [
    // 0: {offsetX: 106, offsetY: 84, field: 'rotation', target: {…}}
  // ]
  // type: "marker"
  // uuid: "d7797737-8fd7-4233-b15c-598f7e6484aa"
  // x: 10
  // y: 10
