import {div, img, span, h2 } from '@cycle/dom';

export function MarkerNode(props) { 
  const { x, y, markerID, uuid } = props;
  return div(
    '.draggable-node.marker-node',
    { style: { transform: `translate(${x}px, ${y}px)` }, dataset: { uuid } },
    [
      img('.unselectable', { attrs: { src: `./Assets/Markers/Marker${markerID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'present', parent: uuid, offsetX: '106', offsetY: '17' }}),
        span('.output-point', { dataset: { type: 'output', name: 'posX', parent: uuid, offsetX: '106', offsetY: '39' }}),
        span('.output-point', { dataset: { type: 'output', name: 'posY', parent: uuid, offsetX: '106', offsetY: '61' }}),
        span('.output-point', { dataset: { type: 'output', name: 'rotation', parent: uuid, offsetX: '106', offsetY: '84' }}),
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
        span('.input-point', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '-3', offsetY: '32' } })
      ])
    ]
  )
}

export default function renderNode(node) {
  switch(node.type) {
    case 'marker': return MarkerNode(node);
    case 'key': return KeyNode(node);
    default: return div('.null');
  }
}
