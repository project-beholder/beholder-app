import * as R from 'ramda';
import { div, span, select, option } from '@cycle/dom';

import { KEY_MAPPINGS } from '../Constants/Keys';

export function renderKeyTapNode(props, { panX, panY }) {
  const { x, y, value, uuid, selected, inputs, isDown } = props;

  return div(
    `#${uuid}.draggable-node.dark-node.key-node`,
    { style: { transform: `translate(${x + panX}px, ${y + panY}px)` }, class: { isDown, selected },  dataset: { uuid } },
    [
      div('.node-inputs', R.toPairs(inputs).map(
        ([key, { offsetX, offsetY, source }]) =>
          span('.input-point', { class: { connected: !R.isNil(source) }, dataset: { type: 'input', valueType: 'bool', name: key, parent: uuid, offsetX, offsetY } }, key)
      )),
      select(
        '.node-input.node-select-input.key-select',
        { dataset: { uuid } },
        KEY_MAPPINGS.map((k) =>
          option({ attrs: { value: k.key, selected: (k.key === value)} }, k.text)
        )
      ),
    ]
  )
}

export function createKeyTapNode(props, uuid) {
  return {
    ...props,
    input: { main: null },
    value: 'a',
    isDown: false,
    uuid,
    inputs: { TAP: { name: 'TAP', offsetX: 0, offsetY: 39, source: null, sourceField: null, valueType: 'bool' } },
    selected: false,
  };
}
