// Lib
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';

// Local
import UndoRedoManager from './UndoRedoManager';
import createNode from './CreateNode';

function recursiveGetUUID(nodes) {
  const newID = uuidv4();
  if (!R.isNil(nodes[newID])) return recursiveGetUUID(nodes);
  return newID
}

// This is a giant function :()
// maybe turn into a map, that just returns based on key. Only local var is "nodes"
export default function CommandReducer(oldNodes, action) {
  // let nodes = R.clone(oldNodes);
  let nodes = oldNodes;

  switch(action.command) {
    case 'create':
      if (action.props.type === 'detection' && R.values(nodes).filter(R.propEq('type', 'detection')).length == 1) {
        console.warn(`can't have 2 detection feeds atm`);
        return nodes; // bail if trying to create another detection node
      }
      const uuid = recursiveGetUUID(nodes);
      nodes[uuid] = createNode(action.props, uuid);
      UndoRedoManager.pushUndoState(nodes);
      break;
    case 'move':
      R.values(nodes).forEach((n) => {
        if (n.selected) {
          n.x += action.dx;
          n.y += action.dy;
        }
      });
      break;
    case 'connect':
      // START = input, END = output and i have no idea why, maybe fix
      const { input } = action.props;
      const output = action.props.output[0];
      const outParent = action.props.output[1];
      if (output.valueType != input.valueType) break;

      // bail if number is -1 trying to connect to marker
      if (outParent.type === 'number' && parseInt(outParent.value) < 0 && nodes[input.parent].type === 'marker') break;
      // { uuid, field }
      output.targets.push({ uuid: input.parent, field: input.name });

      nodes[input.parent].inputs[input.name].source = outParent.uuid;
      nodes[input.parent].inputs[input.name].sourceField = output.name;

      if (outParent.type === 'number') {
        nodes[input.parent][input.name] = parseInt(outParent.value);
      }
      UndoRedoManager.pushUndoState(nodes);
      // only connected 1 way atm, let's see if it works (output -> input)
      // also should validate if this is any good
      break;
    case 'remove-connection':
      const inputData = nodes[action.uuid].inputs[action.name];
      let outNode = nodes[inputData.source].outputs[inputData.sourceField];
      // filter out matching output
      outNode.targets = outNode.targets.filter((target) => !(target.uuid === action.uuid && target.field === action.name));
      // 
      inputData.pastSource = inputData.source;
      inputData.pastSourceField = inputData.sourceField;
      // clear input reference
      inputData.source = null;
      inputData.sourceField = null;

      break;
    case 'select':
      const selectCount = R.values(nodes).filter(R.prop('selected')).length;
      
      console.warn('need a clause here for move then mouseup');
      if (action.uuid === '' || (!action.multiselect && !(action.mButton === 'down' && selectCount > 1))) {
        // deselect all others unless it's a multiselect
        R.values(nodes).forEach((n) => {
          n.selected = false;
        });
      }

      if (action.uuid !== '') {
        const alreadySelected = nodes[action.uuid].selected;
        if (action.multiselect) {
          if (action.mButton === 'down') nodes[action.uuid].selected = !nodes[action.uuid].selected;
        } else if (selectCount > 1) {
          console.warn('and here');
          if (action.mBotton === 'up') {
            nodes[action.uuid].selected = true;
          }
        } else {
          nodes[action.uuid].selected = true;
        }
      }
      break;
    case 'deselect':
      R.values(nodes).forEach((n) => {
        n.selected = false;
      });
      break;
    case 'delete':
      // remove all refs to it
      R.values(nodes).forEach((toDelete) => {
        if (toDelete.selected) {
          R.values(nodes).forEach((n) => {
            R.values(n.outputs).forEach((o) => {
              o.targets = o.targets.filter((t) => t.uuid != toDelete.uuid);
            })
          });
          
          R.values(toDelete.outputs).forEach((o) => o.targets.forEach((t) => {
            nodes[t.uuid].inputs[t.field].source = null;
            nodes[t.uuid].inputs[t.field].sourceField = null;
          }));
          delete nodes[toDelete.uuid];
        }
      });
      // delete nodes[action.uuid]
      UndoRedoManager.pushUndoState(nodes);
      break;
    case 'undo':
      if (UndoRedoManager.canUndo()) {
        nodes = UndoRedoManager.undo();
      }
      break;
    case 'redo':
      if (UndoRedoManager.canRedo()) {
        nodes = UndoRedoManager.redo();
      }
      break;
    case 'value-change':
      // UndoRedoManager.pushUndoState(nodes);
      // bail if node was deleted before change event registered
      if (R.isNil(nodes[action.uuid])) break;

      // if it's a variable input, send that to all child values
      if (nodes[action.uuid].type === 'number') {
        const hasMarkerChild = R.any(R.propEq('type', 'marker'), nodes[action.uuid].outputs.value.targets.map((t) => nodes[t.uuid]));

        // hack to prevent silly number nonsense
        action.newValue = parseInt(action.newValue);
        if (R.type(action.newValue) !== 'Number' || (action.newValue < 0 && hasMarkerChild)) {
          // console.log(.value);
          action.newValue = 0;
          document.getElementById(action.uuid).querySelector('input').value = action.newValue;
          console.warn('prevented error with number input');
        }

        nodes[action.uuid].outputs.value.targets.forEach((t) => {
          nodes[t.uuid][t.field] = parseInt(action.newValue);
        });
      }

      nodes[action.uuid][action.prop] = action.newValue;

      break;
  }
  return nodes;
}
