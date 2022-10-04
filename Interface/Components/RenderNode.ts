import {div, img, span, h2 } from '@cycle/dom';

export function MarkerNode(props) { 
  const { x, y, markerID, uuid } = props;
  return div(
    '.draggable-node.marker-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, dataset: { uuid } },
    [
      img('.unselectable', { attrs: { src: `./Assets/Markers/Marker${markerID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs', [
        span('.output-point.bool-data', { dataset: { type: 'output', name: 'present', parent: uuid, offsetX: '220', offsetY: '27' }}, 'present'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posX', parent: uuid, offsetX: '220', offsetY: '53' }}, 'x'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posY', parent: uuid, offsetX: '220', offsetY: '78' }}, 'y'),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'rotation', parent: uuid, offsetX: '220', offsetY: '104' }}, 'rotation'),
      ])
    ]
  )
};

export function KeyNode(props) {
  const { x, y, key, uuid } = props;
  return div(
    '.draggable-node.key-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, dataset: { uuid } },
    [
      h2('.unselectable', key),
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '-68', offsetY: '40' } }, 'press')
      ])
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
