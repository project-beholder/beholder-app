// Lib
import xs from 'xstream';
import { div } from '@cycle/dom';
import isolate from '@cycle/isolate';

// Local
import MarkerNode from './Components/MarkerNode';
import KeyNode from './Components/KeyNode';

function NodeManager(sources: any) {
  const { DOM, mouseUp$, create$ } = sources;

  // auto
  const nodes$ = create$
    .fold((nodes: Array<any>, createEvent) => {
      const { x, y } = createEvent.pos;
      switch(createEvent.type) {
        case 'marker':
          nodes.push(isolate(MarkerNode)({ DOM, mouseUp$, props$: xs.of({ x, y, marker: createEvent.markerID }) }));
          break;
        case 'key':
          nodes.push(isolate(KeyNode)({ DOM, mouseUp$, props$: xs.of({ x, y, key: createEvent.key }) }));
          break;
      }
      return nodes;
    }, []);
  
  // idk why this isn't working immediately
  // DOM needs to be memory streams bc :()
  const childrenDOM$ = nodes$.map((nodes) => {
    console.log(...nodes.map((n) => n.DOM))
    return xs.combine(...nodes.map((n) => n.DOM))
  }).flatten();
  const vdom$ = childrenDOM$.map((children) => div(children));

  // const vdom$ = xs.combine(tempKeyNode.DOM, tempMarkerNode.DOM, tempKeyNode2.DOM, tempMarkerNode2.DOM)
  //   .map((children) => div(children)); 

  const sinks = {
    DOM: vdom$,
  }
  return sinks;
}

export default NodeManager;