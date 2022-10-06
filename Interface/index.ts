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

  const mousePos$ = DOM.events('mousemove').map((ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY }));

  const mouseUp$ = xs.merge(DOM.events('mouseup'), DOM.events('mouseleave'));
  const globalMouseDown$ = DOM.events('mousedown');
  
  // const paletteProp$ = xs.merge(spacebar$.mapTo({ display: true }), esc$.mapTo({ display: false }))
  const paletteProp$ = esc$.mapTo({ display: false }).startWith({ display: false });

  const palette = NodePalette({ DOM: sources.DOM, props$: paletteProp$ });
  const nodeManager = NodeManager({ DOM: sources.DOM, mouseUp$, globalMouseDown$, globalKeyDown$, mousePos$, create$: palette.create$ });

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

run(main, { DOM: makeDOMDriver('#main-app') });
