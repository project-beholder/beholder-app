const address = require('address');

// arg here must be an int for now
const keyEmulator = require('./build/Release/keyboard_emulator');
keyEmulator.init();

// default interface 'eth' on linux, 'en' on osx.
console.log(address.ip())   // '192.168.0.2'

const dgram = require('node:dgram');
const Marker = require('./Marker.js');

// Marker stuff
const markers = [];
for (let i = 0; i < 12; i++) {
  // only track 1st 12 markers for now?
  markers.push(new Marker(i));
}

// TEMP KEYBOARD TRIGGER
let was0Present = false;

const presentToInt = (p) => p ? 1 : 0;
// THIS SHOULD BE A TREE DATASTRUCTURE

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

  // 2 process listers and dispatch key events
  if (markers[0].present && !was0Present) {
    keyEmulator.press(7);
  } else if (!markers[0].present && was0Present) {
    keyEmulator.release(7);
  }
  was0Present = markers[0].present;

  // keyEmulator.press(7);
  // keyEmulator.release(7);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(8484);

// do a graph structure of all of the nodes
// separate stack of just marker nodes
