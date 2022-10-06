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
          return h('line.connection-path',
            {
              attrs: {
                x1: n.x + o.offsetX,
                y1: n.y + o.offsetY,
                x2: nodes[o.target.parent].x + o.target.offsetX,
                y2: nodes[o.target.parent].y + o.target.offsetY,
              }
            })
        });
    });
  return R.flatten(lines);
}
// const previewLine$ = xs.of(h('path.preview-path.visible', { attrs: { d: "M 175 200 q 175 200 150 0" } }));
// const previewLine$ = xs.of(h('path.preview-path.visible', { attrs: { d: "M 0 0 q 150 100 200 200" } }));
// d="M708.6181124121713,384.29071257403524 C923.9757228727523,384.29071257403524 923.9757228727523,223.5 1139.3333333333333,223.5"
// const previewLine$ = xs.of(h('line.preview-path.visible', { attrs: { x1: 0, y1: 0, x2: 200, y2: 200 } }));
// d="M828.3678124503721,438.92600222891923 C1014.6839062251861,438.92600222891923 1014.6839062251861,225 1201,225"

function NodeManager(sources: any) {
  const { DOM, mouseUp$, globalMouseDown$, globalKeyDown$, create$, mousePos$ } = sources;

  const nodeMouseDown$ = DOM.select('.draggable-node').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev;
    });

  const clearSelectProxy$ = xs.empty();
  const singleSelectUUID$ = xs.merge(
    nodeMouseDown$.map((ev: MouseEvent) => ev.currentTarget?.dataset.uuid),
    clearSelectProxy$.mapTo(''),
    xs.of('') // effectively 'start with'
  );

  const selectCommand$ = singleSelectUUID$.filter((id) => id !== '').map((uuid) => ({ command: 'select', uuid }));
  const deselectCommand$ = singleSelectUUID$.filter((id) => id === '').mapTo({ command: 'deselect' });

  const deleteCommand$ = globalKeyDown$.filter((ev) => ev.key === 'Backspace')
    .compose(sampleCombine(singleSelectUUID$))
    .filter(([_, nodeID]) => (nodeID !== ''))
    .map(([_, nodeID]) => ({ command: 'delete', uuid: nodeID }));

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

  const draggableUp$ = DOM.select('.draggable-node').events('mouseup')
  const isHeld$ = xs.merge(
    nodeMouseDown$.mapTo(true),
    draggableUp$.mapTo(false),
    mouseUp$.mapTo(false),
  );

  const move$ = xs.combine(mousePos$, holdNode$, isHeld$)
    .filter(R.nth(2))
    .map(([pos, held]) => ({ command: 'move', props: { ...held, ...pos } }));
  
  const connectProxy$ = xs.create();

  // Individual node events here
  // is there a way to make this more generic? probably in dataset
  const keySelect$ = DOM.select('.key-select')
    .events('change')
    .map((e) => ({ command: 'value-change', uuid: e.target.dataset.uuid, prop: 'key', newValue: e.target.value }));

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
      deselectCommand$,
      keySelect$, // replace when more of this command type come in to play, ie number
    )
    .fold(CommandReducer, {}).remember();
  
  const outputPressed$ = DOM.select('.output-point').events('mousedown')
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev.target.dataset;
    });
  const createLineDropped$ = DOM.select('.input-point').events('mouseup').map((ev: MouseEvent) => ev.target.dataset);

  const showPreviewLine$ = xs.merge(mouseUp$.mapTo(false), outputPressed$.mapTo(true));
  const previewLine$ = xs.combine(outputPressed$, mousePos$, nodes$, showPreviewLine$)
      .map(([data, mouse, nodes, show]) => {
        const offsetX = parseFloat(data.offsetX);
        const offsetY = parseFloat(data.offsetY);
        const heldNode = nodes[data.parent];

        if (heldNode) {
          return h('line.preview-path',
            {
              class: { visible: show },
              attrs: {
                x1: heldNode.x + offsetX, y1: heldNode.y + offsetY,
                x2: mouse.x, y2: mouse.y
              }
            });
        }
        return h('line.preview-path', { attrs: { x1: 0, y1: 0, x2: 200, y2: 200 } })
      }).startWith(h('line.preview-path', { attrs: { x1: 0, y1: 0, x2: 200, y2: 200 } }))
      // .mapTo(h('path.preview-path.visible', {
      //   attrs: { d: "M100,250 C100,100 400,100 400,250" } 
      // }));

  // selection code part 2
  const clearSelect$ = xs.merge(globalMouseDown$, deleteCommand$)
  clearSelectProxy$.imitate(clearSelect$);
  
  // this needs to be proxied and turned into a node update
  // lines should be rendered directly from nodes
  const createConnection$ = createLineDropped$.compose(sampleCombine(outputPressed$, showPreviewLine$))
      .filter(R.nth(2))
      .map(([start, end]) => ({ command: 'connect', props: { start, end } }))
  connectProxy$.imitate(createConnection$);// proxy this so we can do our cyclical deps
  
  const vdom$ = xs.combine(nodes$, previewLine$)
    .map(([nodes, previewLine]) => {
      const connectionLines = renderConnections(nodes);
      connectionLines.push(previewLine);
      // do svg lines here from nodes data
      return div([
        ...Object.values(nodes).map(renderNode), // render nodes
        svg('#connection-lines', connectionLines)
      ]);
    });


  const sinks = {
    DOM: vdom$,
  }
  return sinks;
}

export default NodeManager;
