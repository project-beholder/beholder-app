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
  const globalKeyDown$ = fromEvent(document, 'keydown');
  const spacebar$ = globalKeyDown$.filter((ev) => ev.key === ' ');
  const esc$ = globalKeyDown$.filter((ev) => ev.key === 'Escape');
  const rightClick$ = fromEvent(document, 'contextmenu').map((ev) => { ev.preventDefault(); return ev; });

  const mousePos$ = DOM.events('mousemove')
    .fold((pos, ev: MouseEvent) => ({
      x: ev.clientX,
      y: ev.clientY,
      dx: ev.clientX - pos.x,
      dy: ev.clientY - pos.y,
      oldDx: ev.movementX,
      oldDy: ev.movementY,
    }), { x: 0, y: 0, dx: 0, dy: 0 });
  
  // .map((ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY, dx: ev.movementX, dy: ev.movementY }));

  const mouseUp$ = xs.merge(DOM.events('mouseup'), DOM.events('mouseleave'));
  const globalMouseDown$ = fromEvent(document, 'mousedown');

  const paletteHideProxy$ = xs.create();

  const palettePos$ = rightClick$.map((ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY }))
  const paletteDisplay$ = xs.merge(esc$.mapTo(false), globalMouseDown$.mapTo(false), rightClick$.mapTo(true), paletteHideProxy$.mapTo(false));
  const paletteProp$ = xs.combine(paletteDisplay$, palettePos$)
    .map(([ display, position ]) => ({ display, position }))
    .startWith({ display: false, position: { x: 0, y: 0 } });

  const palette = NodePalette({ DOM: sources.DOM, props$: paletteProp$ });
  const nodeManager = NodeManager({ ...sources, mouseUp$, globalMouseDown$, globalKeyDown$, mousePos$, create$: palette.create$ });

  paletteHideProxy$.imitate(xs.merge(
    nodeManager.capturedClicks$,
    palette.create$
  ));

  const vdom$ = xs.combine(palette.DOM, nodeManager.DOM)
    .map(([creator, manager]) =>
      div("#cycle-root", [
        creator,
        manager,
      ])
    );

  // Peak at the detection driver
  sources.WebcamDetection.subscribe({
    next: (m) => { return; },
  });

  const feedChange$ = DOM.select('.camera-select').events('change').map((ev) => ({ type: 'camera-feed', value: ev.target.value }));
  const flipCamera$ = DOM.select('.camera-flip').events('change').map((ev) => ({ type: 'flip', value: ev.target.checked ? 1 : 0 }));

  return {
    DOM: vdom$,
    WebcamDetection: xs.merge(feedChange$, flipCamera$),
    ProgramManager: nodeManager.nodes$,
  };
}

// console.log(makeWebcamDetectionDriver);

run(main, { DOM: makeDOMDriver('#main-app'),  WebcamDetection: WebcamDetectionDriver, ProgramManager: ProgramDriver });
