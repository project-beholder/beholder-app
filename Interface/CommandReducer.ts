// Lib
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';

// Local
import UndoRedoManager from './UndoRedoManager';

function createNode(props, uuid) {
  // Could replace this with an object that has functions for processing
  switch(props.type) {
    case 'marker':
      return {
        ...props,
        ID: 0,
        uuid,
        output: [],
        selected: false,
      };
    case 'key':
      return {
        ...props,
        value: 'a',
        uuid,
        input: [],
        selected: false,
      };
    case 'number':
      return {
        ...props,
        value: 0,
        uuid,
        output: [],
        selected: false,
      }
  }
  return null; // this is an error friend
}

export default function CommandReducer(oldNodes, action) {
  let nodes = R.clone(oldNodes);

  switch(action.command) {
    case 'create':
      const uuid = uuidv4();
      nodes[uuid] = createNode(action.props, uuid);
      globalSendToServer(nodes);
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
      const { start, end } = action.props;
      if (end.type === 'output' && start.type == 'input') {
        nodes[end.parent].output.push({
          offsetX: parseFloat(end.offsetX),
          offsetY: parseFloat(end.offsetY),
          field: end.name,
          target: {
            ...start,
            offsetX: parseFloat(start.offsetX),
            offsetY: parseFloat(start.offsetY),
          },
        });

        if (nodes[end.parent].type === 'number') {
          nodes[start.parent][start.name] = nodes[end.parent].value;
        }
      }
      globalSendToServer(nodes);
      UndoRedoManager.pushUndoState(nodes);
      // only connected 1 way atm, let's see if it works (output -> input)
      // also should validate if this is any good
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
      R.values(nodes).forEach((n) => {
        console.warn('peter remove connections on delete once connections work again');

        if (n.selected) {
          R.values(nodes).forEach((n2) => {
            if (n2.output && n2.output.length > 0) {
              n2.output = n2.output.filter((o) => o.target.parent != n.uuid);
            }
          });
          
          delete nodes[n.uuid];

        }
      });
      // delete nodes[action.uuid]
      UndoRedoManager.pushUndoState(nodes);
      globalSendToServer(nodes);
      break;
    case 'undo':
      if (UndoRedoManager.canUndo()) {
        nodes = UndoRedoManager.undo();
        globalSendToServer(nodes);
      }
      break;
    case 'redo':
      if (UndoRedoManager.canRedo()) {
        nodes = UndoRedoManager.redo();
        globalSendToServer(nodes);
      }
      break;
    case 'value-change':
      nodes[action.uuid][action.prop] = action.newValue;
      UndoRedoManager.pushUndoState(nodes);

      // if it's a variable input, send that to all child values
      if (nodes[action.uuid].type === 'number') {
        nodes[action.uuid].output.forEach((o) => {
          // console.log(o);
          nodes[o.target.parent][o.target.name] = action.newValue
        });
      }
      globalSendToServer(nodes);
      break;
  }
  return nodes;
}
