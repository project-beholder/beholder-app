// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/run';
import {div, makeDOMDriver } from '@cycle/dom';

// Local
import NodePalette from './Components/NodePalette';
import NodeManager from './NodeManager';

function main(sources: any) {
  const { DOM } = sources;

  // only do this for global events
  const documentKeyDown$ = fromEvent(document, 'keydown');
  const spacebar$ = documentKeyDown$.filter((ev) => ev.key === ' ');
  const esc$ = documentKeyDown$.filter((ev) => ev.key === 'Escape');

  const mousePos$ = DOM.events('mousemove').map((ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY }));

  const mouseUp$ = xs.merge(DOM.events('mouseup'), DOM.events('mouseleave'));
  
  const paletteProp$ = xs.merge(spacebar$.mapTo({ display: true }), esc$.mapTo({ display: false }))
    .startWith({ display: false });

  const palette = NodePalette({ DOM: sources.DOM, props$: paletteProp$ });
  const nodeManager = NodeManager({ DOM: sources.DOM, mouseUp$, mousePos$, create$: palette.create$ });

  const vdom$ = xs.combine(palette.DOM, nodeManager.DOM)
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
// Switch to map datastructure for graph https://www.youtube.com/watch?v=hRSwSAr-gok
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
