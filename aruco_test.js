// This file is to test whether aruco detection through C++ and node-gyp is working as intended 

const markerDetector = require('./build/Release/marker_detection');

setTimeout(() => markerDetector.detect(0), 5000);