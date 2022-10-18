const { ipcMain } = require('electron');
const R = require('ramda');

ipcMain.on('update_program_graph', (event, arg) => {
  programGraph = arg;
});

let programGraph = {}
function updateNode(node, input) {
  switch (node.type) {
    case 'key':
      // 2 process listers and dispatch key events
      if (input && !node.isDown) {
        console.log('release!', keyNode.key)
        // keyEmulator.press(getKeyCode(node.key));
        node.isDown = true;
      }

      if (!input && node.isDown) {
        console.log('release!', keyNode.key)
        // keyEmulator.release(getKeyCode(node.key));
        node.isDown = false;
      }
      break;
    default: break;
  }
}

function runProgram() {
  Object.values(programGraph)
    .filter(R.propEq('type', 'marker'))
    .forEach((node) => {
      node.output.forEach((out) => {
        console.log(out.target);
        updateNode(programGraph[out.target.parent], markers[node.markerID][out.field]);
      });
    });
}

// EX marker datastructure
// 0981d347-6b9a-4090-963b-a9be2fa7249e:
  // input: []
  // key: "x"
  // type: "key"
  // uuid: "0981d347-6b9a-4090-963b-a9be2fa7249e"
  // x: 318
  // y: 260
// d7797737-8fd7-4233-b15c-598f7e6484aa:
  // markerID: 0
  // output: [
    // 0: {offsetX: 106, offsetY: 84, field: 'rotation', target: {…}}
  // ]
  // type: "marker"
  // uuid: "d7797737-8fd7-4233-b15c-598f7e6484aa"
  // x: 10
  // y: 10
