import xs from 'xstream';
import * as R from 'ramda';

import {div, img, ul, span, h2, button } from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine';
`
div #node-palette
  div.all-nodes
  button#expand-palette
`

function view(display$, position$) {
  return xs.combine(display$, position$).map(
    ([display, position]) => ul(
      '#node-palette',
      {
        class: { display },
        style: { transform: `translate(${position.x}px, ${position.y}px)` }
      },
      [
        div('.palette-category', ['VARIABLES', ul([button('.create-button', { dataset: { type: 'number' } }, 'Number')])]),
        div('.palette-category', ['MARKER', ul([button('.create-button', { dataset: { type: 'marker' } }, 'Detect Marker')])]),
        div('.palette-category', ['KEYS', ul([button('.create-button', { dataset: { type: 'key' } }, 'Send Key')])]),
      ]
    )
  );
}

export default function NodePalette(sources: any) {
  const { props$, DOM } = sources;

  const display$ = props$.map(R.prop('display'));
  const position$ = props$.map(R.prop('position'));


  const createButtonPress$ = DOM.select('.create-button').events('click')
    .compose(sampleCombine(position$))
    .map(([ev, position]) => ({ command: 'create', props: { type: ev.target.dataset.type, ...position } }));

  // const markerCreate$ = DOM.select('#create-marker').events('click')
  //   .compose(sampleCombine(position$))
  //   .map(([_, position]) => ({ command: 'create', props: { type: 'marker', ...position } }));

  const starterCreate$ = xs.empty();
  const create$ = xs.merge(
    createButtonPress$,
    starterCreate$,
  ).remember(); // needs to be a memory stream for some reason
  
  // hack to stop bubbling from hiding this menu
  DOM.select('#node-palette')
    .events('mousedown')
    .subscribe({
      next: (ev) => ev.stopPropagation(),
    })

  const sinks = {
    DOM: view(display$, position$),
    create$,
  };
  return sinks;
}
