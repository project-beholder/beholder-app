import xs from 'xstream';
import * as R from 'ramda';

import {div, img, span, h2 } from '@cycle/dom';

function view(props$) {
  return props$.map(({ display }) => div('#node-palette', { class: { display }}, 'palette'));
}

export default function NodePalette(sources: any) {
  const props$ = sources.props$.debug();
  const create$ = xs.empty();

  const sinks = {
    DOM: view(props$),
    create$,
  };
  return sinks;
}
