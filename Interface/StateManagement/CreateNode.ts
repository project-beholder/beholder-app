export default function createNode(props, uuid) {
  // Could replace this with an object that has functions for processing
  switch(props.type) {
    case 'marker':
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
    case 'key-press':
      return {
        ...props,
        value: 'a',
        isDown: false,
        uuid,
        inputs: { PRESS: { offsetX: 0, offsetY: 39, source: null, sourceField: null, valueType: 'bool' } },
        selected: false,
      };
    case 'key-tap':
      return {
        ...props,
        input: { main: null },
        value: 'a',
        isDown: false,
        uuid,
        inputs: { TAP: { offsetX: 0, offsetY: 39, source: null, sourceField: null, valueType: 'bool' } },
        selected: false,
      };
    case 'number':
      return {
        ...props,
        value: 0,
        uuid,
        outputs: { value: { name: 'value', noText: true, offsetX: 120, offsetY: 39, targets: [], valueType: 'number' } },
        selected: false,
      };
    case 'detection':
      return {
        ...props,
        camID: 0,
        uuid,
        outputs: { FEED: { name: 'FEED', offsetX: 350, offsetY: 299, targets: [], valueType: 'feed' } },
        selected: false,
      };
    case 'angle-change':
      return {
        ...props,
        uuid,
        VALUE: 1,
        THRESHOLD: 1000,
        totalDelta: 0,
        lastValue: 0, 
        outputs: { TRIGGER: { noText: true, offsetX: 220, offsetY: 49, targets: [], valueType: 'bool' }},
        inputs: {
          ANGLE: { offsetX: 0, offsetY: 29, source: null, sourceField: null, valueType: 'number' },
          THRESHOLD: { offsetX: 0, offsetY: 49, source: null, sourceField: null, valueType: 'number' },
        },
        selected: false,
      };
    case 'value-change':
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
  return null; // this is an error friend
}
