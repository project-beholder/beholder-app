function getKeyCode(key) {
  switch (key) {
    case 'a': return '00';
    case 's': return '01';
    case 'd': return '02';
    case 'f': return '03';
    case 'h': return '04';
    case 'g': return '05';
    case 'z': return '06';
    case 'x': return '07';
    case 'c': return '08';
    case 'v': return '09';

    case 'b': return '0B';
    case 'q': return '0C';
    case 'w': return '0D';
    case 'e': return '0E';
    case 'r': return '0F';
    case 'y': return '10';
    case 't': return '11';
    case '1': return '12';
    case '2': return '13';
    case '3': return '14';

    case '4': return '15';
    case '6': return '16';
    case '5': return '17';
    case '=': return '18';
    case '9': return '19';
    case '7': return '1A';
    case '-': return '1B';
    case '8': return '1C';
    case '0': return '1D';
    case ']': return '1E';

    case 'o': return '1F';
    case 'u': return '20';
    case '[': return '21';
    case 'i': return '22';
    case 'p': return '23';
    case 'RETURN': return '24';
    case 'l': return '25';
    case 'j': return '26';
    case "'": return '27';
    case 'k': return '28';

    case ';': return '29';
    case '\\': return '2A';
    case ',': return '2B';
    case '/': return '2C';
    case 'n': return '2D';
    case 'm': return '2E';
    case '.': return '2F';
    case 'TAB': return '30';
    case 'SPACE': return '31';
    case '~': return '32';
    case 'DELETE': return '33';
    case 'ESC': return '35';

    case '←': return '7B';
    case '→': return '7C';
    case '↓': return '7D';
    case '↑': return '7E';
  }
}

// https://stackoverflow.com/questions/1918841/how-to-convert-ascii-character-to-cgkeycode/14529841#14529841][1]
module.exports = getKeyCode;
