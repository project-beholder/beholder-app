function getKeyCode(key) {
    switch (key) {
      case 'a': return '0x41';
      case 'b': return '0x42';
      case 'c': return '0x43';
      case 'd': return '0x44';
      case 'e': return '0x45';
      case 'f': return '0x46';
      case 'g': return '0x47';
      case 'h': return '0x48';
      case 'i': return '0x49';
      case 'j': return '0x4A';
      case 'k': return '0x4B';
      case 'l': return '0x4C';
      case 'm': return '0x4D';
      case 'n': return '0x4E';
      case 'o': return '0x4F';
      
      case 'p': return '0x50';
      case 'q': return '0x51';
      case 'r': return '0x52';
      case 's': return '0x53';
      case 't': return '0x54';
      case 'u': return '0x55';
      case 'v': return '0x56';
      case 'w': return '0x57';
      case 'x': return '0x58';
      case 'y': return '0x59';
      case 'z': return '0x5A';

      case '0': return '0x30';
      case '1': return '0x31';
      case '2': return '0x32';
      case '3': return '0x33';
      case '4': return '0x34';
      case '5': return '0x35';
      case '6': return '0x36';
      case '7': return '0x37';
      case '8': return '0x38';
      case '9': return '0x39';

      case 'RETURN': return '0x0D';
      case '=': return '0xBB';
      case '-': return '0xBD';
      case '[': return '0xDB';
      case ']': return '0xDD';
      case "'": return '0xDE';
      case ';': return '0xBA';
      case '\\': return '0xDC';
      case ',': return '0xBC';
      case '/': return '0xBF';
      case '.': return '0xBE';
      case 'TAB': return '0x09';
      case 'SPACE': return '0x20';
      case '`': return '0xC0';
  
      case '←': return '0x25';
      case '↑': return '0x26';
      case '→': return '0x27';
      case '↓': return '0x28';
    }
  }
  
  
  // Mapped from https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
  module.exports = getKeyCode;