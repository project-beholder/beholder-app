import xs from 'xstream';
import * as R from 'ramda';

import {div, img, span, h2, button } from '@cycle/dom';
`
div #node-palette
  div.all-nodes
  button#expand-palette
`

function view(display$) {
  return display$.map(
    (display) =>
      div('#node-palette', { class: { display }}, [
        div('#palette-nodes', [span('node-a'), span('node-b')]),
        button('#expand-palette', { class: { button_hide: display, button_show: !display }}, display ? '^' : 'v')
      ])
  );
}

export default function NodePalette(sources: any) {
  const { props$, DOM } = sources;

  const display$ = xs.merge(
    props$.map(R.prop('display')),
    DOM.select('.button_hide').events('click').mapTo(false),
    DOM.select('.button_show').events('click').mapTo(true),
  );
  const create$ = xs.from([{ command: 'create', props: { type: 'key', key: 'a', x: 100, y: 100 } }, { command: 'create', props: { type: 'key', key: 'a', x: 100, y: 200 } }]);
  // .startWith({ command: 'create', props: { type: 'key', key: 'x', x: 10, y: 10 } });
  // .startWith({ command: 'create', props: { type: 'marker', markerID: 0, x: 10, y: 10 } });

  const sinks = {
    DOM: view(display$),
    create$,
  };
  return sinks;
}
