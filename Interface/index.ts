// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import fromEvent from 'xstream/extra/fromEvent';
import {run} from '@cycle/run';
import {div, button, svg, makeDOMDriver, h, a, img, input, label } from '@cycle/dom';

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
  const runStopButton$ = DOM.select('#run-button').events('click').fold((prev) => !prev, false).startWith(false);

  const mousePos$ = DOM.events('mousemove')
    .fold((pos, ev: MouseEvent) => ({
      x: ev.clientX,
      y: ev.clientY,
      dx: ev.clientX - pos.x,
      dy: ev.clientY - pos.y,
      oldDx: ev.movementX,
      oldDy: ev.movementY,
    }), { x: 0, y: 0, dx: 0, dy: 0 });

  const loadedNodes$ = DOM.select('#load-input').events('change')
    .map(e => e.target.files)
    .map(R.last)
    .map((f) => xs.fromPromise(fetch(f.path).then(res => res.json())))
    .flatten();
  
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
  const nodeManager = NodeManager({ ...sources, mouseUp$, globalMouseDown$, globalKeyDown$, mousePos$, create$: palette.create$, loadedNodes$ });

  paletteHideProxy$.imitate(xs.merge(
    nodeManager.capturedClicks$,
    palette.create$
  ));

  // <svg id="triangle" viewBox="0 0 100 100">
  //           	<polygon points="50 15, 100 100, 0 100"/>
  //       </svg>
  const tri = '27 20, 27 50, 52 35';
  const rect = '22 22, 22 48, 48 48, 48 22';
  const runStop$ = xs.merge(runStopButton$, nodeManager.stopEmulation$);
  const runButton$ = runStop$.map((run) =>
    button('#run-button', { class: { running: run } },
      svg({ attrs: { viewBox: '0 0 70 70' } },
        h('polygon', { attrs: { points: run ? rect : tri } })
      )
    )
  ); 

  const saveButton$ = nodeManager.nodes$.map((n) =>
    a('#save-button', { attrs: { href: `data:text/plain;charset=utf-8,${JSON.stringify(n)}`, download: 'beholder_file.json' } }, img({ attrs: { src: './Assets/SVG/save.svg' } }))
  );

  const loadButton$ = xs.of(label('#load-button', [input('#load-input', { attrs: { type: 'file', accept: '.json' } }), img({ attrs: { src: './Assets/SVG/load.svg' } })]));

  const vdom$ = xs.combine(palette.DOM, nodeManager.DOM, runButton$, saveButton$, loadButton$)
    .map((children) => div("#cycle-root", children));

  // Peak at the detection driver
  // sources.WebcamDetection.subscribe({
  //   next: (m) => { return; },
  // });

  const feedChange$ = DOM.select('.camera-select').events('change').map((ev) => ({ type: 'camera-feed', value: ev.target.value }));
  const flipCamera$ = DOM.select('.camera-flip').events('change').map((ev) => ({ type: 'flip', value: ev.target.checked ? 1 : 0 }));

  return {
    DOM: vdom$,
    WebcamDetection: xs.merge(feedChange$, flipCamera$),
    ProgramManager: xs.combine(nodeManager.nodes$, runStop$),
  };
}

run(main, { DOM: makeDOMDriver('#main-app'),  WebcamDetection: WebcamDetectionDriver, ProgramManager: ProgramDriver });
