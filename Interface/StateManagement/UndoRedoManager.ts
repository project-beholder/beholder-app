import xs from 'xstream';
import * as R from 'ramda';

const undo$ = xs.empty();
const redo$ = xs.empty();

const undoStore: any[] = [];
const redoStore: any[] = [];
let currentState = {};

// THIS IS ANTI CYCLE, DO A STREAM VERSION with a component

// on command, push to undo stack
// on undo, pop from undo stack
export function pushUndoState(state: any) {
  undoStore.push(currentState);
  currentState = R.clone(state);
  redoStore.splice(0, redoStore.length);
}

function canUndo() {
  return undoStore.length > 0;
}

export function undo() {
  const newState = undoStore.pop();
  redoStore.push(currentState);
  currentState = newState;
  return newState;
}

function canRedo() {
  return redoStore.length > 0;
}

export function redo() {
  const newState = redoStore.pop();
  undoStore.push(currentState);
  currentState = newState;
  return newState;
}

export default {
  undo,
  redo,
  canUndo,
  canRedo,
  pushUndoState,
};
