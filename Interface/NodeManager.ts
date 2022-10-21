// Lib
import xs from 'xstream';
import { div, svg, h, button, select } from '@cycle/dom';
import * as R from 'ramda';
import sampleCombine from 'xstream/extra/sampleCombine';

// Local
import renderNode from './Components/RenderNode';
import CommandReducer from './CommandReducer';

// TODO: Move this to another file
function renderConnections(nodes) {
  const lines = Object.values(nodes)
    .filter(R.has('output'))
    .map((n) => {
      return n.output // to render I don't need them sorted
        .map((o) => {
          const x1 = n.x + o.offsetX;
          const y1 = n.y + o.offsetY;
          const x2 = nodes[o.target.parent].x + o.target.offsetX;
          const y2 = nodes[o.target.parent].y + o.target.offsetY;
          const curveX = x1 + 30; // x1 + (x2 - x1)/6;
          const midX = x1 + (x2 - x1)/2;
          const midY = y1 + (y2 - y1)/2;

          // <path d="M 50 50 Q 100 50, 100 100 T 150 150" stroke="black" fill="transparent"/>
          // lets make a curve!
          return h('path.connection-path',
            {
              attrs: {
                'stroke-linecap': 'round',
                d: `M ${x1} ${y1} Q ${curveX} ${y1}, ${midX} ${midY} T ${x2} ${y2}`,
                fill: 'transparent',
              }
            });
        });
    });
  return R.flatten(lines);
}

function NodeManager(sources: any) {
  const { DOM, WebcamDetection, mouseUp$, globalMouseDown$, globalKeyDown$, create$, mousePos$ } = sources;

  const nodeMouseDown$ = DOM.select('.draggable-node').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev;
    });
  const nodeMouseUp$ = DOM.select('.draggable-node').events('mouseup')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev;
    });


  // get a proxy of all the nodes
  // if more than 1 selected: mouse up sends single select events and mouse down only sends on multiselect
  
  // ok so things are weird, I need a list of currently selected elements so I need a proxy for it
  const selectedProxy$ = xs.create();
  const clearSelectProxy$ = xs.empty();
  const singleSelectUUID$ = xs.merge(
    nodeMouseDown$.map((ev) => [ev.currentTarget?.dataset.uuid, ev.shiftKey, 'down']),
    nodeMouseUp$.map((ev) => [ev.currentTarget?.dataset.uuid, ev.shiftKey, 'up']),
    clearSelectProxy$.mapTo(['', false, 'down']),
    xs.of(['', false, 'down']) // effectively 'start with'
  );

  const selectCommand$ = singleSelectUUID$.map(([uuid, multiselect, mButton]) => ({ command: 'select', uuid, multiselect, mButton }));
  const deleteCommand$ = globalKeyDown$.filter((ev) => ev.key === 'Backspace').mapTo({ command: 'delete' });

  const holdNode$ = nodeMouseDown$
    .map((ev: MouseEvent) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      const offsetX = ev.clientX - rect.left;
      const offsetY = ev.clientY - rect.top;
      return {
        uuid: ev.currentTarget.dataset.uuid,
        offsetX,
        offsetY,
      };
    });

  // UNDO REDO SETUP
  const cmdZPress$ = globalKeyDown$
    .filter((e) => {
      return (e.key == 'z' && e.metaKey)
    });
  const undo$ = cmdZPress$.filter((e) => (!e.shiftKey)).mapTo({ command: 'undo' });
  const redo$ = cmdZPress$.filter((e) => (e.shiftKey)).mapTo({ command: 'redo' });

  const isHeld$ = xs.merge(
    nodeMouseDown$.mapTo(true),
    nodeMouseUp$.mapTo(false),
    mouseUp$.mapTo(false),
  );

  const move$ = xs.combine(mousePos$, holdNode$, isHeld$)
    .filter(R.nth(2))
    .map(([pos, held]) => ({ command: 'move', ...pos }));
  
  const connectProxy$ = xs.create();

  // Individual node events here
  // is there a way to make this more generic? probably in dataset
  const nodeValueChange$ = DOM.select('.node-input')
    .events('change')
    .map((e) => ({ command: 'value-change', uuid: e.target.dataset.uuid, prop: 'value', newValue: e.target.value }));

  // generate node objects from all of the elements
  // move this to a function + file
  const nodes$ = xs.merge(
      create$,
      move$,
      connectProxy$,
      undo$,
      redo$,
      deleteCommand$,
      selectCommand$,
      nodeValueChange$, // replace when more of this command type come in to play, ie number
    )
    .fold(CommandReducer, {}).remember();
  
  const outputPressed$ = DOM.select('.output-point').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev.target.dataset;
    });
  const createLineDropped$ = DOM.select('.input-point').events('mouseup').map((ev: MouseEvent) => ev.target.dataset);

  // needs to hide on mouse up and when a connection is made, but show when an output is clicked
  const showPreviewLine$ = xs.merge(mouseUp$.mapTo(false), connectProxy$.mapTo(false), outputPressed$.mapTo(true));
  const previewLine$ = xs.combine(outputPressed$, mousePos$, nodes$, showPreviewLine$)
      .map(([data, mouse, nodes, show]) => {
        const offsetX = parseFloat(data.offsetX);
        const offsetY = parseFloat(data.offsetY);
        const heldNode = nodes[data.parent];

        const x1 = heldNode.x + offsetX;
        const y1 = heldNode.y + offsetY;
        const x2 = mouse.x;
        const y2 = mouse.y;
        const midX = x1 + (x2 - x1)/2;
        const midY = y1 + (y2 - y1)/2;
        const curveX = Math.abs(x2 - x1) > 5 ? x1 + 30 : x1;//x1 + (x2 - x1)/6;

        // <path d="M 50 50 Q 100 50, 100 100 T 150 150" stroke="black" fill="transparent"/>
        // lets make a curve!
        return h('path.preview-path',
          {
            class: { visible: show },
            attrs: {
              'stroke-linecap': 'round',
              d: `M ${x1} ${y1} Q ${curveX} ${y1}, ${midX} ${midY} T ${x2} ${y2}`,
              fill: 'transparent',
            },
          });
      }).startWith(h('line.preview-path', { attrs: { x1: 0, y1: 0, x2: 200, y2: 200 } }));

  // selection code part 2
  const clearSelect$ = xs.merge(globalMouseDown$, deleteCommand$)
  clearSelectProxy$.imitate(clearSelect$);
  
  // this needs to be proxied and turned into a node update
  // lines should be rendered directly from nodes
  const createConnection$ = createLineDropped$.compose(sampleCombine(outputPressed$, showPreviewLine$))
      .filter(R.nth(2))
      .map(([start, end]) => ({ command: 'connect', props: { start, end } }))
  connectProxy$.imitate(createConnection$);// proxy this so we can do our cyclical deps
  
  const frame$ = WebcamDetection.fold(
    ([dt, prevTime]) => {
      const currTime = Date.now();
      let newDT = currTime - prevTime;
      if (dt < 200) return [dt + newDT, currTime];
      return [0, currTime];
    }, [0,0])
    .filter(([dt]) => (dt == 0))
    .map(() => `../frame.jpg?${Date.now()}`);
  const vdom$ = xs.combine(nodes$, previewLine$, frame$)
    .map(([nodes, previewLine, frame]) => {
      const connectionLines = renderConnections(nodes);
      connectionLines.push(previewLine);

      // do svg lines here from nodes data
      return div([
        ...Object.values(nodes).map((n) => renderNode(n, frame)), // render nodes
        svg('#connection-lines', connectionLines)
      ]);
    });

  // need this because I am stopping propoggation
  const capturedClicks$ = xs.merge(nodeMouseDown$, outputPressed$);

  const sinks = {
    DOM: vdom$,
    capturedClicks$,
    nodes$,
  }
  return sinks;
}

export default NodeManager;
