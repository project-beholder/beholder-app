// const { spawn } = require('node:child_process');
const Marker = require('./NativeDrivers/Utils/Marker.js');
const Vec2 = require('./NativeDrivers/Utils/Vec2.js');

const AXIS_VEC = new Vec2(1.0, 0);

function WebcamDetectionDriver(cameraFeedChanges$) {
  // Marker stuff
  const markers = [];
  for (let i = 0; i < 1000; i++) {
    // We are keeping tabs on 1000 markers... should be fine since they are not present but...
    markers.push(new Marker(i));
  }

  let shouldFlip = 0;
  cameraFeedChanges$.subscribe({
    next: ({ type, value }) => {
      switch(type) {
        case 'camera-feed':
          detectThread.stdin.cork();
          detectThread.stdin.write(`10${value}0\r\n`);
          detectThread.stdin.uncork();
          break;
        case 'flip':
          shouldFlip = value;
          break;
      }
    },
  })

  // detection thread init
  let detectThread;
  if (process.platform === 'win32') detectThread = spawn('./Native/LocalMarkerDetection/build/detectMarker.exe');
  else detectThread = spawn(path.join(__dirname, '../../Native/LocalMarkerDetection/build/detectMarker'));
  detectThread.stdin.setDefaultEncoding('utf-8');
  window.addEventListener("beforeunload", () => { detectThread.kill() });

  let prevDetectTime = Date.now();
  let detectFrameTime = 0;

  // runs detection every frame for now
  const detectionLoop = () => {
    const currTime = Date.now();
    const dt = currTime - prevDetectTime;
    prevDetectTime = currTime;

    detectFrameTime -= dt;

    if (detectFrameTime <= 0) {
      detectFrameTime = 1000 / 45; // Detection FPS HERE

      detectThread.stdin.cork();
      detectThread.stdin.write(`001${shouldFlip}\r\n`);
      detectThread.stdin.uncork();
    } else {
      requestAnimationFrame(detectionLoop);
    }
  }

  const detectedProducer = {
    start: function(listener) {
      let prevMarkerTime = Date.now();

      const updateMarkers = (detectedMarkers) => {
        const currTime = Date.now();
        const dt = currTime - prevMarkerTime;
        prevMarkerTime = currTime;
    
        // update relevant marker
        detectedMarkers.forEach((m) => {
          // calc the centerpoint
          let c0 = new Vec2(m.corners[0][0], m.corners[0][1]);
          let c1 = new Vec2(m.corners[1][0], m.corners[1][1]);
          let c2 = new Vec2(m.corners[2][0], m.corners[2][1]);
          let c3 = new Vec2(m.corners[3][0], m.corners[3][1]);
          let { x, y } = c0.add(c1).add(c2).add(c3).scale(0.25);
          let rotation = AXIS_VEC.angleBetween(c1.sub(c0));
          markers[m.id].update({ x, y, rotation, id: m.id, corners: m.corners });
        });

        markers.forEach((m) => m.updatePresence(dt));
        runProgram(markers);
        listener.next(markers);
      }

      detectThread.stdout.on('data', (rawData) => {
        // if (rawData.toString()[0] !== '{') return; // bail on nonsense messages

        // sometimes the message is bad and doubled, we drop them for now
        try {
          const data = JSON.parse(rawData);
          console.log(data)
          if (document.querySelector('.detection-img') && data.type === 'img-done') document.querySelector('.detection-img').src = `../../Native/LocalMarkerDetection/build/frame.jpg?${Date.now()}`;
          if (data.markers) {
            updateMarkers(data.markers);
            requestAnimationFrame(detectionLoop);
          }
        } catch (error) {
          // console.log(error, rawData.toString());
          // THIS PROBABLY HAPPENED BC TWO MESSAGES AT THE SAME TIME
          // below gets a new array, right now we just drop the frame
          // const regex = /\n/g;
          // console.log(rawData.toString().split(regex));
          requestAnimationFrame(detectionLoop);
        }
      });

      detectThread.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });
      
      detectThread.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

      // start the detection parade
      requestAnimationFrame(detectionLoop);
    },
  
    stop: function() {
      detectThread.kill();
    },
  };

  // runs on animation frame?
  const detection$ = xs.create(detectedProducer);
  return detection$;
}
