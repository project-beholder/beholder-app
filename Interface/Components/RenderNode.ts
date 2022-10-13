import { div, img, span, h2, select, option, input } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';

export function MarkerNode(props) { 
  const { x, y, ID, uuid, selected } = props;

  return div(
    '.draggable-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'ID', parent: uuid, offsetX: '1.5', offsetY: '62' } }, 'ID'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'timeout', parent: uuid, offsetX: '1.5', offsetY: '73' } }, 'TIMEOUT'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'source', parent: uuid, offsetX: '1.5', offsetY: '85' } }, 'SOURCE'),
      ]),
      img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${ID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs', [
        span('.output-point.bool-data', { dataset: { type: 'output', name: 'present', parent: uuid, offsetX: '215.5', offsetY: '50.5' }}, 'DETECT'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posX', parent: uuid, offsetX: '215.5', offsetY: '62' }}, 'X'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posY', parent: uuid, offsetX: '215.5', offsetY: '73' }}, 'Y'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'rotation', parent: uuid, offsetX: '215.5', offsetY: '85' }}, 'ANGLE'),
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
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '1.5', offsetY: '24.5' } }, 'SEND')
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
        span('.output-point', { dataset: { type: 'output', name: 'main', valueType: 'number', parent: uuid, offsetX: '72', offsetY: '23.5' } }, '')
      ]),
    ]
  )
}

export function CharNode(node) {
  
}

export default function renderNode(node) {
  switch(node.type) {
    case 'marker': return MarkerNode(node);
    case 'key': return KeyNode(node);
    case 'number': return NumberNode(node);
    case 'char': return CharNode(node);
    default: return div('.null');
  }
}
