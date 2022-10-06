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
        uuid,
        output: [],
        selected: false,
      };
    case 'key':
      return {
        ...props,
        uuid,
        input: [],
        selected: false,
      };
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
      nodes[action.props.uuid].x = action.props.x - action.props.offsetX;
      nodes[action.props.uuid].y = action.props.y - action.props.offsetY;
      break;
    case 'connect':
      const { start, end } = action.props;
      if (start.type === 'output' && end.type == 'input') {
        nodes[start.parent].output.push({
          offsetX: parseFloat(start.offsetX),
          offsetY: parseFloat(start.offsetY),
          field: start.name,
          target: { 
            ...end,
            offsetX: parseFloat(end.offsetX),
            offsetY: parseFloat(end.offsetY),
          },
        });
      } else if (end.type === 'output' && start.type == 'input') {
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
      }
      globalSendToServer(nodes);
      UndoRedoManager.pushUndoState(nodes);
      // only connected 1 way atm, let's see if it works (output -> input)
      // also should validate if this is any good
      break;
    case 'select':
      // deselect all others unless it's a multiselect
      R.values(nodes).forEach((n) => {
        n.selected = false;
      });
      nodes[action.uuid].selected = true;
      break;
    case 'deselect':
      R.values(nodes).forEach((n) => {
        n.selected = false;
      });
      break;
    case 'delete':
      // remove all refs to it
      R.values(nodes).forEach(() => {
        console.warn('peter remove connections on delete once connections work again')
      });
      delete nodes[action.uuid]
      UndoRedoManager.pushUndoState(nodes);
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
      console.log(nodes);
      globalSendToServer(nodes);
      break;
  }
  return nodes;
}
