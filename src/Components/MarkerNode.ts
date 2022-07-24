// Lib
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import {div, h2, img } from '@cycle/dom';

// TODO
// outputs a state driver that I make :()


export default function MarkerNode(sources: any) {
  const { DOM, props$ } = sources;
  const mouseDown$ = DOM.select('.marker-node').events('mousedown').mapTo(true);
  const mouseUp$ = xs.merge(DOM.select('.marker-node').events('mouseup'), DOM.select('.marker-node').events('mouseleave'));
  const mouseHeld$ = xs.merge(mouseDown$, mouseUp$.mapTo(false));
  const mousePos$ = DOM.select('.marker-node')
    .events('mousemove')
    .map((ev: MouseEvent) => ({ x: ev.clientX / 16 - 2.5, y: ev.clientY / 16 - 2.5 }));

  const pos$ = xs.merge(
    props$,
    mousePos$.compose(sampleCombine(mouseHeld$)).filter(([_, held]) => (held)).map(([pos]) => pos)
  );

  const vdom$ = xs.combine(pos$, props$)
    .map(([{ x, y }, { marker }]) => div(
      '.marker-node',
      { style: { left: `${x}rem`, top: `${y}rem`} },
      [img('.unselectable', { attrs: { src: `./Assets/Markers/Marker${marker}.svg` } })]
    ));

  const sinks = {
    // this needs to be a MemoryStream bc of a flatten in the parent
    DOM: vdom$.remember(),
  };
  return sinks;
}
