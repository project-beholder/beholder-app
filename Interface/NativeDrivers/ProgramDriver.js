// console.log(path.join(__dirname, `../../../Native/LocalMarkerDetection/build/detectMarker${process.platform == 'win32' ? '.exe' : ''}`));
let keyEmulationPath = `./Native/KeyboardEmulation/build/keyboardEmulation${process.platform == 'win32' ? '.exe' : ''}`;
if (IS_MAC_PROD) keyEmulationPath = path.join(__dirname, '../../../Native/KeyboardEmulation/build/keyboardEmulation');

let getKeyCode;
if (process.platform === 'win32') getKeyCode = require('./NativeDrivers/Utils/WinKeyMap.js');
else getKeyCode = require('./NativeDrivers/Utils/MacKeyMap.js');

let keyThread;
let shouldRun = false;

// hack for periodic :()
let dt = 0;

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
  keyThread = spawn(keyEmulationPath);
  window.addEventListener("beforeunload", () => { keyThread.kill() });
  keyThread.stdin.setDefaultEncoding('utf-8');
  keyThread.stdout.on('data', (rawData) => {
      // console.log(`stdout keyboard: ${rawData}`);
      // const data = JSON.parse(rawData);
  });
  
  // Make sure to kill the child process on exit or mem leak
  process.on('SIGINT', () => { process.exit(0); });
  process.on('SIGTERM', () => { process.exit(0); });
  process.on('exit', () => {
      console.log('Killing thread child process');
      keyThread.kill();
  });
}


let programGraph = {}
function updateNode(node, input, field) {
  let trigger = false;
  switch (node.type) {
    case 'key-press':
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
      R.values(node.outputs).forEach((out) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], input[node.ID][out.property], t.field));
      });
      break;
    case 'value-change':
      // add value to running tab
      node.totalDelta += input - node.lastValue;
      node.lastValue = input;

      // if threshold is exceeded, reset to zero and pass true to all children
      if (node.THRESHOLD >= 0) {
        if (node.totalDelta >= node.THRESHOLD) {
          trigger = true;
          node.totalDelta = 0;
        }
        // need to clamp at zero
        node.totalDelta = R.clamp(0, node.THRESHOLD, node.totalDelta);
      } else {
        if (node.totalDelta <= node.THRESHOLD) {
          trigger = true;
          node.totalDelta = 0;
        }

        node.totalDelta = R.clamp(node.THRESHOLD, 0, node.totalDelta);
      }

      // pass trigger state to all children
      // this could possibly change when displaying data live feed
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], trigger, t.field));
      });
      break;
    case 'angle-change':
      // add value to running tab
      const currentRotVec = Vec2.fromAngle(input / 180 * Math.PI);
      const prevRotVec = Vec2.fromAngle(node.lastValue / 180 * Math.PI);
      node.totalDelta += prevRotVec.angleBetween(currentRotVec) / Math.PI * 180;
      node.lastValue = input;

      // if threshold is exceeded, reset to zero and pass true to all children
      if (node.THRESHOLD >= 0) {
        if (node.totalDelta >= node.THRESHOLD) {
          trigger = true;
          node.totalDelta = 0;
        }
        // need to clamp at zero
        node.totalDelta = R.clamp(0, node.THRESHOLD, node.totalDelta);
      } else {
        if (node.totalDelta <= node.THRESHOLD) {
          trigger = true;
          node.totalDelta = 0;
        }

        node.totalDelta = R.clamp(node.threshold, 0, node.totalDelta);
      }

      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], trigger, t.field));
      });
      break;
    case 'AND':
      // expected fields are A and B
      node[field] = input;
      node.wasTrue = (node.A && node.B);
      
      // console.log(node, input, field);
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'NOT':
      // expected fields are A and B
      node[field] = !input;
      node.wasTrue = (node.value);
      
      // console.log(node, input, field);
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'OR':
      // expected fields are A and B
      node[field] = input;
      node.wasTrue = (node.A || node.B);
      
      // console.log(node, input, field);
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'greater-than':
      // expected fields are A and B
      node[field] = input;
      node.wasTrue = (node.A > node.B);
      
      // console.log(node, input, field);
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'less-than':
      // expected fields are A and B
      node[field] = input;
      node.wasTrue = (node.A < node.B);
      
      // console.log(node, input, field);
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'between':
      // expected fields are A and B
      node[field] = input;
      node.wasTrue = (node.A < node.X && node.X < node.B);
      console.log(node.A, node.X, node.B);
      
      // pass trigger state to all children
      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.wasTrue, t.field));
      });
      break;
    case 'periodic':
      node[field] = input;
      node.totalDt += dt;
      if (!node.ACTIVE) node.isOn = false;
      if (node.totalDt >= node.PERIOD && node.ACTIVE) {
        node.totalDt = 0;
        node.isOn = !node.isOn;
      }

      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], node.isOn, t.field));
      });
      break;
      
    default: break;
  }
}

function runProgram(markerData, deltaTime) {
  dt = deltaTime;
  if (!shouldRun) {
    // make sure nodes aren't showing trigger
    Object.values(programGraph)
      .filter(R.propSatisfies(R.includes('key'), 'type'))
      .forEach((n) => n.isDown = false);
    return;
  }

  Object.values(programGraph)
    .filter(R.propEq('type', 'detection'))
    .forEach((node) => {

      R.toPairs(node.outputs).forEach(([key, out]) => {
        out.targets.forEach((t) => updateNode(programGraph[t.uuid], markerData));
      });
    });
}

function ProgramDriver(programGraph$) {
  initKeyboard();

  programGraph$.subscribe({
    next: ([p, run]) => {
      shouldRun = run;
      programGraph = p;
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
