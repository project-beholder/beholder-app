function getKeyCode(key) {
  switch (key) {
    case 'a': return 0x00;
    case 's': return 0x01;
    case 'd': return 0x02;
    case 'f': return 0x03;
    case 'h': return 0x04;
    case 'g': return 0x05;
    case 'z': return 0x06;
    case 'x': return 0x07;
    case 'c': return 0x08;
    case 'v': return 0x09;

    case 'b': return 0x0B;
    case 'q': return 0x0C;
    case 'w': return 0x0D;
    case 'e': return 0x0E;
    case 'r': return 0x0F;
    case 'y': return 0x10;
    case 't': return 0x11;
    case '1': return 0x12;
    case '2': return 0x13;
    case '3': return 0x14;

    case '4': return 0x15;
    case '6': return 0x16;
    case '5': return 0x17;
    case '=': return 0x18;
    case '9': return 0x19;
    case '7': return 0x1A;
    case '-': return 0x1B;
    case '8': return 0x1C;
    case '0': return 0x1D;
    case ']': return 0x1E;

    case 'o': return 0x1F;
    case 'u': return 0x20;
    case '[': return 0x21;
    case 'i': return 0x22;
    case 'p': return 0x23;
    case 'RETURN': return 0x24;
    case 'l': return 0x25;
    case 'j': return 0x26;
    case "'": return 0x27;
    case 'k': return 0x28;

    case ';': return 0x29;
    case '\\': return 0x2A;
    case ',': return 0x2B;
    case '/': return 0x2C;
    case 'n': return 0x2D;
    case 'm': return 0x2E;
    case '.': return 0x2F;
    case 'TAB': return 0x30;
    case 'SPACE': return 0x31;
    case '~': return 0x32;
    case 'DELETE': return 0x33;
    case 'ESC': return 0x35;

    case '←': return 0x7B;
    case '→': return 0x7C;
    case '↓': return 0x7D;
    case '↑': return 0x7E;
  }
}

// https://stackoverflow.com/questions/1918841/how-to-convert-ascii-character-to-cgkeycode/14529841#14529841][1]
module.exports = getKeyCode;
