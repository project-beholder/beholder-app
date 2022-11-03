import * as R from 'ramda';
import { div, span } from '@cycle/dom';

export function renderValueChangeNode(props) { 
  const { x, y, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source, valueType }]) => span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', valueType, name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      span('.logic-node-text','Change'),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, valueType }]) => span('.output-point', { dataset: { type: 'output', valueType, name: key, parent: uuid, offsetX, offsetY } }, '') // we are hiding this text for now
      ))
    ]
  );
};

export function createValueChangeNode(props, uuid) {
  return {
    ...props,
    uuid,
    VALUE: 1,
    THRESHOLD: 1000,
    totalDelta: 0,
    lastValue: 0, 
    outputs: { TRIGGER: { noText: true, offsetX: 220, offsetY: 49, targets: [], valueType: 'bool' }},
    inputs: {
      VALUE: { offsetX: 0, offsetY: 29, source: null, sourceField: null, valueType: 'number' },
      THRESHOLD: { offsetX: 0, offsetY: 49, source: null, sourceField: null, valueType: 'number' },
    },
    selected: false,
  };
}
