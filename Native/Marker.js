const Vec2 = require('./Utils/Vec2.js');

const MARKER_TIMEOUT_DEFAULT = 1000 / 20; 
const AXIS_VEC = new Vec2(1, 0);

class Marker {
  constructor(ID) {
    this.timeout = MARKER_TIMEOUT_DEFAULT;
    this.timestamp = this.timeout;

    this.present = false;
    this.justPresent = false;
    this.justNotPresent = false;

    this.center = new Vec2(0,0);
    this.position = new Vec2(0,0);
    this.rawPosition = new Vec2(0,0);
    this.deltaPosition = new Vec2(0, 0);
    this.corners = [];
    this.rawRotation = 0;
    this.rotation = 0;
    this.deltaRotation = 0;
    this.scale = 29 / 640; // Default based on my markers and camera default of 640
    this.enable3D = false;
    this.avgSideLength = 0;
    this.deltaAvgSideLength = 0;
    this.id = ID;
    this.posX = 0;
    this.posY = 0;

    this.positionSmoothing = 0; // Percent of previous position carried over into the new one, must be btw 0 and 1
    this.rotationSmoothing = 0; // Percent of previous rotation carried over into the new one, must be btw 0 and 1
  }

  setScale(markerSize, cameraWidth) {
    this.scale = markerSize / cameraWidth;
  }

  update(m) {
    const [id, x, y, rotation] = m;
    this.timestamp = 0;
    this.present = true;

    this.deltaPosition.copy(this.position);
    // console.log(this.position.x);
    let prevCenter = this.center.clone();

    this.center.x = (this.center.x * this.positionSmoothing) + (x * (1-this.positionSmoothing));
    this.center.y = (this.center.y * this.positionSmoothing) + (y * (1-this.positionSmoothing));
    this.position.copy(this.center);
    this.rawPosition.x = x;
    this.rawPosition.x = y;
    this.posX = this.center.x;
    this.posY = this.center.y;

    this.deltaPosition.sub(this.position).scale(-1); // bc we changed center this should be cool now

    // For some reason it broke. This will just fix it real quick
    if (isNaN(this.center.x) || isNaN(this.center.y)) {
      this.center.set(prevCenter.x, prevCenter.y);
      this.position.set(prevCenter.x, prevCenter.y);
      this.deltaPosition.set(0, 0);
      this.rawP
      console.warn('BEHOLDER: Detection Broke Momentarily');
    }

    // Rotation stuff, now with smoothing!
    this.rawRotation = rotation;
    const prevRotationVec = Vec2.fromAngle(this.rotation);
    const newRotationVec = Vec2.fromAngle(this.rawRotation);
    const smoothedRotationVec = new Vec2(
      (prevRotationVec.x * (this.rotationSmoothing)) + (newRotationVec.x * 1 - this.rotationSmoothing),
      (prevRotationVec.y * (this.rotationSmoothing)) + (newRotationVec.y * 1 - this.rotationSmoothing)
    );
    this.rotation = smoothedRotationVec.getAngle();

    this.deltaRotation = Vec2.angleBetween(prevRotationVec, smoothedRotationVec);

    // this.deltaAvgSideLength = -this.avgSideLength;
    // this.avgSideLength = (sides[0] + sides[1] + sides[2] + sides[3]) / 4;
    // this.deltaAvgSideLength += this.avgSideLength;
  }

  updatePresence(dt) {
    // throttle max timeout to 50
    this.timestamp += dt > 30 ? 30 : dt;
    this.present = (this.timestamp >= this.timeout) ? false : true;
  }
}

module.exports = Marker;
