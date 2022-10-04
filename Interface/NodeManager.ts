// Lib
import xs from 'xstream';
import { div, svg, h, button } from '@cycle/dom';
import { v4 as uuidv4 } from 'uuid';
import * as R from 'ramda';

// Local
import renderNode from './Components/RenderNode';
import sampleCombine from 'xstream/extra/sampleCombine';
import UndoRedoManager from './UndoRedoManager';

function distanceSq(x1: number, y1: number, x2: number, y2: number): number {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) + (y1 - y2);
}

function createNode(props, uuid) {
  // Could replace this with an object that has functions for processing
  switch(props.type) {
    case 'marker':
      return {
        ...props,
        uuid,
        output: [],
      };
    case 'key':
      return {
        ...props,
        uuid,
        input: [],
      };
  }
  return null; // this is an error friend
}

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
  const { DOM, mouseUp$, create$, mousePos$ } = sources;

  const holdNode$ = DOM.select('.draggable-node').events('mousedown')
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
  const cmdZPress$ = DOM.select('document').events('keydown')
    .filter((e) => {
      return (e.key == 'z' && e.metaKey)
    });
  const undo$ = cmdZPress$.filter((e) => (!e.shiftKey)).mapTo({ command: 'undo' });
  const redo$ = cmdZPress$.filter((e) => (e.shiftKey)).mapTo({ command: 'redo' });

  const draggableDown$ = DOM.select('.draggable-node').events('mousedown');
  const draggableUp$ = DOM.select('.draggable-node').events('mouseup')
  const isHeld$ = xs.merge(
    draggableDown$.mapTo(true),
    draggableUp$.mapTo(false),
    mouseUp$.mapTo(false),
  );

  const move$ = xs.combine(mousePos$, holdNode$, isHeld$)
    .filter(R.nth(2))
    .map(([pos, held]) => ({ command: 'move', props: { ...held, ...pos } }));
  
  const connectProxy$ = xs.create();

  // hack for movement undo
  const moveEnd$ = xs.combine(mousePos$, isHeld$)
    .fold((acc, [pos, isHolding]) => {
      
      return acc;
    }, { prevPos: { x: 0, y: 0 }, dist: 0, wasHolding: false, isHolding: false})
    .filter(({ dist, wasHolding, isHolding }) => (dist > 200 && wasHolding && !isHolding))
    .mapTo({ command: 'move-end'}).debug();

  // generate node objects from all of the elements
  // move this to a function + file
  const nodes$ = xs.merge(create$, move$, connectProxy$, undo$, redo$, moveEnd$)
    .fold((oldNodes, action) => {

      let nodes = R.clone(oldNodes);
      switch(action.command) {
        case 'create':
          const uuid = uuidv4();
          nodes[uuid] = createNode(action.props, uuid);
          globalSendToServer(nodes);
          UndoRedoManager.pushUndoState(nodes);
          break;
        case 'move':
          nodes[action.props.uuid].x = action.props.x - action.props.offsetX;
          nodes[action.props.uuid].y = action.props.y - action.props.offsetY;
          break;
        case 'connect':
          const { start, end } = action.props;
          if (start.type === 'output' && end.type == 'input') {
            nodes[start.parent].output.push({
              offsetX: parseFloat(start.offsetX),
              offsetY: parseFloat(start.offsetY),
              field: start.name,
              target: { 
                ...end,
                offsetX: parseFloat(end.offsetX),
                offsetY: parseFloat(end.offsetY),
              },
            });
          } else if (end.type === 'output' && start.type == 'input') {
            nodes[end.parent].output.push({
              offsetX: parseFloat(end.offsetX),
              offsetY: parseFloat(end.offsetY),
              field: end.name,
              target: {
                ...start,
                offsetX: parseFloat(start.offsetX),
                offsetY: parseFloat(start.offsetY),
              },
            });
          }
          globalSendToServer(nodes);
          UndoRedoManager.pushUndoState(nodes);
          // only connected 1 way atm, let's see if it works (output -> input)
          // also should validate if this is any good
          break;
        case 'move-end':
          UndoRedoManager.pushUndoState(nodes);
          break;
        case 'undo':
          if (UndoRedoManager.canUndo()) {
            nodes = UndoRedoManager.undo();
            globalSendToServer(nodes);
          }
          break;
        case 'redo':
          if (UndoRedoManager.canRedo()) {
            nodes = UndoRedoManager.redo();
            globalSendToServer(nodes);
          }
          break;
      }
      return nodes;
    }, {}).remember();
  
  const outputPressed$ = xs.merge(
      DOM.select('.output-point').events('mousedown'),
      DOM.select('.input-point').events('mousedown'),
    )
    .map((ev: MouseEvent) => {
      ev.stopPropagation();
      return ev.target.dataset;
    });
  const createLineDropped$ = xs.merge(
      DOM.select('.input-point').events('mouseup'),
      DOM.select('.output-point').events('mouseup')
    )
    .map((ev: MouseEvent) => ev.target.dataset);

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
