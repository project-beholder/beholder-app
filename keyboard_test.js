// This file is for testing the c++ keyboard emulator is working as intended

const keyEmulator = require('./build/Release/keyboard_emulator');

keyEmulator.init();
setTimeout(() => keyEmulator.press(7), 5000);
setTimeout(() => keyEmulator.release(7), 5100);

setTimeout(() => keyEmulator.press(8), 5200);
setTimeout(() => keyEmulator.release(8), 5300);

setTimeout(() => keyEmulator.press(9), 5400);
setTimeout(() => keyEmulator.release(9), 5500);
