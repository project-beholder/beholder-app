import { div, img, span, h2, select, option, input } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';

export function MarkerNode(props) { 
  const { x, y, ID, uuid, selected } = props;

  return div(
    '.draggable-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'ID', parent: uuid, offsetX: '1.5', offsetY: '54.5' } }, 'ID'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'timeout', parent: uuid, offsetX: '1.5', offsetY: '69' } }, 'TIMEOUT'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'source', parent: uuid, offsetX: '1.5', offsetY: '83.5' } }, 'SOURCE'),
      ]),
      img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${ID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs', [
        span('.output-point.bool-data', { dataset: { type: 'output', name: 'present', parent: uuid, offsetX: '242', offsetY: '40' }}, 'DETECT'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posX', parent: uuid, offsetX: '242', offsetY: '54.5' }}, 'X'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posY', parent: uuid, offsetX: '242', offsetY: '69' }}, 'Y'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'rotation', parent: uuid, offsetX: '242', offsetY: '83.5' }}, 'ANGLE'),
      ])
    ]
  );
};

export function KeyNode(props) {
  const { x, y, value, uuid, selected } = props;

  return div(
    '.draggable-node.dark-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '1.5', offsetY: '22' } }, 'PRESS')
      ]),
      select(
        '.node-input.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) => option({ attrs: { value: k.value, selected: (k.value === value)} }, k.text))
      ),
    ]
  )
}

export function NumberNode(props) {
  const { x, y, uuid, selected, value } = props;

  return div(
    '.draggable-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      input(
        '.node-input.node-number-input.var-number-input',
        { dataset: { uuid }, attrs: { type: 'number', min: 0, max: 1000, value } },
      ),
      div('.node-outputs.center-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'main', valueType: 'number', parent: uuid, offsetX: '72', offsetY: '25' } }, '')
      ]),
    ]
  )
}

// this should only be updated every couple of frames probs, not every update
// document.querySelector('#test-img').src = "../frame.png?" + new Date().getTime();
export function DetectionPanel(props, frame) {
  const { uuid, selected, x, y } = props;
  return div('.draggable-node.detection-panel',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.detection-view', 'hide-me peter'), // position this absolute, kthanks
      img('.detection-img', { attrs: { src: frame } }),
      div('.labeled-select', [
        span('.select-label', 'CAMERA'),
        select(
          '.detection-select.camera-select',
          { dataset: { uuid: 'detection-panel' } },
          [
            option({ attrs: { value: 0 } }, 'Camera 1'),
            option({ attrs: { value: 1 } }, 'Camera 2')
          ]
        ),
      ]),
      div('labelded-select', [
        span('.select-label', 'flip'),
        input('.detection-check.camera-flip', { attrs: { type: 'checkbox' }})
      ]),
      div('.node-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'main', valueType: 'feed', parent: uuid, offsetX: '320.5', offsetY: '252.5' } }, 'FEED')
      ]),
    ]
  );
}

export default function renderNode(node, frame) {
  switch(node.type) {
    case 'marker': return MarkerNode(node);
    case 'key': return KeyNode(node);
    case 'number': return NumberNode(node);
    case 'detection': return DetectionPanel(node, frame);
    default: return '';
  }
}
