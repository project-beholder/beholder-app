import * as R from 'ramda';
import { div, img, span, h2, select, option, input, video } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';
import generateArucoMarkerGraphic from '../MarkerGraphic/GenMarker';

let cameras = [];
navigator.mediaDevices.enumerateDevices().then(function (devices) {
  for(var i = 0; i < devices.length; i ++){
    cameras = devices.filter(({ kind }) => kind == 'videoinput');
  };
});

export function ChangeNode(props) { 
  const { x, y, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      span('.logic-node-text','Change'),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY }]) => span('.output-point', { dataset: { type: 'output', name: key, parent: uuid, offsetX, offsetY } }, '') // we are hiding this text for now
      ))
    ]
  );
};

export function AngleChangeNode(props) { 
  const { x, y, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      span('.logic-node-text','Change'),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY }]) => span('.output-point', { dataset: { type: 'output', name: key, parent: uuid, offsetX, offsetY } }, '') // we are hiding this text for now
      ))
    ]
  );
};

export function MarkerNode(props, marker) { 
  const { x, y, ID, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.marker-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      generateArucoMarkerGraphic(ID), // only supports up to marker 9 :()
      div('.node-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, property }]) => span('.output-point', { dataset: { type: 'output', name: key, parent: uuid, offsetX, offsetY } }, [key, span('.marker-data', marker[property].toString())])
      ))
    ]
  );
};

// Input Only
export function KeyPressNode(props) {
  const { x, y, value, uuid, selected, inputs } = props;

  return div(
    `#${uuid}.draggable-node.dark-node.key-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      select(
        '.node-input.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) => option({ attrs: { value: k.value, selected: (k.value === value)} }, k.text))
      ),
    ]
  )
}

export function KeyTapNode(props) {
  const { x, y, value, uuid, selected, inputs } = props;

  return div(
    `#${uuid}.draggable-node.dark-node.key-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected },  dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      select(
        '.node-input.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) => option({ attrs: { value: k.value, selected: (k.value === value)} }, k.text))
      ),
    ]
  )
}

// Output Only
export function NumberNode(props) {
  const { x, y, uuid, selected, value, outputs } = props;
  // console.log(value);

  return div(
    `#${uuid}.draggable-node.number-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      input(
        '.node-input.node-number-input.var-number-input',
        { dataset: { uuid }, attrs: { type: 'number', min: -1000, max: 1000, value } },
      ),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, property }]) => span('.output-point', { dataset: { type: 'output', valueType: 'number', name: key, parent: uuid, offsetX, offsetY } }, '')
      ))
    ]
  )
}

// this should only be updated every couple of frames probs, not every update
// document.querySelector('#test-img').src = "../frame.png?" + new Date().getTime();
export function DetectionPanel(props) {
  const { uuid, selected, x, y, outputs } = props;
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
        span('.output-point', { dataset: { type: 'output', name: 'FEED', valueType: 'feed', parent: uuid, offsetX: outputs.FEED.offsetX, offsetY: outputs.FEED.offsetY } }, 'FEED')
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
