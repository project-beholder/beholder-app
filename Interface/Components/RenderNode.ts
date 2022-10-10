import { div, img, span, h2, select, option } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';

export function MarkerNode(props) { 
  const { x, y, markerID, uuid, selected } = props;

  return div(
    '.draggable-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'ID', parent: uuid, offsetX: '-68', offsetY: '40' } }, 'ID'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'timeout', parent: uuid, offsetX: '-68', offsetY: '40' } }, 'TIMEOUT'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'source', parent: uuid, offsetX: '-68', offsetY: '40' } }, 'SOURCE'),
      ]),
      img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${markerID}.svg` } }), // only supports up to marker 9 :()
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
  const { x, y, key, uuid, selected } = props;

  return div(
    '.draggable-node.dark-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '1.5', offsetY: '24.5' } }, 'SEND')
      ]),
      select(
        '.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) => option({ attrs: { value: k.key, selected: (k.key === key)} }, k.text))
      ),
    ]
  )
}

export function IntNode(node) {

}

export function CharNode(node) {
  
}

export default function renderNode(node) {
  switch(node.type) {
    case 'marker': return MarkerNode(node);
    case 'key': return KeyNode(node);
    case 'int': return IntNode(node);
    case 'char': return CharNode(node);
    default: return div('.null');
  }
}
