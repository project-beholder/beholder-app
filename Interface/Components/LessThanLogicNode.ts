import * as R from 'ramda';
import { div, span } from '@cycle/dom';

export function renderLessThanLogicNode(props, { panX, panY }) { 
  const { x, y, uuid, selected, inputs, outputs } = props;

  return div(
    `#${uuid}.draggable-node.logic-node`,
    { style: { transform: `translate(${x + panX}px, ${y + panY}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source, valueType }]) =>
          span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', valueType, name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      span('.logic-node-text','A < B'),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY, valueType }]) =>
          span('.output-point', { dataset: { type: 'output', valueType, name: key, parent: uuid, offsetX, offsetY } }, '') // we are hiding this text for now
      ))
    ]
  );
};

export function createLessThanLogicNode(props, uuid) {
  return {
    ...props,
    uuid,
    A: 0, // current a value
    B: 100, // current b value
    wasTrue: false, 
    outputs: { TRIGGER: { name: 'TRIGGER', noText: true, offsetX: 220, offsetY: 49, targets: [], valueType: 'bool' }},
    inputs: {
      A: { offsetX: 0, offsetY: 29, source: null, sourceField: null, valueType: 'number' },
      B: { offsetX: 0, offsetY: 49, source: null, sourceField: null, valueType: 'number' },
    },
    selected: false,
  };
}
