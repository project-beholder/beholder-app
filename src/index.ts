// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/run';
import {div, makeDOMDriver } from '@cycle/dom';

// Local
import NodeCreator from './Components/NodeCreator';
import NodeManager from './NodeManager';

function main(sources: any) {
  const { DOM } = sources;

  // only do this for global events
  const spacebar$ = fromEvent(document.querySelector('body'), 'keypress')
    .filter((ev) => ev.key === ' ');

  const mousePos$ = DOM
    .events('mousemove') // dividing bc REM size
    .map((ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY }));
  
  const mouseUp$ = xs.merge(DOM.events('mouseup'), DOM.events('mouseleave'));
  
  const creatorProp$ = spacebar$.compose(sampleCombine(mousePos$))
    .map(([_, pos]) => ({ x: pos.x - 64, y: pos.y, show: true }))
    .startWith({ x: 0, y: 0, show: false });

  const creator = NodeCreator({ DOM: sources.DOM, props$: creatorProp$ });
  const nodeManager = NodeManager({ DOM: sources.DOM, mouseUp$, mousePos$, create$: creator.create$ });

  const vdom$ = xs.combine(creator.DOM, nodeManager.DOM)
    .map(([creator, manager]) =>
      div("#cycle-root", [
        creator,
        manager,
      ])
    );

  return {
    DOM: vdom$
  };
}

// TODO
// Auto save on "connection, create"
// can load a mapping
// switch node creator to overlay
// place nodes near previous
// node preview
// remove nodes
// remove connections
// add background dots
// select item
// select multiple items
// delete items
// does this mean lines need ids :( ?
// logic nodes
// need some error handling on text input for invalid input
// Change node point classes to be: ".io-point.output" or ".io-point.input"

// rendering of that node should be done through a pure function
// - node types: MARKER, OPERATION, KEY .... LOGIC :(
// idk how to do undo/redo
// EACH NODE SHOULD HAVE AN OUTGOING STATE STREAM
// ALL ARE COMBINED WHEN...

run(main, { DOM: makeDOMDriver('#main-app') });
