const { spawn, ChildProcess } = require('node:child_process');

const Marker = require('./Marker.js');

let detect;
// Marker stuff
let prevTime = Date.now();
const markers = [];
for (let i = 0; i < 1000; i++) {
  // We are keeping tabs on 1000 markers... should be fine since they are not present but...
  markers.push(new Marker(i));
}

function updateMarkers(detectedMarkers) {
  const currTime = Date.now();
  const dt = currTime - prevTime;
  prevTime = currTime;

  // two steps:
  // 1 update markers
  // this janky converts buffer to string
  // const mUpdates = (""+msg).split(',') // separate markers
  //   .map(m => m.split(" ")) // separate fields
  //   .filter(m => m.length > 1)
  //   .map(m => m.map(parseFloat)); // convert to numbers
  
  // update relevant marker
  detectedMarkers.forEach((m) => markers[m[0]].update(m));
  markers.forEach((m) => m.updatePresence(dt));
}

function loop() {
    detect.stdin.cork();
    detect.stdin.write('000\r\n');
    detect.stdin.uncork();
}

function init() {
  detect = spawn('./Native/LocalMarkerDetection/build/detectMarker');
  detect.stdin.setDefaultEncoding('utf-8');
  detect.stdout.on('data', (rawData) => {
      // console.log(`stdout: ${data}`);
      const data = JSON.parse(rawData);
      if (data.markers) updateMarkers(data.markers);
  });
  
  // Make sure to kill the child process on exit or mem leak
  process.on('SIGINT', () => { process.exit(0); });
  process.on('SIGTERM', () => { process.exit(0); });
  process.on('exit', () => {
      console.log('Killing child process');
      detect.kill();
  });

  // 30 fps?
  setInterval(loop, 30);
}

module.exports = { init };
