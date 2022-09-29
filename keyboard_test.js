// This file is for testing the c++ keyboard emulator is working as intended

const keyEmulator = require('./build/Release/keyboard_emulator');

// keyEmulator.init();a
setTimeout(() => keyEmulator.press(0x41), 5000);
setTimeout(() => keyEmulator.release(0x41), 10000);

// setTimeout(() => keyEmulator.press(0x42), 10000);
// // setTimeout(() => keyEmulator.release(0x42), 5600);

// setTimeout(() => keyEmulator.press(0x43), 6000);
// // setTimeout(() => keyEmulator.release(0x43), 6100);
