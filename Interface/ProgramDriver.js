const { spawn, exec } = require('node:child_process');
const R = require('ramda');
const xs = require('xstream').default;

const getKeyCode = require('../Native/KeyboardEmulation/MacKeyMap.js');

let keyThread;

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

function initKeyboard() {
  keyThread = spawn('./Native/KeyboardEmulation/build/keyboardEmulation');
  keyThread.stdin.setDefaultEncoding('utf-8');
  // keyThread.stdout.on('data', (rawData) => {
  //     // console.log(`stdout keyboard: ${rawData}`);
  //     // const data = JSON.parse(rawData);
  // });
  
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
  switch (node.type) {
    case 'key':
      // 2 process listers and dispatch key events
      if (input && !node.isDown) {
        // console.log('release!', keyNode.key);
        pressKey(node.value);
        node.isDown = true;
      }

      if (!input && node.isDown) {
        // console.log('release!', keyNode.key);
        releaseKey(node.value);
        node.isDown = false;
      }
      break;
    case 'marker':
      // input for a marker node will be the markers
      // this could possibly change when displaying data live feed
      node.output.forEach((out) => {
        updateNode(programGraph[out.target.parent], input[node.ID][out.field]);
      });
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
