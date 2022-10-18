function getKeyCode(key) {
  switch (key) {
    case 'a': return 1;
    case 's': return 2;
    case 'd': return 3;
    case 'f': return 4;
    case 'h': return 5;
    case 'g': return 6;
    case 'z': return 7;
    case 'x': return 8;
    case 'c': return 9;
    case 'v': return 'a';

    case 'b': return 'b';
    case 'q': return 'c';
    case 'w': return 'd';
    case 'e': return 'e';
    case 'r': return 'f';
    case 'y': return 10;
    case 't': return 11;
    case '1': return 12;
    case '2': return 13;
    case '3': return 14;

    case '4': return 15;
    case '6': return 16;
    case '5': return 17;
    case '=': return 18;
    case '9': return 19;
    case '7': return '1a';
    case '-': return '1b';
    case '8': return '1c';
    case '0': return '1d';
    case ']': return '1e';

    case 'o': return '1f';
    case 'u': return 20;
    case '[': return 21;
    case 'i': return 22;
    case 'p': return 23;
    case 'RETURN': return 24;
    case 'l': return 25;
    case 'j': return 26;
    case "'": return 27;
    case 'k': return 28;

    case ';': return 29;
    case '\\': return '2a';
    case ',': return '2b';
    case '/': return '2c';
    case 'n': return '2d';
    case 'm': return '2e';
    case '.': return '2f';
    case 'TAB': return 30;
    case 'SPACE': return 31;
    case '`': return 32;

    case '←': return '7b';
    case '→': return '7c';
    case '↓': return '7d';
    case '↑': return '7e';
  }
}


// https://stackoverflow.com/questions/1918841/how-to-convert-ascii-character-to-cgkeycode/14529841#14529841][1]
module.exports = getKeyCode;