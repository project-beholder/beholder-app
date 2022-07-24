// Lib
import xs from 'xstream';
import {div, h2, input } from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine';

function view(props$, show$, value$) {
  return xs.combine(props$, show$, value$).map(([{ x, y }, show, value]) => 
    div(
      '#node-creator',
      { style: { left: `${x}rem`, top: `${y}rem`, display: show ? 'block' : 'none' } },
      [input({ // this is getting ugly peter
        attrs: { type: 'text', value },
        selected: show, // filthy side effect to auto select
        hook: { postpatch: (_, el) => { if(show) el.elm.select() } }
      })]
    )
  );
}

// Props object type definition please
export default function NodeCreator(sources: any) {
  // INTENTS
  const props$ = sources.props;

  const newValue$ = sources.DOM
    .select('#node-creator')
    .events('change')
    .map((ev: any) => ev.target.value);
  
  const keyPress$ = sources.DOM
    .select('#node-creator')
    .events('keypress');

  const enter$ = keyPress$.filter((ev: KeyboardEvent) => (ev.key === 'Enter'));


  // basically this is preventing spacebar from moving the input
  const stopSpacePropogation$ = keyPress$.filter((ev: KeyboardEvent) => (ev.key === ' '))
    .subscribe({
      next: (ev: KeyboardEvent) => { ev.stopPropagation();  },
      error: (err) => { console.error('The Stream gave me an error: ', err); },
      complete: () => { console.log('The Stream told me it is done.'); },
    });

  // MODEL
  const show$ = xs.merge(props$.map((p) => p.show), enter$.mapTo(false));
  const value$ = xs.merge(newValue$, enter$.mapTo('')).startWith('');
  // const create$ = enter$.mapTo({ type: 'marker', markerID: 0, pos: { x: 20, y: 20 } });
  const create$ = enter$
    .map((ev: KeyboardEvent) => ev.target.value)
    .compose(sampleCombine(props$))
    .map(([phrase, { x, y }]) => {
      if (phrase.includes('marker ') && phrase.length >= 8) {
        const pos = phrase.indexOf('marker ') + 7;
        return { type: 'marker', markerID: phrase.charAt(pos), pos: { x, y } }
        
      } else if (phrase.includes('key ') && phrase.length >= 5) {
        const pos = phrase.indexOf('key ') + 4;
        return { type: 'key', key: phrase.charAt(pos), pos: { x, y } }
      }
    })
    .debug();

  const sinks = {
    DOM: view(props$, show$, value$),
    create$,
  };
  return sinks;
}
