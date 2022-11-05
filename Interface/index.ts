// Lib
import * as R from 'ramda';
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
  const globalKeyUp$ = fromEvent(document, 'keyup');
  const globalMouseUp$ = fromEvent(document, 'mouseup');
  const spacebarDown$ = globalKeyDown$.filter((ev) => ev.key === ' ');
  const spacebarUp$ = globalKeyUp$.filter((ev) => ev.key === ' ');
  const spaceIsHeld$ = xs.merge(spacebarDown$.mapTo(true), spacebarUp$.mapTo(false)).startWith(false);

  const esc$ = globalKeyDown$.filter((ev) => ev.key === 'Escape');
  const rightClick$ = fromEvent(document, 'contextmenu').map((ev) => { ev.preventDefault(); return ev; });
  const runStopButton$ = DOM.select('#run-button').events('click').fold((prev) => !prev, false).startWith(false);

  const mousePos$ = DOM.events('mousemove')
    .fold((pos, ev: MouseEvent) => ({
      x: ev.clientX,
      y: ev.clientY,
      dx: ev.clientX - pos.x,
      dy: ev.clientY - pos.y,
    }), { x: 0, y: 0, dx: 0, dy: 0 });

  const panMouseDown$ = DOM.select('#pan-overlay').events('mousedown').mapTo(true);
  const isPanning$ = xs.merge(panMouseDown$, globalMouseUp$.mapTo(false));
  const panDrag$ = mousePos$.compose(sampleCombine(isPanning$))
    .filter(R.last)
    .map(R.head)
    .fold((totalPan, pos) => {
      totalPan.panX = R.clamp(window.innerWidth * -0.4, window.innerWidth * 1.4, totalPan.panX + pos.dx);
      totalPan.panY = R.clamp(window.innerHeight * -0.4, window.innerHeight * 1.4, totalPan.panY + pos.dy);
      return totalPan;
    }, { panX: 0, panY: 0 });

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

  const create$ = palette.create$.compose(sampleCombine(panDrag$))
    .map(([create, pan]) => {
      create.props.x -= pan.panX;
      create.props.y -= pan.panY;
      return create;
    });
  const nodeManager = NodeManager({ ...sources, mouseUp$, globalMouseDown$, globalKeyDown$, mousePos$, create$, loadedNodes$, panDrag$ });

  paletteHideProxy$.imitate(xs.merge(
    nodeManager.capturedClicks$,
    palette.create$
  ));

  // panning
  const panOverlay$ = spaceIsHeld$.map((show) => div('#pan-overlay', { class: { show } }, ''));

  // run program
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

  // save and load
  const saveButton$ = nodeManager.nodes$.map((n) =>
    a('#save-button', { attrs: { href: `data:text/plain;charset=utf-8,${JSON.stringify(n)}`, download: 'beholder_file.json' } }, img({ attrs: { src: './Assets/SVG/save.svg' } }))
  );
  const loadButton$ = xs.of(label('#load-button', [input('#load-input', { attrs: { type: 'file', accept: '.json' } }), img({ attrs: { src: './Assets/SVG/load.svg' } })]));

  const vdom$ = xs.combine(palette.DOM, nodeManager.DOM, runButton$, saveButton$, loadButton$, panOverlay$)
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
