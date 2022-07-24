// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import {div, h2 } from '@cycle/dom';

// TODO
// outputs a state driver that I make :()

export default function KeyNode(sources: any) {
  const { DOM, props$ } = sources;
  const mouseDown$ = DOM.select('.key-node').events('mousedown').mapTo(true);
  const mouseUp$ = xs.merge(DOM.select('.key-node').events('mouseup'), DOM.select('.key-node').events('mouseleave'));
  const mouseHeld$ = xs.merge(mouseDown$, mouseUp$.mapTo(false));
  const mousePos$ = DOM.select('.key-node')
    .events('mousemove')
    .map((ev: MouseEvent) => ({ x: ev.clientX / 16 - 2, y: ev.clientY / 16 - 2 }));

  const pos$ = xs.merge(
    props$,
    mousePos$.compose(sampleCombine(mouseHeld$)).filter(([_, held]) => (held)).map(([pos]) => pos)
  );

  const vdom$ = xs.combine(pos$, props$)
    .map(([{ x, y }, { key }]) => div(
      '.key-node',
      { style: { left: `${x}rem`, top: `${y}rem`} },
      [h2('.unselectable', key)]
    ));

  const sinks = {
    // this needs to be a MemoryStream bc of a flatten in the parent
    DOM: vdom$.remember(),
  };
  return sinks;
}
