const address = require('address');
const { ipcMain } = require('electron');
const R = require('ramda');

// arg here must be an int for now
const keyEmulator = require('./build/Release/keyboard_emulator');
keyEmulator.init();

// default interface 'eth' on linux, 'en' on osx.
console.log(address.ip())   // '192.168.0.2'

const dgram = require('node:dgram');
const Marker = require('../Marker.js');
const getKeyCode = require('./MacKeyMap');

// Marker stuff
const markers = [];
for (let i = 0; i < 100; i++) {
  // only track 1st 12 markers for now?
  markers.push(new Marker(i));
}

// CANT HAVE MULTIPLE INPUTS TO A KEY
function updateKey(keyNode, input) {
  if (keyNode.wasPresent && !input) console.log('release!', keyNode.key);
  if (!keyNode.wasPresent && input) console.log('release!', keyNode.key);
  keyNode.wasPressed = input;
}

let programGraph = {}
function updateNode(node, input) {
  switch (node.type) {
    case 'key':
      // 2 process listers and dispatch key events
      if (input && !node.isDown) {
        keyEmulator.press(getKeyCode(node.key));
        node.isDown = true;
      }

      if (!input && node.isDown) {
        keyEmulator.release(getKeyCode(node.key));
        node.isDown = false;
      }

      // if (markers[0].present && !was0Present) {
      //   keyEmulator.press(7);
      // } else if (!markers[0].present && was0Present) {
      //   keyEmulator.release(7);
      // }
      // was0Present = markers[0].present;
      break;
    default: break;
  }
}

function runKeyEmulation() {
  Object.values(programGraph)
    .filter(R.propEq('type', 'marker'))
    .forEach((node) => {
      node.output.forEach((out) => {
        console.log(out.target);
        updateNode(programGraph[out.target.parent], markers[node.markerID][out.field]);
      });
    });
}

ipcMain.on('update_program_graph', (event, arg) => {
  programGraph = arg;
});

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

// get all the input/marker nodes
// eval their inputs 1 by 1
// END TEMP DATASTRUCTURE

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

let prevTime = Date.now();
server.on('message', (msg, rinfo) => {
  // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const currTime = Date.now();
  const dt = currTime - prevTime;
  prevTime = currTime;

  // two steps:
  // 1 update markers
  // this janky converts buffer to string
  const mUpdates = (""+msg).split(',') // separate markers
    .map(m => m.split(" ")) // separate fields
    .filter(m => m.length > 1)
    .map(m => m.map(parseFloat)); // convert to numbers
  
  // update relevant marker
  // console.log(mUpdates);
  mUpdates.forEach(m => markers[m[0]].update(m));
  markers.forEach(m => m.updatePresence(dt));
  runKeyEmulation();
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(8484);

// do a graph structure of all of the nodes
// separate stack of just marker nodes
