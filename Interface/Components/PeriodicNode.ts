import * as R from 'ramda';
import { div, span } from '@cycle/dom';

export function renderPeriodicNode(props, { panX, panY }) { 
  const { x, y, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x + panX}px, ${y + panY}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source, valueType }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', valueType, name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      span('.logic-node-text','Periodic'),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, valueType }]) => span('.output-point', { dataset: { type: 'output', valueType, name: key, parent: uuid, offsetX, offsetY } }, '') // we are hiding this text for now
      ))
    ]
  );
};

export function createPeriodicNode(props, uuid) {
  return {
    ...props,
    uuid,
    ACTIVE: false,
    PERIOD: 1000,
    totalDt: 0,
    isOn: false,
    outputs: { TRIGGER: { name: 'TRIGGER', noText: true, offsetX: 220, offsetY: 49, targets: [], valueType: 'bool' }},
    inputs: {
      ACTIVE: { offsetX: 0, offsetY: 29, source: null, sourceField: null, valueType: 'bool' },
      PERIOD: { offsetX: 0, offsetY: 49, source: null, sourceField: null, valueType: 'number' },
    },
    selected: false,
  };
}
