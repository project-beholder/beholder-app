// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/run';
import {div, h2, makeDOMDriver, source } from '@cycle/dom';

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
    .map((ev: MouseEvent) => ({ x: ev.clientX / 16, y: ev.clientY / 16 }));
  
  const mouseUp$ = DOM.events('mouseup');
  
  const creatorProp$ = spacebar$.compose(sampleCombine(mousePos$))
    .map(([_, pos]) => ({ x: pos.x - 4, y: pos.y, show: true }))
    .startWith({ x: 0, y: 0, show: false });

  const creator = NodeCreator({ DOM: sources.DOM, props: creatorProp$ });
  const nodeManager = NodeManager({ DOM: sources.DOM, mouseUp$, create$: creator.create$ });

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
// Add node connection points : somehow prevent their dragging
// drag should be done at offset not from center
// mock up stream to generate
// send to keyboard emulator
// remove nodes
// remove connections
// node preview
// Consider using ramda to clean up code

// rendering of that node should be done through a pure function
// - node types: MARKER, OPERATION, KEY .... LOGIC :(
// idk how to do undo/redo
// EACH NODE SHOULD HAVE AN OUTGOING STATE STREAM
// ALL ARE COMBINED WHEN...

run(main, { DOM: makeDOMDriver('#main-app') });
