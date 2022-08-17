// Lib
import xs from 'xstream';
import {div, h2, input } from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine';
import * as R from 'ramda';

function view(props$, show$, value$) {
  return xs.combine(props$, show$, value$).map(([{ x, y }, show, value]) => 
    div(
      '#node-creator',
      { style: { left: `${x}px`, top: `${y}px`, display: show ? 'block' : 'none' } },
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
  const props$ = sources.props$;

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
    .map(([inputText, { x, y }]) => {
      const phrase = inputText.toLowerCase();
      // Generate a marker
      if (phrase.includes('marker')) {
        const markerID = phrase.replace('marker', '').trim();
        if (markerID.length === 1) return { type: 'marker', markerID, x, y };
        else console.log('INVALID MARKER ID');
      }
      
      // Generate a key
      if (phrase.includes('key')) {
        const key = phrase.replace('key', '').trim();
        if (key.length === 1) return { type: 'key', key, x, y };
        if (phrase.includes('left')) return { type: 'key', key: '←', x, y }; 
        if (phrase.includes('right')) return { type: 'key', key: '→', x, y }; 
        if (phrase.includes('up')) return { type: 'key', key: '↑', x, y }; 
        if (phrase.includes('down')) return { type: 'key', key: '↓', x, y }; 
        if (phrase.includes('space')) return { type: 'key', key: 'SPACE', x, y }; 
        console.log('INVALID KEY');
      }

      // Generate an operator

      // LOGIC :(

      return null; // Temp ignore problems for now
    })
    .filter(R.pipe(R.isNil, R.not))
    .map((n) => ({ command: 'create', props: n }))
    .startWith({ command: 'create', props: { type: 'key', key: 'x', x: 10, y: 10 } });
    // .startWith({ command: 'create', props: { type: 'marker', markerID: 0, x: 10, y: 10 } });

  const sinks = {
    DOM: view(props$, show$, value$),
    create$,
  };
  return sinks;
}
