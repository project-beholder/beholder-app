import * as R from 'ramda';
import { div, span } from '@cycle/dom';

import generateArucoMarkerGraphic from '../MarkerGraphic/GenMarker';

export function renderMarkerNode(props, { panX, panY }, markers) { 
  const { x, y, ID, uuid, selected, inputs, outputs } = props;
  const marker = markers[ID];

  return div(
    `#${uuid}.draggable-node.marker-node`,
    { style: { transform: `translate(${x + panX}px, ${y + panY}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source, valueType }]) =>
          span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', valueType, name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      generateArucoMarkerGraphic(ID),
      div('.node-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, property, valueType }]) =>
          span('.output-point', { dataset: { type: 'output', name: key, parent: uuid, offsetX, offsetY, valueType } }, [key, span('.marker-data', marker[property].toString())])
      ))
    ]
  );
};

export function createMarkerNode(props, uuid) {
  return {
    ...props,
    ID: 0,
    timeout: 100, // DEFAULT_MARKER_TIMEOUT
    uuid, // Targets for outputs = { uuid, field }
    outputs: {
      DETECT: { name: 'DETECT', property: 'present', offsetX: 280, offsetY: 39, targets: [], valueType: 'bool' },
      X: { name: 'X', property: 'posX', offsetX: 280, offsetY: 59, targets: [], valueType: 'number' },
      Y: { name: 'Y', property: 'posY', offsetX: 280, offsetY: 79, targets: [], valueType: 'number' },
      ANGLE: { name: 'ANGLE', property: 'rotation',offsetX: 280, offsetY: 99, targets: [], valueType: 'number' }
    },
    inputs: {
      ID: { offsetX: 0, offsetY: 59, source: null, sourceField: null, valueType: 'number' },
      timeout: { offsetX: 0, offsetY: 79, source: null, sourceField: null, valueType: 'number' },
      source: { offsetX: 0, offsetY: 99, source: null, sourceField: null, valueType: 'feed' }
    },
    selected: false,
  };
}
