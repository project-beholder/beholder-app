// Lib
import xs from 'xstream';
import { div, svg, h, button, select } from '@cycle/dom';
import * as R from 'ramda';
import sampleCombine from 'xstream/extra/sampleCombine';

// Local
import renderNode from './Components/RenderNode';
import CommandReducer from './StateManagement/CommandReducer';


function renderConnections(nodes, { panX, panY }) {
  const lines = Object.values(nodes)
    .filter(R.has('outputs'))
    .map((n) => {
      return R.flatten(R.values(n.outputs) // to render I don't need them sorted
        .map((o) => o.targets.map((t) => {
          // console.log(o, t);
          const x1 = n.x + o.offsetX + panX;
          const y1 = n.y + o.offsetY + panY;
          const x2 = nodes[t.uuid].x + nodes[t.uuid].inputs[t.field].offsetX + panX;
          const y2 = nodes[t.uuid].y + nodes[t.uuid].inputs[t.field].offsetY + panY;
          // const curveX = x1 + 30; // x1 + (x2 - x1)/6;

          const cp = Math.max(Math.abs((x2 - x1) / 2), 50);

          const midX1 = x1 + cp;
          const midX2 = x2 - cp;

          // <path d="M 50 50 Q 100 50, 100 100 T 150 150" stroke="black" fill="transparent"/>
          // lets make a curve!
          return h('path.connection-path',
            {
              attrs: {
                'stroke-linecap': 'round',
                d: `M ${x1} ${y1} C ${midX1} ${y1}, ${midX2} ${y2}, ${x2} ${y2}`,
                fill: 'transparent',
              }
            });
        })));
    });
    // console.log(lines);
  return R.flatten(lines);
}

function NodeManager(sources: any) {
  const { DOM, WebcamDetection, mouseUp$, globalMouseDown$, globalKeyDown$, create$, mousePos$, loadedNodes$, panDrag$ } = sources;

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
  const outputPressed$ = DOM.select('.output-point').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev.target.dataset;
    });
  const createLineDropped$ = DOM.select('.input-point').events('mouseup')
    .filter((ev: MouseEvent) => !ev.target.classList.contains('connected'))
    .map((ev: MouseEvent) => ev.target.dataset);
  const connectedInputPressed$ = DOM.select('.input-point.connected').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev.target.dataset;
    });

  const removeConnection$ = connectedInputPressed$.map((data) => ({
    command: 'remove-connection',
    uuid: data.parent,
    name: data.name,
  }));

  // Individual node events here
  // is there a way to make this more generic? probably in dataset
  // prevent input nonsense
  DOM.select('.node-number-input').events('keydown')
    .subscribe({
      next: (e) => {
        if (e.which < 48 || e.which > 57) e.preventDefault();
      }
    });
  const nodeValueChange$ = DOM.select('.node-input')
    .events('change')
    .map((e) => ({ command: 'value-change', uuid: e.target.dataset.uuid, prop: 'value', newValue: e.target.value }));

  // pause key emulation on most commands except move
  const stopEmulation$ = xs.merge(create$, connectProxy$, undo$, redo$, deleteCommand$, nodeValueChange$, removeConnection$)
    .mapTo(false);

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
      nodeValueChange$,
      loadedNodes$.map(l => ({ command: 'load', newNodes: l })),
      removeConnection$, // replace when more of this command type come in to play, ie number
    )
    .fold(CommandReducer, {}).remember();

  // needs to hide on mouse up and when a connection is made, but show when an output is clicked
  const endpoint$ = xs.merge(outputPressed$, connectedInputPressed$)
    .compose(sampleCombine(nodes$))
    .map(([evt, nodes]) => {

      if (evt.type === 'input') {
        const input = nodes[evt.parent].inputs[evt.name];
        return [nodes[input.source].outputs[input.sourceField], nodes[input.source]];
      }
      return [nodes[evt.parent].outputs[evt.name], nodes[evt.parent]];
    });
  const showPreviewLine$ = xs.merge(mouseUp$.mapTo(false), connectProxy$.mapTo(false), outputPressed$.mapTo(true), connectedInputPressed$.mapTo(true));
  const previewLine$ = xs.combine(endpoint$, mousePos$, showPreviewLine$, panDrag$)
      .map(([[data, heldNode], mouse, show, { panX, panY }]) => {
        const offsetX = parseFloat(data.offsetX);
        const offsetY = parseFloat(data.offsetY);

        const x1 = heldNode.x + offsetX + panX;
        const y1 = heldNode.y + offsetY + panY;
        const x2 = mouse.x;
        const y2 = mouse.y;
        
        const cp = Math.max(Math.abs((x1 - x2)/2), 50);
        
        const midX1 = x1 + cp;
        const midX2 = x2 - cp;

        // const midY = y2 - (y2 - y1)/2;
        // const curveX = Math.abs(x2 - x1) > 5 ? x1 + 30 : x1;//x1 + (x2 - x1)/6;

        // <path d="M 50 50 Q 100 50, 100 100 T 150 150" stroke="black" fill="transparent"/>
        // lets make a curve!
        return h('path.preview-path',
          {
            class: { visible: show },
            attrs: {
              'stroke-linecap': 'round',
              d: `M ${x1} ${y1} C ${midX1} ${y1}, ${midX2} ${y2}, ${x2} ${y2}`,
              fill: 'transparent',
            },
          });
      }).startWith(h('line.preview-path', { attrs: { x1: 0, y1: 0, x2: 200, y2: 200 } }));

  // selection code part 2
  const clearSelect$ = xs.merge(globalMouseDown$, deleteCommand$)
  clearSelectProxy$.imitate(clearSelect$);
  
  // this needs to be proxied and turned into a node update
  // lines should be rendered directly from nodes
  const createConnection$ = createLineDropped$.compose(sampleCombine(endpoint$, showPreviewLine$))
      .filter(R.nth(2))
      .map(([input, output]) => ({ command: 'connect', props: { input, output } }))
  connectProxy$.imitate(createConnection$);// proxy this so we can do our cyclical deps

  const connectionInfo$ = xs.combine(endpoint$, mousePos$, showPreviewLine$).startWith([[{ valueType: '' }], '', false]);
  const vdom$ = xs.combine(nodes$, previewLine$, WebcamDetection, connectionInfo$, panDrag$)
    .map(([nodes, previewLine, markerData, connectionInfo, pan]) => {
      const connectionLines = renderConnections(nodes, pan);
      connectionLines.push(previewLine);
      const [[{ valueType }], _, isConnecting] = connectionInfo;
      // console.log(valueType, isConnecting);

      // do svg lines here from nodes data
      return div({ class: { isConnecting }, dataset: { connectingValueType: valueType } }, [
        ...Object.values(nodes).map((n) => renderNode[n.type](n, pan, markerData)), // render nodes
        svg('#connection-lines', connectionLines)
      ]);
    });

  // need this because I am stopping propoggation
  const capturedClicks$ = xs.merge(nodeMouseDown$, outputPressed$);

  const sinks = {
    DOM: vdom$,
    capturedClicks$,
    nodes$,
    stopEmulation$, 
  }
  return sinks;
}

export default NodeManager;
