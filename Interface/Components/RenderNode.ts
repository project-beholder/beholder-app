import { div, img, span, h2, select, option, input, video } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';
import generateArucoMarkerGraphic from '../MarkerGraphic/GenMarker';

let cameras = [];
navigator.mediaDevices.enumerateDevices().then(function (devices) {
  for(var i = 0; i < devices.length; i ++){
    cameras = devices.filter(({ kind }) => kind == 'videoinput');
  };
});

// navigator.mediaDevices.enumerateDevices().then(function (devices) {
//   for(var i = 0; i < devices.length; i ++){
//       var device = devices[i];
//       if (device.kind === 'videoinput') {
//           var option = document.createElement('option');
//           option.value = device.deviceId;
//           option.text = device.label || 'camera ' + (i + 1);
//           document.querySelector('select#videoSource').appendChild(option);
//       }
//   };
// });

export function ChangeNode(props) { 
  const { x, y, uuid, selected } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'value', parent: uuid, offsetX: '0', offsetY: '29' } }, 'VALUE'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'threshold', parent: uuid, offsetX: '0', offsetY: '49' } }, 'THRESHOLD'),
      ]),
      span('.logic-node-text','Change'),//img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${ID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs.center-outputs', [
        span('.output-point.number-data', { dataset: { type: 'output', name: 'trigger', parent: uuid, offsetX: '220', offsetY: '49' }}, ''),
      ])
    ]
  );
};

export function AngleChangeNode(props) { 
  const { x, y, uuid, selected } = props;

  return div(
    `#${uuid}.draggable-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'value', parent: uuid, offsetX: '0', offsetY: '29' } }, 'ANGLE'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'threshold', parent: uuid, offsetX: '0', offsetY: '49' } }, 'THRESHOLD'),
      ]),
      span('.logic-node-text','CHANGE'),//img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${ID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs.center-outputs', [
        span('.output-point.number-data', { dataset: { type: 'output', name: 'trigger', parent: uuid, offsetX: '220', offsetY: '49' }}, ''),
      ])
    ]
  );
};

export function MarkerNode(props, marker) { 
  const { x, y, ID, uuid, selected } = props;
  const { posX, posY, rotation, present } = marker;

  return div(
    `#${uuid}.draggable-node.marker-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'ID', parent: uuid, offsetX: '0', offsetY: '59' } }, 'ID'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'timeout', parent: uuid, offsetX: '0', offsetY: '79' } }, 'TIMEOUT'),
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'source', parent: uuid, offsetX: '0', offsetY: '99' } }, 'SOURCE'),
      ]),
      generateArucoMarkerGraphic(ID),//img('.marker-node-img.unselectable', { attrs: { src: `./Assets/Markers/Marker${ID}.svg` } }), // only supports up to marker 9 :()
      div('.node-outputs', [
        span('.output-point.bool-data', { dataset: { type: 'output', name: 'present', parent: uuid, offsetX: '280', offsetY: '39' }}, ['DETECT', span('.marker-data', present.toString())]),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posX', parent: uuid, offsetX: '280', offsetY: '59' }}, ['X', span('.marker-data', posX)]),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'posY', parent: uuid, offsetX: '280', offsetY: '79' }}, ['Y', span('.marker-data', posY)]),
        span('.output-point.number-data', { dataset: { type: 'output', name: 'rotation', parent: uuid, offsetX: '280', offsetY: '99' }}, ['ANGLE', span('.marker-data', rotation)]),
      ])
    ]
  );
};

export function KeyPressNode(props) {
  const { x, y, value, uuid, selected } = props;

  return div(
    `#${uuid}.draggable-node.dark-node.key-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '0', offsetY: '39' } }, 'PRESS')
      ]),
      select(
        '.node-input.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) => option({ attrs: { value: k.value, selected: (k.value === value)} }, k.text))
      ),
    ]
  )
}

export function KeyTapNode(props) {
  const { x, y, value, uuid, selected } = props;

  return div(
    `#${uuid}.draggable-node.dark-node.key-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', [
        span('.input-point.bool-data', { dataset: { type: 'input', name: 'main', parent: uuid, offsetX: '0', offsetY: '39' } }, 'TAP')
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
    `#${uuid}.draggable-node.number-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      input(
        '.node-input.node-number-input.var-number-input',
        { dataset: { uuid }, attrs: { type: 'number', min: -1000, max: 1000, value } },
      ),
      div('.node-outputs.center-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'main', valueType: 'number', parent: uuid, offsetX: '120', offsetY: '39' } }, '')
      ]),
    ]
  )
}

// this should only be updated every couple of frames probs, not every update
// document.querySelector('#test-img').src = "../frame.png?" + new Date().getTime();
export function DetectionPanel(props) {
  const { uuid, selected, x, y } = props;
  return div('.draggable-node.detection-panel',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.detection-view', 'hide-me peter'), // position this absolute, kthanks
      img('.detection-img', { attrs: { src: '../frame.jpg' } }),
      div('.labeled-select.detection-parameter', [
        span('.select-label', 'CAMERA'),
        select(
          '.detection-select.camera-select',
          { dataset: { uuid: 'detection-panel' } },
          cameras.map((c, value) => option({ attrs: { value }}, c.label))
        ),
      ]),
      div('.detection-parameter', [
        span('.select-label', 'flip'),
        input('.detection-check.camera-flip', { attrs: { type: 'checkbox' }})
      ]),
      div('.node-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'main', valueType: 'feed', parent: uuid, offsetX: '350', offsetY: '299' } }, 'FEED')
      ]),
    ]
  );
}

export default function renderNode(node, markerData) {
  switch(node.type) {
    case 'marker': return MarkerNode(node, markerData[node.ID]);
    case 'key-press': return KeyPressNode(node);
    case 'key-tap': return KeyTapNode(node);
    case 'number': return NumberNode(node);
    case 'detection': return DetectionPanel(node);
    case 'value-change': return ChangeNode(node);
    case 'angle-change': return AngleChangeNode(node);
    default: return '';
  }
}
