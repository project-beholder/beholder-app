import * as R from 'ramda';
import { div, span, input } from '@cycle/dom';

// Output Only
export function renderNumberNode(props) {
  const { x, y, uuid, selected, value, outputs } = props;

  return div(
    `#${uuid}.draggable-node.number-node`,
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      input(
        '.node-input.node-number-input.var-number-input',
        { dataset: { uuid }, attrs: { type: 'number', min: -1000, max: 1000, value } },
      ),
      div('.node-outputs.center-outputs', R.toPairs(outputs).map(
        ([key, { offsetX, offsetY }]) => span('.output-point', { dataset: { type: 'output', valueType: 'number', name: key, parent: uuid, offsetX, offsetY } }, '')
      ))
    ]
  )
}

export function createNumberNode(props, uuid) {
  return {
    ...props,
    value: 0,
    uuid,
    outputs: { value: { name: 'value', noText: true, offsetX: 120, offsetY: 39, targets: [], valueType: 'number' } },
    selected: false,
  };
}
