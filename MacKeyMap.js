function getKeyCode(key) {
  switch (key) {
    case 'a': return 0;
    case 's': return 1;
    case 'd': return 2;
    case 'f': return 3;
    case 'h': return 4;
    case 'g': return 5;
    case 'z': return 6;
    case 'x': return 7;
    case 'c': return 8;
    case 'v': return 9;

    case 'b': return 11;
    case 'q': return 12;
    case 'w': return 13;
    case 'e': return 14;
    case 'r': return 15;
    case 'y': return 16;
    case 't': return 17;
    case '1': return 18;
    case '2': return 19;
    case '3': return 20;

    case '4': return 21;
    case '6': return 22;
    case '5': return 23;
    case '=': return 24;
    case '9': return 25;
    case '7': return 26;
    case '-': return 27;
    case '8': return 28;
    case '0': return 29;
    case ']': return 30;

    case 'o': return 31;
    case 'u': return 32;
    case '[': return 33;
    case 'i': return 34;
    case 'p': return 35;
    case 'RETURN': return 36;
    case 'l': return 37;
    case 'j': return 38;
    case "'": return 39;
    case 'k': return 40;

    case ';': return 41;
    case '\\': return 42;
    case ',': return 43;
    case '/': return 44;
    case 'n': return 45;
    case 'm': return 46;
    case '.': return 47;
    case 'TAB': return 48;
    case 'SPACE': return 49;
    case '`': return 50;

    case '←': return 123;
    case '↑': return 126;
    case '→': return 124;
    case '↓': return 125;
  }
}


// https://stackoverflow.com/questions/1918841/how-to-convert-ascii-character-to-cgkeycode/14529841#14529841][1]
module.exports = getKeyCode;